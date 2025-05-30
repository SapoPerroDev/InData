// Permite editar todos los campos de la madre en un modal

function crearModalEditarMadre() {
  let modal = document.getElementById("modal-editar-madre");
  if (modal) {
    modal.remove();
  }
  modal = document.createElement("div");
  modal.id = "modal-editar-madre";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100vw";
  modal.style.height = "100vh";
  modal.style.background = "rgba(0,0,0,0.4)";
  modal.style.display = "block";
  modal.style.zIndex = "9999";
  modal.style.overflow = "hidden"; // Evita scroll en el fondo

  modal.innerHTML = `
    <div id="modal-editar-madre-content" style="background:#fff;max-width:500px;margin:60px auto;padding:2rem;border-radius:10px;position:relative;max-height:90vh;overflow-y:auto;">
      <button id="cerrar-modal-editar-madre" style="position:absolute;top:10px;right:10px;font-size:1.3rem;line-height:1;color:#fff;background:#ff4d4d;border:none;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 8px rgba(255,77,77,0.12);padding:0;">&#10005;</button>
      <h2>Editar Madre</h2>
      <form id="form-editar-madre">
        <input type="hidden" id="editar-id-madre" />
        <label>Usuario:</label>
        <input type="text" id="editar-username" required />
        <label>Contraseña:</label>
        <input type="password" id="editar-password" autocomplete="new-password" />
        <label>Tipo:</label>
        <select id="editar-tipo" required>
          <option value="madre">Madre Comunitaria</option>
          <option value="admin">Administrador EAS</option>
        </select>
        <label>DNI:</label>
        <input type="text" id="editar-dni" required />
        <label>Primer Nombre:</label>
        <input type="text" id="editar-p-nombre" required />
        <label>Segundo Nombre:</label>
        <input type="text" id="editar-s-nombre" />
        <label>Primer Apellido:</label>
        <input type="text" id="editar-p-apellido" required />
        <label>Segundo Apellido:</label>
        <input type="text" id="editar-s-apellido" />
        <label>Teléfono:</label>
        <input type="text" id="editar-telefono" required />
        <label>Dirección:</label>
        <input type="text" id="editar-direccion" required />
        <label>EAS:</label>
        <select id="editar-id-eas" required></select>
        <button type="submit" style="margin-top:1rem;background:#1976d2;color:#fff;border:none;border-radius:8px;padding:8px 20px;font-weight:bold;font-size:1rem;box-shadow:0 2px 8px rgba(25,118,210,0.10);transition:background 0.2s;">Guardar Cambios</button>
      </form>
      <div id="msg-editar-madre" style="margin-top:10px;color:red"></div>
    </div>
  `;
  document.body.appendChild(modal);

  // Evita el scroll del fondo cuando el modal está abierto
  document.body.style.overflow = "hidden";

  // Restaurar scroll del fondo al cerrar el modal
  function cerrarModal() {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }

  document.getElementById("cerrar-modal-editar-madre").onclick = cerrarModal;
  modal.onclick = (e) => {
    if (e.target === modal) cerrarModal();
  };
}

async function cargarOpcionesEASEditar() {
  const token = localStorage.getItem("access_token");
  const selectEas = document.getElementById("editar-id-eas");
  if (selectEas) {
    selectEas.innerHTML = "<option value=''>Cargando...</option>";
    const res = await fetch("http://127.0.0.1:8000/api/entidades/", {
      headers: { Authorization: "Bearer " + token },
    });
    if (res.ok) {
      const data = await res.json();
      selectEas.innerHTML = "";
      data.forEach(
        (eas) =>
          (selectEas.innerHTML += `<option value="${eas.id}">${eas.nombre}</option>`)
      );
    }
  }
}

async function mostrarModalEditarMadre(id) {
  crearModalEditarMadre();
  await cargarOpcionesEASEditar();

  const token = localStorage.getItem("access_token");
  // Trae la madre
  const res = await fetch(`http://127.0.0.1:8000/api/madres/${id}/`, {
    headers: { Authorization: "Bearer " + token },
  });
  if (!res.ok) {
    document.getElementById("msg-editar-madre").textContent =
      "No se pudo cargar la madre.";
    document.getElementById("modal-editar-madre").style.display = "block";
    return;
  }
  const madre = await res.json();

  // Trae el username real usando el id de user
  let username = "";
  let userId = madre.user;
  if (madre.user) {
    try {
      const userRes = await fetch(
        `http://127.0.0.1:8000/api/django-users/${madre.user}/`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      if (userRes.ok) {
        const userObj = await userRes.json();
        username = userObj.username || madre.user;
        userId = userObj.id; // Asegura que userId sea el pk numérico
      } else {
        username = madre.user;
      }
    } catch {
      username = madre.user;
    }
  }

  document.getElementById("editar-id-madre").value = madre.id;
  document.getElementById("editar-username").value = username;
  document.getElementById("editar-username").dataset.userid = userId;
  document.getElementById("editar-password").value = "";
  document.getElementById("editar-tipo").value = madre.tipo || "";
  document.getElementById("editar-dni").value = madre.dni || "";
  document.getElementById("editar-p-nombre").value = madre.p_nombre || "";
  document.getElementById("editar-s-nombre").value = madre.s_nombre || "";
  document.getElementById("editar-p-apellido").value = madre.p_apellido || "";
  document.getElementById("editar-s-apellido").value = madre.s_apellido || "";
  document.getElementById("editar-telefono").value = madre.telefono || "";
  document.getElementById("editar-direccion").value = madre.direccion || "";
  document.getElementById("editar-id-eas").value =
    madre.id_eas && madre.id_eas.id ? madre.id_eas.id : madre.id_eas || "";

  document.getElementById("msg-editar-madre").textContent = "";
  document.getElementById("modal-editar-madre").style.display = "block";

  // Ajusta el modal para que siempre sea visible y centrado
  const modalDiv = document.getElementById("modal-editar-madre");
  if (modalDiv) {
    modalDiv.style.overflow = "auto";
    modalDiv.firstElementChild.style.maxHeight = "90vh";
    modalDiv.firstElementChild.style.overflowY = "auto";
  }

  // Asociar submit al formulario del modal (siempre, ya que el modal se recrea)
  const form = document.getElementById("form-editar-madre");
  if (form) {
    form.onsubmit = guardarCambiosMadre;
  }
}

async function guardarCambiosMadre(e) {
  e.preventDefault();
  const token = localStorage.getItem("access_token");
  const id = document.getElementById("editar-id-madre").value;
  const password = document.getElementById("editar-password").value;
  const username = document.getElementById("editar-username").value;
  const userId = document.getElementById("editar-username").dataset.userid;

  // 1. Actualizar el usuario de Django si cambió username o password
  let userUpdateOk = true;
  let userUpdateError = "";
  if (userId && (username || password)) {
    const userBody = {};
    if (username) userBody.username = username;
    if (password) userBody.password = password;
    const userRes = await fetch(
      `http://127.0.0.1:8000/api/django-users/${userId}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(userBody),
      }
    );
    if (!userRes.ok) {
      userUpdateOk = false;
      const err = await userRes.json();
      userUpdateError = JSON.stringify(err);
    }
  }

  if (!userUpdateOk) {
    document.getElementById("msg-editar-madre").style.color = "red";
    document.getElementById("msg-editar-madre").textContent =
      "Error al actualizar usuario: " + userUpdateError;
    return;
  }

  // 2. Actualizar el perfil madre (sin enviar username ni password, solo el pk user)
  const body = {
    user: userId ? Number(userId) : undefined,
    tipo: document.getElementById("editar-tipo").value,
    dni: document.getElementById("editar-dni").value,
    p_nombre: document.getElementById("editar-p-nombre").value,
    s_nombre: document.getElementById("editar-s-nombre").value,
    p_apellido: document.getElementById("editar-p-apellido").value,
    s_apellido: document.getElementById("editar-s-apellido").value,
    telefono: document.getElementById("editar-telefono").value,
    direccion: document.getElementById("editar-direccion").value,
    id_eas: document.getElementById("editar-id-eas").value,
  };
  const res = await fetch(`http://127.0.0.1:8000/api/madres/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(body),
  });
  if (res.ok) {
    document.getElementById("msg-editar-madre").style.color = "green";
    document.getElementById("msg-editar-madre").textContent =
      "Madre actualizada correctamente.";
    setTimeout(() => {
      document.getElementById("modal-editar-madre").style.display = "none";
      if (window.cargarMadres) window.cargarMadres();
    }, 1000);
  } else {
    const error = await res.json();
    document.getElementById("msg-editar-madre").style.color = "red";
    document.getElementById("msg-editar-madre").textContent =
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
