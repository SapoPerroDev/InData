document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const username = document.getElementById('user').value;
  const password = document.getElementById('psw').value;

  console.log('Intentando iniciar sesión con:', username);

  const response = await fetch('http://127.0.0.1:8000/api/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

  const messageDiv = document.getElementById('message');

  if (response.ok) {
    const data = await response.json();
    messageDiv.style.color = 'green';
    messageDiv.textContent = '¡Login exitoso!';
    console.log('Token recibido:', data.token); // Guarda el token si es necesario
  } else {
    const error = await response.json();
    messageDiv.style.color = 'red';
    messageDiv.textContent = error.detail || 'Credenciales incorrectas';
  }
});
