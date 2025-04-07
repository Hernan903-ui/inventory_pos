from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
import io
import base64

def generate_pdf_report(report_type, start_date=None, end_date=None):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    
    styles = getSampleStyleSheet()
    title_style = styles['Title']
    normal_style = styles['Normal']
    
    title = "Reporte de Ventas"
    if report_type == "inventory":
        title = "Reporte de Inventario"
    elif report_type == "products":
        title = "Reporte de Productos"
    
    elements.append(Paragraph(title, title_style))
    
    # Aquí agregarías la lógica para generar los datos del informe
    # Por simplicidad, se incluye un ejemplo básico
    
    data = [
        ['Fecha', 'Producto', 'Cantidad', 'Precio'],
        ['2023-10-01', 'Producto 1', 5, '$15.00'],
        ['2023-10-02', 'Producto 2', 3, '$25.00']
    ]
    
    table = Table(data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    
    elements.append(table)
    
    doc.build(elements)
    buffer.seek(0)
    
    pdf_data = base64.b64encode(buffer.read()).decode('utf-8')
    return pdf_data