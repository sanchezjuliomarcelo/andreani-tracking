document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginTest').addEventListener('click', async () => {
      try {
        const response = await fetch('/login');
        const result = await response.json();
        const messageDiv = document.getElementById('message');
  
        if (result.success) {
          messageDiv.textContent = result.message;
          messageDiv.classList.add('alert', 'alert-success');
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
  