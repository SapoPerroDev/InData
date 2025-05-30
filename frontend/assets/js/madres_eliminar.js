// Solo el admin/superuser puede eliminar madres seleccionadas por checkbox

function inicializarEliminarMadres() {
  setTimeout(() => {
    const btn = document.getElementById("eliminar-madres-btn");
    let tipo = localStorage.getItem("user_type");
    if (!tipo && window.user_type) tipo = window.user_type;
    if (btn) {
      if (tipo === "admin" || tipo === "superuser") {
        btn.style.display = "";
        // Limpia cualquier evento anterior para evitar duplicados
        btn.onclick = null;
        btn.addEventListener("click", async () => {
          const seleccionados = Array.from(
            document.querySelectorAll(".check-madre:checked")
          ).map((cb) => cb.getAttribute("data-id"));
          if (seleccionados.length === 0) {
            alert("Seleccione al menos una madre para eliminar.");
            return;
          }
          if (!confirm("¿Está seguro de eliminar las madres seleccionadas?"))
            return;
          const token = localStorage.getItem("access_token");
          let exito = true;
          for (const id of seleccionados) {
            const res = await fetch(`http://127.0.0.1:8000/api/madres/${id}/`, {
              method: "DELETE",
              headers: {
                Authorization: "Bearer " + token,
              },
            });
            if (!res.ok) exito = false;
          }
          if (exito) {
            alert("Madre(s) eliminada(s) correctamente.");
          } else {
            alert("Ocurrió un error al eliminar una o más madres.");
          }
          if (window.cargarMadres) {
            Promise.resolve(window.cargarMadres()).then(() => {
              setTimeout(inicializarEliminarMadres, 100);
            });
          } else {
            setTimeout(inicializarEliminarMadres, 100);
          }
        });
      } else {
        btn.style.display = "none";
        btn.onclick = null;
      }
    }
  }, 0);
}

window.inicializarEliminarMadres = inicializarEliminarMadres;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarEliminarMadres);
} else {
  inicializarEliminarMadres();
}