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
  });
  