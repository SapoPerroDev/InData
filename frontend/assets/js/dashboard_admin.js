import { cargarInfantes } from "./infantes_utils.js";
import { cargarEntidadAdministradora } from "./eas_utils.js";
import { inicializarFormularioMadre } from "./formulario_madre.js";

async function cargarInfoUser() {
  const token = localStorage.getItem("access_token");
  try {
    const response = await fetch("http://127.0.0.1:8000/api/user-info/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (!response.ok)
      throw new Error("No se pudo obtener la información del admin");
    const data = await response.json();
    document.getElementById(
      "name-user"
    ).textContent = `${data.p_nombre} ${data.p_apellido}`;
    document.getElementById("role-user").textContent =
      data.tipo === "admin" ? "Administrador EAS" : data.tipo;
  } catch (error) {
    console.error(error.message);
  }
}

async function cargarMadresParcial() {
  const token = localStorage.getItem("access_token");
  try {
    const response = await fetch("http://127.0.0.1:8000/api/madres/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (!response.ok) throw new Error("No se pudo obtener la lista de madres");
    const data = await response.json();
    const tbody = document.querySelector("#tabla-madres tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    // Si la respuesta es un objeto con 'results', usa ese array
    const madres = Array.isArray(data) ? data : data.results || [];
    if (madres.length === 0) {
      tbody.innerHTML = `<tr><td colspan="11" style="color:red;">No hay madres registradas.</td></tr>`;
      return;
    }

    madres.forEach((madre, idx) => {
      let username = "";
      if (madre.user && typeof madre.user === "object" && madre.user.username) {
        username = madre.user.username;
      } else if (typeof madre.user === "string") {
        username = madre.user;
      }
      let eas = "";
      if (
        madre.id_eas &&
        typeof madre.id_eas === "object" &&
        madre.id_eas.nombre
      ) {
        eas = madre.id_eas.nombre;
      } else if (
        typeof madre.id_eas === "string" ||
        typeof madre.id_eas === "number"
      ) {
        eas = madre.id_eas;
      }
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${username}</td>
        <td>${madre.tipo || ""}</td>
        <td>${madre.dni || ""}</td>
        <td>${madre.p_nombre || ""}</td>
        <td>${madre.s_nombre || ""}</td>
        <td>${madre.p_apellido || ""}</td>
        <td>${madre.s_apellido || ""}</td>
        <td>${madre.telefono || ""}</td>
        <td>${madre.direccion || ""}</td>
        <td>${eas}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    const tbody = document.querySelector("#tabla-madres tbody");
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="11" style="color:red;">${error.message}</td></tr>`;
    }
  }
}

// Modifica cargarContenidoEnMain para inicializar la tabla de infantes si corresponde
async function cargarContenidoEnMain(url) {
  const main = document.querySelector("main.contenido");
  main.innerHTML = "<p>Cargando...</p>";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("No se pudo cargar el contenido");
    const html = await response.text();
    main.innerHTML = html;

    // Inicializa la tabla de infantes o madres según corresponda
    if (url.includes("lista_infantes")) {
      cargarInfantes();
    }
    if (url.includes("lista_madres")) {
      cargarMadresParcial();
    }
    if (url.includes("formulario_madre")) {
      inicializarFormularioMadre();
    }
  } catch (error) {
    main.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

// Asocia los clicks del menú lateral a la carga dinámica
function inicializarMenuLateral() {
  document.querySelectorAll(".sidebar a").forEach((enlace) => {
    enlace.addEventListener("click", function (e) {
      e.preventDefault();
      // Puedes usar el atributo data-url en cada <a> para definir el HTML a cargar
      const url = this.getAttribute("data-url");
      if (url) {
        cargarContenidoEnMain(url);
      }
    });
  });
}

// FORMULARIO MADRE - PARCIAL
async function cargarFormularioMadre() {
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
/*async function registrarMadre(e) {
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

  const token = localStorage.getItem("access_token");
  const userPayload = {
    username: document.getElementById("username").value.trim(),
    password: password,
  };

  try {
    // Mostrar payload en consola para depuración
    console.log("Payload usuario:", userPayload);

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

    // 2. Crear perfil de madre, ligando el user recién creado
    const idEasValue = document.getElementById("id_eas").value;
    const perfilPayload = {
      user: userData.id,
      tipo: document.getElementById("tipo").value,
      dni: document.getElementById("dni").value,
      p_nombre: document.getElementById("p_nombre").value,
      s_nombre: document.getElementById("s_nombre").value,
      p_apellido: document.getElementById("p_apellido").value,
      s_apellido: document.getElementById("s_apellido").value,
      telefono: document.getElementById("telefono").value,
      direccion: document.getElementById("direccion").value,
      id_eas: idEasValue ? parseInt(idEasValue, 10) : null, // Solo convierte si hay valor
    };

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
      // Muestra el error detallado en consola y en pantalla
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
}*/

// Inicializa el formulario madre cuando se carga el partial
/*function inicializarFormularioMadre() {
  cargarFormularioMadre();
  const form = document.getElementById("form-madre");
  if (form) {
    form.addEventListener("submit", registrarMadre);
  }
}*/

document.addEventListener("DOMContentLoaded", () => {
  cargarEntidadAdministradora();
  cargarInfoUser();
  inicializarMenuLateral();
});
