document.addEventListener('DOMContentLoaded', () => {
    const svgSignature = document.getElementById('svg-signature');
    const clearBtn = document.getElementById('clear-btn');
    const saveBtn = document.getElementById('save-btn');

    let isDrawing = false;
    let path;
    const SVG_NS = "http://www.w3.org/2000/svg";

    // Manejadores de eventos para el ratón
    svgSignature.addEventListener('mousedown', startDrawing);
    svgSignature.addEventListener('mousemove', draw);
    svgSignature.addEventListener('mouseup', stopDrawing);
    svgSignature.addEventListener('mouseout', stopDrawing);

    // Manejadores de eventos para dispositivos táctiles
    svgSignature.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Evita el desplazamiento de la página
        startDrawing(e.touches[0]);
    });
    svgSignature.addEventListener('touchmove', (e) => {
        e.preventDefault();
        draw(e.touches[0]);
    });
    svgSignature.addEventListener('touchend', stopDrawing);

    // Iniciar un nuevo trazo
    function startDrawing(e) {
        isDrawing = true;
        const coords = getCoords(e);
        path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('d', `M${coords.x} ${coords.y}`);
        svgSignature.appendChild(path);
    }

    // Dibujar el trazo
    function draw(e) {
        if (!isDrawing) return;
        const coords = getCoords(e);
        const d = path.getAttribute('d');
        path.setAttribute('d', `${d} L${coords.x} ${coords.y}`);
    }

    // Detener el trazo
    function stopDrawing() {
        isDrawing = false;
    }

    // Obtener las coordenadas relativas al SVG
    function getCoords(e) {
        const rect = svgSignature.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    // Limpiar el lienzo
    clearBtn.addEventListener('click', () => {
        svgSignature.innerHTML = '';
    });

    // Guardar la firma como un archivo SVG
	saveBtn.addEventListener('click', () => {
	// 1. Clonar el SVG para no modificar el original de la interfaz
	const clonedSvg = svgSignature.cloneNode(true);
	  
	// 2. Asegurar que tenga los atributos necesarios para ser interpretado como imagen
	clonedSvg.setAttribute("version", "1.1");
	clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	  
	// Obtener dimensiones reales (importante para navegadores como Firefox)
	const width = svgSignature.clientWidth || 500;
	const height = svgSignature.clientHeight || 200;
	clonedSvg.setAttribute("width", width);
	clonedSvg.setAttribute("height", height);

	const svgData = new XMLSerializer().serializeToString(clonedSvg);
	const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
	const url = URL.createObjectURL(svgBlob);

	const img = new Image();
	img.onload = () => {
		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext('2d');

		// Opcional: Fondo blanco (por defecto es transparente)
		// ctx.fillStyle = "white";
		// ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.drawImage(img, 0, 0);

		const pngUrl = canvas.toDataURL("image/png");
		const link = document.createElement('a');
		link.href = pngUrl;
		link.download = 'firma.png';
		link.click();

		URL.revokeObjectURL(url);
	};
	  
		img.src = url;
	});
/*
// Guardar la firma como un archivo SVG
    saveBtn.addEventListener('click', () => {
        const svgCode = svgSignature.outerHTML;
        const blob = new Blob([svgCode], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'firma.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });
*/

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registrado con éxito', reg))
      .catch(err => console.warn('Error al registrar el Service Worker', err));
  });
};

});