document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginTest').addEventListener('click', async () => {
      try {
        const response = await fetch('/login');
        const result = await response.json();
        const messageDiv = document.getElementById('message');
        
        // Limpiar las clases de mensaje previas
        messageDiv.classList.remove('alert-success', 'alert-danger');
  
        if (result.success) {
          // Mostrar mensaje de autenticación correcta
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
  
    document.getElementById('trackingForm').addEventListener('submit', async (event) => {
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
  
        // Mostrar los datos en pantalla
        resultDiv.innerHTML = `
          <p><strong>Estado:</strong> ${result.estado}</p>
          <p><strong>Tipo:</strong> ${result.tipo}</p>
          <p><strong>Fecha de Creación:</strong> ${result.fechaCreacion}</p>
          <p><strong>Descripción del Servicio:</strong> ${result.descripcionServicio}</p>
          <p><strong>Número de Bulto:</strong> ${result.numeroDeBulto}</p>
          <p><strong>Número de Envío:</strong> ${result.numeroDeEnvio}</p>
          <p><strong>Totalizador:</strong> ${result.totalizador}</p>
        `;
      } catch (error) {
        console.error('Error:', error);
        const resultDiv = document.getElementById('result');
        resultDiv.textContent = `Error: ${error.message}`;
      }
    });
  });
  