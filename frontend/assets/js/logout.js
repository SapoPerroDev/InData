document.getElementById("logoutBtn").addEventListener("click", function () {
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
