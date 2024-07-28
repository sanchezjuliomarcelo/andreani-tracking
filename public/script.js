document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginTest').addEventListener('click', async () => {
    try {
      const response = await fetch('/api/login');
      const result = await response.json();
      const messageDiv = document.getElementById('message');
      
      // Limpiar las clases de mensaje previas
      messageDiv.classList.remove('alert-success', 'alert-danger');

      if (result.success) {
        messageDiv.textContent = result.message;
        messageDiv.classList.add('alert', 'alert-success');

        // Guardar el token en localStorage y sessionStorage
        const token = JSON.parse(result.token).token;
        localStorage.setItem('andreaniToken', token);
        sessionStorage.setItem('andreaniToken', token);
      } else {
        messageDiv.textContent = `Error: ${result.message}`;
        messageDiv.classList.add('alert', 'alert-danger');
      }
    } catch (error) {
      const messageDiv = document.getElementById('message');
      messageDiv.textContent = `Error durante la autenticación: ${error.message}`;
      messageDiv.classList.add('alert', 'alert-danger');
    }
  });

  document.getElementById('buscar').addEventListener('click', async (event) => {
    event.preventDefault();
    const trackingNumber = document.getElementById('trackingNumber').value;
    const token = sessionStorage.getItem('andreaniToken');

    if (!token) {
      alert('Debe autenticarse primero.');
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("x-authorization-token", token);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    try {
      const response = await fetch(`/proxy/v2/ordenes-de-envio/${trackingNumber}`, requestOptions);
      const result = await response.json();
      console.log('API response received:', result);

      const resultDiv = document.getElementById('result');

      // Asegurarse de que los campos existen antes de acceder a ellos
      const estado = result.estado || 'N/A';
      const tipo = result.tipo || 'N/A';
      const fechaCreacion = result.fechaCreacion || 'N/A';
      const descripcionServicio = result.descripcionServicio || 'N/A';
      const numeroDeBulto = result.bultos?.[0]?.numeroDeBulto || 'N/A';
      const numeroDeEnvio = result.numeroDeEnvio || 'N/A';
      const totalizador = result.totalizador || 'N/A';

      // Mostrar los datos en pantalla
      resultDiv.innerHTML = `
        <p><strong>Estado:</strong> ${estado}</p>
        <p><strong>Tipo:</strong> ${tipo}</p>
        <p><strong>Fecha de Creación:</strong> ${fechaCreacion}</p>
        <p><strong>Descripción del Servicio:</strong> ${descripcionServicio}</p>
        <p><strong>Número de Bulto:</strong> ${numeroDeBulto}</p>
        <p><strong>Número de Envío:</strong> ${numeroDeEnvio}</p>
        <p><strong>Totalizador:</strong> ${totalizador}</p>
      `;
    } catch (error) {
      console.error('Error:', error);
      const resultDiv = document.getElementById('result');
      resultDiv.textContent = `Error: ${error.message}`;
    }
  });

  document.getElementById('trazasButton').addEventListener('click', async (event) => {
    event.preventDefault();
    const trackingNumber = document.getElementById('trackingNumber').value;
    const token = sessionStorage.getItem('andreaniToken');

    if (!token) {
      alert('Debe autenticarse primero.');
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("x-authorization-token", token);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    try {
      const response = await fetch(`/proxy/v2/envios/${trackingNumber}/trazas`, requestOptions);
      const result = await response.json();
      console.log('API response received:', result);

      const trazasResultDiv = document.getElementById('trazasResult');
      
      // Crear una tabla para mostrar los eventos de trazas
      let tableContent = `
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Traducción</th>
              <th>Sucursal</th>
              <th>Ciclo</th>
            </tr>
          </thead>
          <tbody>
      `;

      result.eventos.forEach(evento => {
        const fecha = evento.Fecha || 'N/A';
        const estado = evento.Estado || 'N/A';
        const traduccion = evento.Traduccion || 'N/A';
        const sucursal = evento.Sucursal || 'N/A';
        const ciclo = evento.Ciclo || 'N/A';
        tableContent += `
          <tr>
            <td>${fecha}</td>
            <td>${estado}</td>
            <td>${traduccion}</td>
            <td>${sucursal}</td>
            <td>${ciclo}</td>
          </tr>
        `;
      });

      tableContent += `
          </tbody>
        </table>
      `;

      trazasResultDiv.innerHTML = tableContent;
    } catch (error) {
      console.error('Error:', error);
      const trazasResultDiv = document.getElementById('trazasResult');
      trazasResultDiv.textContent = `Error: ${error.message}`;
    }
  });

  document.getElementById('constancia').addEventListener('click', async (event) => {
    event.preventDefault();
    const trackingNumber = document.getElementById('trackingNumber').value;
    const token = sessionStorage.getItem('andreaniToken');

    if (!token) {
      alert('Debe autenticarse primero.');
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("x-authorization-token", token);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    try {
      const response = await fetch(`/proxy/v1/envios/${trackingNumber}/multimedia`, requestOptions);
      const result = await response.json();
      console.log('API response received:', result);

      const resultDiv = document.getElementById('constanciaResult');
      
      if (!resultDiv) {
        console.error('El elemento con id "constanciaResult" no existe en el DOM.');
        return;
      }

      // Crear el contenido HTML para mostrar y descargar la imagen o archivo TIFF
      let multimediaContent = '';
      result.multimedia.forEach(item => {
        const isTiff = item.cotenido.endsWith('.tif');
        multimediaContent += `
          <p><strong>${item.meta}:</strong></p>
          <p><a href="${item.cotenido}" target="_blank">Ver/Descargar</a></p>
        `;
        if (!isTiff) {
          multimediaContent += `<img src="${item.cotenido}" alt="${item.meta}" style="max-width: 100%;">`;
        }
      });

      resultDiv.innerHTML = multimediaContent;
    } catch (error) {
      console.error('Error:', error);
      const resultDiv = document.getElementById('constanciaResult');
      resultDiv.textContent = `Error: ${error.message}`;
    }
  });

  document.getElementById('reset').addEventListener('click', () => {
    document.getElementById('trackingNumber').value = '';
    document.getElementById('result').innerHTML = '';
    document.getElementById('trazasResult').innerHTML = '';
    document.getElementById('constanciaResult').innerHTML = '';
    document.getElementById('message').innerHTML = '';
  });
});
