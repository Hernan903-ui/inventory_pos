document.addEventListener('DOMContentLoaded', function() {
    const videoFeed = document.getElementById('video-feed');
    const scannedCode = document.getElementById('scanned-code');
    const scanButton = document.getElementById('scan-button');
    const stopButton = document.getElementById('stop-button');
    
    let scanning = false;
    
    // Mostrar el flujo de video de la cámara
    function startVideoFeed() {
        fetch('/api/barcode/video_feed')
            .then(response => {
                if (!response.ok) throw new Error('Error al acceder a la cámara');
                videoFeed.src = '/api/barcode/video_feed';
                scanning = true;
                scanButton.style.display = 'none';
                stopButton.style.display = 'inline-block';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al acceder a la cámara');
            });
    }
    
    // Detener el flujo de video
    function stopVideoFeed() {
        videoFeed.src = '';
        scanning = false;
        scanButton.style.display = 'inline-block';
        stopButton.style.display = 'none';
    }
    
    // Actualizar el código escaneado
    function updateScannedCode() {
        if (!scanning) return;
        
        fetch('/api/barcode/last_scanned_code')
            .then(response => response.json())
            .then(data => {
                scannedCode.textContent = data.code || 'Ningún código escaneado';
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    
    // Evento para el botón de inicio de escaneo
    scanButton.addEventListener('click', startVideoFeed);
    
    // Evento para el botón de detención de escaneo
    stopButton.addEventListener('click', stopVideoFeed);
    
    // Actualizar el código escaneado cada segundo
    setInterval(updateScannedCode, 1000);
});