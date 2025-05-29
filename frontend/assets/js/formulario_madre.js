async function cargarEAS() {
  const token = localStorage.getItem("access_token");
  const select = document.getElementById("id_eas");
  select.innerHTML = "<option value=''>Cargando...</option>";
  try {
    const res = await fetch("http://127.0.0.1:8000/api/entidades/", {
      headers: { Authorization: "Bearer " + token },
    });
    const data = await res.json();
    select.innerHTML = "";
    data.forEach((eas) => {
      // SOLO usa el id de la tabla como value
      const opt = document.createElement("option");
      opt.value = eas.id;
      opt.textContent = eas.nombre + (eas.nit ? ` (NIT: ${eas.nit})` : "");
      select.appendChild(opt);
    });
  } catch {
    select.innerHTML = "<option value=''>Error al cargar EAS</option>";
  }
}

async function registrarMadre(e) {
  e.preventDefault();
  const msg = document.getElementById("msg-madre");
  if (msg) msg.textContent = "";

  // Validar contraseñas
  const password = document.getElementById("password").value;
  const password2 = document.getElementById("password2").value;
  if (password !== password2) {
    if (msg) msg.textContent = "Las contraseñas no coinciden.";
    return;
  }

  // Validar campos del perfil ANTES de crear el usuario
  const idEasValue = document.getElementById("id_eas").value;
  const perfilPayload = {
    tipo: "madre",
    dni: document.getElementById("dni").value,
    p_nombre: document.getElementById("p_nombre").value,
    s_nombre: document.getElementById("s_nombre").value,
    p_apellido: document.getElementById("p_apellido").value,
    s_apellido: document.getElementById("s_apellido").value,
    telefono: document.getElementById("telefono").value,
    direccion: document.getElementById("direccion").value,
    id_eas: idEasValue ? Number(idEasValue) : undefined,
  };

  // Validación básica de campos requeridos del perfil
  for (const [key, value] of Object.entries(perfilPayload)) {
    if (
      key !== "s_nombre" &&
      key !== "s_apellido" && // estos pueden ser opcionales
      (!value || value === "" || value === undefined)
    ) {
      msg.textContent = "Por favor complete todos los campos obligatorios.";
      return;
    }
  }

  // Validar campos del usuario
  const username = document.getElementById("username").value.trim();
  if (!username) {
    msg.textContent = "El nombre de usuario es obligatorio.";
    return;
  }
  if (!password) {
    msg.textContent = "La contraseña es obligatoria.";
    return;
  }

  const token = localStorage.getItem("access_token");
  const userPayload = {
    username: username,
    password: password,
  };

  try {
    // Crear usuario y obtener su id
    const userRes = await fetch("http://127.0.0.1:8000/api/usuarios/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(userPayload),
    });

    let userData = null;
    if (!userRes.ok) {
      const err = await userRes.json();
      if (err.username && Array.isArray(err.username)) {
        msg.textContent = "Error: " + err.username[0];
      } else if (err.detail) {
        msg.textContent = "Error al crear usuario: " + err.detail;
      } else {
        msg.textContent = "Error al crear usuario: " + JSON.stringify(err);
      }
      console.error("Error al crear usuario:", err);
      return;
    } else {
      userData = await userRes.json();
    }

    // Ahora que el usuario fue creado exitosamente, crea el perfil
    perfilPayload.user = userData.id;

    // Mostrar payload en consola para depuración
    console.log("Payload perfil madre:", perfilPayload);

    const perfilRes = await fetch("http://127.0.0.1:8000/api/madres/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(perfilPayload),
    });

    if (!perfilRes.ok) {
      const err = await perfilRes.json();
      // Si falla el perfil, podrías eliminar el usuario recién creado aquí si lo deseas
      // await fetch(`http://127.0.0.1:8000/api/usuarios/${userData.id}/`, { method: "DELETE", headers: { Authorization: "Bearer " + token } });
      console.error("Error al crear perfil:", err);
      if (err.id_eas && Array.isArray(err.id_eas)) {
        msg.textContent = "Error: " + err.id_eas[0];
      } else if (err.user && Array.isArray(err.user)) {
        msg.textContent = "Error: " + err.user[0];
      } else if (err.detail) {
        msg.textContent = "Error al crear perfil: " + err.detail;
      } else {
        msg.textContent = "Error al crear perfil: " + JSON.stringify(err);
      }
      return;
    }
    if (msg) msg.textContent = "Madre registrada correctamente.";
    document.getElementById("form-madre").reset();
  } catch (error) {
    if (msg) msg.textContent = "Error inesperado: " + error.message;
  }
}

export function inicializarFormularioMadre() {
  cargarEAS();
  document
    .getElementById("form-madre")
    .addEventListener("submit", registrarMadre);
}
