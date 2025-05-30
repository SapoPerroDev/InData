// Solo el admin/superuser puede eliminar infantes seleccionados por checkbox
function inicializarEliminarInfantes() {
  setTimeout(() => {
    const btn = document.getElementById("eliminar-infantes-btn");
    // Solo mostrar si es admin/superuser
    let tipo = localStorage.getItem("user_type");
    if (!tipo && window.user_type) tipo = window.user_type;
    if (btn) {
      if (tipo === "admin" || tipo === "superuser") {
        btn.style.display = "";
        btn.onclick = async () => {
          const seleccionados = Array.from(
            document.querySelectorAll(".check-infante:checked")
          ).map((cb) => cb.getAttribute("data-id"));
          if (seleccionados.length === 0) {
            alert("Seleccione al menos un infante para eliminar.");
            return;
          }
          if (!confirm("¿Está seguro de eliminar los infantes seleccionados?"))
            return;
          const token = localStorage.getItem("access_token");
          let exito = true;
          for (const id of seleccionados) {
            const res = await fetch(`http://127.0.0.1:8000/api/infantes/${id}/`, {
              method: "DELETE",
              headers: {
                Authorization: "Bearer " + token,
              },
            });
            if (!res.ok) exito = false;
          }
          if (exito) {
            alert("Infante(s) eliminado(s) correctamente.");
          } else {
            alert("Ocurrió un error al eliminar uno o más infantes.");
          }
          if (window.cargarInfantes) {
            Promise.resolve(window.cargarInfantes()).then(() => {
              setTimeout(inicializarEliminarInfantes, 100);
            });
          } else {
            setTimeout(inicializarEliminarInfantes, 100);
          }
        };
      } else {
        btn.style.display = "none";
        btn.onclick = null;
      }
    }
  }, 0);
}

window.inicializarEliminarInfantes = inicializarEliminarInfantes;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarEliminarInfantes);
} else {
  inicializarEliminarInfantes();
}
