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

document.addEventListener("DOMContentLoaded", () => {
  cargarEntidadAdministradora();
  cargarInfoUser();
  inicializarMenuLateral();
});
