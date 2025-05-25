function clearField(fieldId) {
    document.getElementById(fieldId).value = '';
}

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("user").value;
    const password = document.getElementById("psw").value;

    const response = await fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const messageDiv = document.getElementById("message");

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("user_type", data.user_type);

      // Mapeo de tipo de usuario a ruta
      const dashboardRoutes = {
        superuser: "/admin/",
        admin: "/frontend/templates/dashboard_admin.html",
        madre: "/frontend/templates/dashboard_madre.html",
      };

      const redirectUrl = dashboardRoutes[data.user_type];
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        messageDiv.innerHTML = "No se pudo determinar el tipo de usuario.";
      }
    } else {
      clearField("user");
      clearField("psw");
      // Manejo de errores
      const error = await response.json();
      messageDiv.className = "login-message error";
      messageDiv.innerHTML =
        `<span class="icon-attention"><i class="fa-solid fa-triangle-exclamation"></i></span>` +
        (error.detail || error.error || "Credenciales incorrectas");
    }
  });
