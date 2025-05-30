function crearModalEditarInfante() {
  let modal = document.getElementById("modal-editar-infante");
  if (modal) {
    modal.remove();
  }
  modal = document.createElement("div");
  modal.id = "modal-editar-infante";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100vw";
  modal.style.height = "100vh";
  modal.style.background = "rgba(0,0,0,0.4)";
  modal.style.display = "block";
  modal.style.zIndex = "9999";
  modal.style.overflow = "hidden";

  modal.innerHTML = `
    <div id="modal-editar-infante-content" style="background:#fff;max-width:500px;margin:60px auto;padding:2rem;border-radius:10px;position:relative;max-height:90vh;overflow-y:auto;">
      <button id="cerrar-modal-editar-infante" style="position:absolute;top:10px;right:10px;font-size:1.3rem;line-height:1;color:#fff;background:#ff4d4d;border:none;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 8px rgba(255,77,77,0.12);padding:0;">&#10005;</button>
      <h2>Editar Infante</h2>
      <form id="form-editar-infante">
        <input type="hidden" id="editar-id-infante" />
        <label for="editar-tipo-dni">Tipo de Documento:</label>
        <select id="editar-tipo-dni" required></select>
        <label for="editar-dni">Número de Documento:</label>
        <input type="text" id="editar-dni" required />
        <label for="editar-p-nombre">Primer Nombre:</label>
        <input type="text" id="editar-p-nombre" required />
        <label for="editar-s-nombre">Segundo Nombre:</label>
        <input type="text" id="editar-s-nombre" />
        <label for="editar-p-apellido">Primer Apellido:</label>
        <input type="text" id="editar-p-apellido" required />
        <label for="editar-s-apellido">Segundo Apellido:</label>
        <input type="text" id="editar-s-apellido" />
        <label for="editar-tipo-focalizacion">Tipo Focalización:</label>
        <select id="editar-tipo-focalizacion" required></select>
        <button type="submit" style="margin-top:1rem;background:#1976d2;color:#fff;border:none;border-radius:8px;padding:8px 20px;font-weight:bold;font-size:1rem;box-shadow:0 2px 8px rgba(25,118,210,0.10);transition:background 0.2s;">Guardar Cambios</button>
      </form>
      <div id="msg-editar-infante" style="margin-top:10px;color:red"></div>
    </div>
  `;
  document.body.appendChild(modal);

  // No modificar el scroll general del body
  // document.body.style.overflow = "hidden"; // <-- Elimina o comenta esta línea

  function cerrarModal() {
    modal.style.display = "none";
    // No restaures el overflow del body, así el scroll general sigue funcionando
    // document.body.style.overflow = "";
  }
  document.getElementById("cerrar-modal-editar-infante").onclick = cerrarModal;
  modal.onclick = (e) => {
    if (e.target === modal) cerrarModal();
  };
}

async function cargarOpcionesSelectEditarInfante() {
  const token = localStorage.getItem("access_token");
  // Tipos DNI
  const selectDni = document.getElementById("editar-tipo-dni");
  if (selectDni) {
    selectDni.innerHTML = "<option value=''>Cargando...</option>";
    const res = await fetch("http://127.0.0.1:8000/api/tipos-dni/", {
      headers: { Authorization: "Bearer " + token },
    });
    if (res.ok) {
      const data = await res.json();
      selectDni.innerHTML = "";
      data.forEach(
        (tipo) =>
          (selectDni.innerHTML += `<option value="${tipo.id}">${tipo.tipo}</option>`)
      );
    }
  }
  // Tipos Focalización
  const selectFocal = document.getElementById("editar-tipo-focalizacion");
  if (selectFocal) {
    selectFocal.innerHTML = "<option value=''>Cargando...</option>";
    const res = await fetch("http://127.0.0.1:8000/api/tipos-focalizacion/", {
      headers: { Authorization: "Bearer " + token },
    });
    if (res.ok) {
      const data = await res.json();
      selectFocal.innerHTML = "";
      data.forEach(
        (tipo) =>
          (selectFocal.innerHTML += `<option value="${tipo.id}">${tipo.tipo}</option>`)
      );
    }
  }
}

async function mostrarModalEditarInfante(id) {
  crearModalEditarInfante();
  await cargarOpcionesSelectEditarInfante();

  const token = localStorage.getItem("access_token");
  const res = await fetch(`http://127.0.0.1:8000/api/infantes/${id}/`, {
    headers: { Authorization: "Bearer " + token },
  });
  if (!res.ok) {
    document.getElementById("msg-editar-infante").textContent =
      "No se pudo cargar el infante.";
    document.getElementById("modal-editar-infante").style.display = "block";
    return;
  }
  const infante = await res.json();

  // Espera a que los selects estén llenos antes de asignar valores
  setTimeout(() => {
    document.getElementById("editar-id-infante").value = infante.id;
    document.getElementById("editar-tipo-dni").value =
      infante.tipo_dni && infante.tipo_dni.id
        ? infante.tipo_dni.id
        : infante.tipo_dni;
    document.getElementById("editar-dni").value = infante.dni || "";
    document.getElementById("editar-p-nombre").value = infante.p_nombre || "";
    document.getElementById("editar-s-nombre").value = infante.s_nombre || "";
    document.getElementById("editar-p-apellido").value =
      infante.p_apellido || "";
    document.getElementById("editar-s-apellido").value =
      infante.s_apellido || "";
    document.getElementById("editar-tipo-focalizacion").value =
      infante.tipo_focalizacion && infante.tipo_focalizacion.id
        ? infante.tipo_focalizacion.id
        : infante.tipo_focalizacion;

    // Guarda el id_uds en el modal para el PUT
    document.getElementById("form-editar-infante").dataset.iduds =
      infante.id_uds && infante.id_uds.id ? infante.id_uds.id : infante.id_uds;

    document.getElementById("msg-editar-infante").textContent = "";
    document.getElementById("modal-editar-infante").style.display = "block";

    // Ajusta el modal para que siempre sea visible y centrado
    const modalDiv = document.getElementById("modal-editar-infante");
    if (modalDiv) {
      modalDiv.style.overflow = "auto";
      modalDiv.firstElementChild.style.maxHeight = "90vh";
      modalDiv.firstElementChild.style.overflowY = "auto";
    }

    // Asociar submit al formulario del modal (siempre, ya que el modal se recrea)
    const form = document.getElementById("form-editar-infante");
    if (form) {
      form.onsubmit = guardarCambiosInfante;
    }
  }, 100); // Espera 100ms para asegurar que los selects estén llenos
}

async function guardarCambiosInfante(e) {
  e.preventDefault();
  const token = localStorage.getItem("access_token");
  const id = document.getElementById("editar-id-infante").value;
  // Recupera el id_uds guardado en el modal
  const id_uds = document.getElementById("form-editar-infante").dataset.iduds;
  const body = {
    id_uds: id_uds,
    tipo_dni: document.getElementById("editar-tipo-dni").value,
    dni: document.getElementById("editar-dni").value,
    p_nombre: document.getElementById("editar-p-nombre").value,
    s_nombre: document.getElementById("editar-s-nombre").value,
    p_apellido: document.getElementById("editar-p-apellido").value,
    s_apellido: document.getElementById("editar-s-apellido").value,
    tipo_focalizacion: document.getElementById("editar-tipo-focalizacion")
      .value,
  };
  const res = await fetch(`http://127.0.0.1:8000/api/infantes/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(body),
  });
  if (res.ok) {
    document.getElementById("msg-editar-infante").style.color = "green";
    document.getElementById("msg-editar-infante").textContent =
      "Infante actualizado correctamente.";
    setTimeout(() => {
      document.getElementById("modal-editar-infante").style.display = "none";
      if (window.cargarInfantes) window.cargarInfantes();
    }, 1000);
  } else {
    const error = await res.json();
    document.getElementById("msg-editar-infante").style.color = "red";
    document.getElementById("msg-editar-infante").textContent =
      "Error: " + JSON.stringify(error);
  }
}

function inicializarEditarMadres() {
  setTimeout(() => {
    document.querySelectorAll(".editar-madre-btn").forEach((btn) => {
      btn.style.display = "";
      btn.onclick = function () {
        const id = this.getAttribute("data-id");
        mostrarModalEditarMadre(id);
      };
    });
  }, 0);
}

window.inicializarEditarMadres = inicializarEditarMadres;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarEditarMadres);
} else {
  inicializarEditarMadres();
}

function inicializarEditarInfantes() {
  setTimeout(() => {
    // Limpia listeners previos para evitar acumulación
    document.querySelectorAll(".editar-infante-btn").forEach((btn) => {
      const nuevoBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(nuevoBtn, btn);
    });

    let tipo = localStorage.getItem("user_type");
    if (!tipo && window.user_type) tipo = window.user_type;
    document.querySelectorAll(".editar-infante-btn").forEach((btn) => {
      if (tipo === "madre" || tipo === "admin" || tipo === "superuser") {
        btn.style.display = "";
        btn.onclick = function (e) {
          e.preventDefault();
          const id = this.getAttribute("data-id");
          mostrarModalEditarInfante(id);
        };
      } else {
        btn.style.display = "none";
      }
    });
  }, 0);
}

window.inicializarEditarInfantes = inicializarEditarInfantes;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarEditarInfantes);
} else {
  inicializarEditarInfantes();
}
