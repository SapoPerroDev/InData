document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("toggle-logout-panel");
  const logoutPanel = document.getElementById("logout-panel");
  const logoutBtn = document.getElementById("logoutBtn");

  if (toggleBtn && logoutPanel) {
    toggleBtn.addEventListener("click", function () {
      const isOpen = logoutPanel.style.display === "block";
      logoutPanel.style.display = isOpen ? "none" : "block";
      toggleBtn.classList.toggle("open", !isOpen);
    });

    // Opcional: cerrar el panel si se hace clic fuera
    document.addEventListener("click", function (e) {
      if (!logoutPanel.contains(e.target) && !toggleBtn.contains(e.target)) {
        logoutPanel.style.display = "none";
        toggleBtn.classList.remove("open");
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      // Elimina los tokens y tipo de usuario
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_type");

      // Previene volver atrás con el historial
      window.location.replace("/frontend/templates/login.html");
      history.pushState(null, null, "/frontend/templates/login.html");
      window.addEventListener("popstate", function () {
        window.location.replace("/frontend/templates/login.html");
      });
    });
  }
});
