from flask import Blueprint, request, jsonify, Response
import cv2
from pyzbar.pyzbar import decode
import time

bp = Blueprint('barcode', __name__)

# Variable global para la cámara y el último código leído
camera = None
last_read_code = None
last_read_time = 0

def gen_frames():
    global last_read_code, last_read_time
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            # Decodificar códigos de barras
            codes = decode(frame)
            for code in codes:
                code_data = code.data.decode('utf-8')
                current_time = time.time()
                # Evitar lecturas repetidas en un corto período de tiempo
                if code_data != last_read_code or current_time - last_read_time > 2:
                    last_read_code = code_data
                    last_read_time = current_time
                    # Aquí puedes procesar el código de barras leído
                    print(f"Código de barras leído: {code_data}")
                    # Aquí puedes llamar a una función para procesar el código
                    
                    # Por ejemplo, guardar el código en una variable para acceder desde el frontend
                    request.app.config['LAST_SCANNED_CODE'] = code_data
            
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@bp.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@bp.route('/last_scanned_code')
def last_scanned_code():
    return jsonify({'code': request.app.config.get('LAST_SCANNED_CODE', '')})

@bp.before_app_request
def init_camera():
    global camera
    if camera is None:
        camera = cv2.VideoCapture(0)
        if not camera.isOpened():
            raise Exception("No se pudo abrir la cámara")

@bp.teardown_app_request
def release_camera(exception=None):
    global camera
    if camera is not None:
        camera.release()