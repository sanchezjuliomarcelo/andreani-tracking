document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;
  
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, contrasena })
      });
  
      const result = await response.json();
      const loginMessage = document.getElementById('loginMessage');
  
      if (result.success) {
        window.location.href = '/app';
      } else {
        loginMessage.textContent = result.message;
        loginMessage.classList.add('alert', 'alert-danger');
      }
    } catch (error) {
      const loginMessage = document.getElementById('loginMessage');
      loginMessage.textContent = 'Error durante la autenticación';
      loginMessage.classList.add('alert', 'alert-danger');
    }
  });
  