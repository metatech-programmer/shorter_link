let historial = [];

// Cargar historial y mostrar contenido después de 3 segundos
window.onload = function() {
    setTimeout(() => {
        const historialGuardado = localStorage.getItem('historial');
        if (historialGuardado) {
            historial = JSON.parse(historialGuardado);
            actualizarHistorialUI();
        }
        document.getElementById('loader').style.display = 'none';
        document.getElementById('contenido').style.display = 'block';
        manejarBotonFlotante(); // Añade esta línea
    }, 1000);
}

async function acortarURL() {
    const urlInput = document.getElementById('urlInput');
    const resultado = document.getElementById('resultado');
    const url = urlInput.value;

    if (!url) {
        resultado.innerHTML = 'Por favor, ingresa una URL válida.';
        return;
    }

    resultado.innerHTML = '<div class="loader"><i class="fas fa-spinner fa-spin"></i></div>';

    try {
        const response = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`);
        
        if (response.ok) {
            const data = await response.json();
            const shortUrl = data.shorturl;
            resultado.innerHTML = `
                URL acortada: <a href="${shortUrl}" target="_blank">${shortUrl}</a>
                <button onclick="copiarAlPortapapeles('${shortUrl}', this)">Copiar</button>
                <span class="mensaje-copiado">¡Copiado al portapapeles!</span>
            `;
            agregarAlHistorial(url, shortUrl);
            urlInput.value = '';
        } else {
            resultado.innerHTML = 'Hubo un error al acortar la URL.';
        }
    } catch (error) {
        resultado.innerHTML = 'Ocurrió un error. Por favor, intenta de nuevo.';
        console.error('Error:', error);
    }
}

function agregarAlHistorial(urlOriginal, urlAcortada) {
    historial.unshift({ original: urlOriginal, acortada: urlAcortada });
    if (historial.length > 5) {
        historial.pop();
    }
    localStorage.setItem('historial', JSON.stringify(historial));
    actualizarHistorialUI();
}

function actualizarHistorialUI() {
    const historialLista = document.getElementById('historialLista');
    historialLista.innerHTML = '';
    historial.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="${item.acortada}" target="_blank">${item.acortada}</a> 
            (${item.original})
            <button onclick="copiarAlPortapapeles('${item.acortada}', this)">Copiar</button>
            <span class="mensaje-copiado">¡Copiado al portapapeles!</span>
        `;
        historialLista.appendChild(li);
    });
}

function copiarAlPortapapeles(texto, boton) {
    navigator.clipboard.writeText(texto).then(() => {
        const mensaje = boton.nextElementSibling;
        mensaje.style.display = 'inline';
        setTimeout(() => {
            mensaje.style.display = 'none';
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}

function borrarHistorial() {
    historial = [];
    localStorage.removeItem('historial');
    actualizarHistorialUI();
}

// Añade esto al final del archivo
document.getElementById('borrarHistorial').addEventListener('click', borrarHistorial);

function manejarBotonFlotante() {
    const boton = document.getElementById('botonFlotante');
    const container = document.querySelector('.container');

    function actualizarBoton() {
        if (container.scrollTop > 20) {
            boton.innerHTML = '<i class="fas fa-chevron-up"></i>';
            boton.onclick = () => container.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            boton.innerHTML = '<i class="fas fa-chevron-down"></i>';
            boton.onclick = () => container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        }
    }

    container.addEventListener('scroll', actualizarBoton);
    actualizarBoton(); // Llamada inicial para establecer el estado correcto
}
