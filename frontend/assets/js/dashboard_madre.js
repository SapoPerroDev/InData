import {
  inicializarFormularioInfante,
  cargarTiposDNI,
  cargarTiposFocalizacion
} from "./formulario_infante.js";
import { cargarInfantes } from "./infantes_utils.js";
import { cargarEntidadAdministradora } from "./eas_utils.js";

async function cargarInfoUser() {
  const token = localStorage.getItem("access_token");
  try {
    // 1. Obtener info de usuario (madre o admin)
    const response = await fetch("http://127.0.0.1:8000/api/user-info/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (!response.ok)
      throw new Error("No se pudo obtener la información del usuario");
    const data = await response.json();
    document.getElementById(
      "name-user"
    ).textContent = `${data.p_nombre} ${data.p_apellido}`;
    // 2. Si es madre, buscar la UDS asociada y mostrar el nombre
    if (data.tipo === "madre") {
      // Buscar la UDS donde id_madre == data.id (no data.user)
      const udsRes = await fetch(
        "http://127.0.0.1:8000/api/unidades-servicio/",
        {
          headers: {
            Authorization: "Bearer " + token,
            Accept: "application/json",
          },
        }
      );
      if (udsRes.ok) {
        const udsData = await udsRes.json();
        let idMadre = data.id; // Usar siempre el id del perfil, no el id del user
        let uds = null;
        if (Array.isArray(udsData)) {
          uds = udsData.find(
            (u) =>
              String(u.id_madre) === String(idMadre) ||
              (u.id_madre && String(u.id_madre.id) === String(idMadre))
          );
        }
        if (uds && uds.nombre) {
          document.getElementById("role-user").textContent = uds.nombre;
        } else {
          document.getElementById("role-user").textContent =
            "Madre Comunitaria";
        }
      } else {
        document.getElementById("role-user").textContent = "Madre Comunitaria";
      }
    } else {
      document.getElementById("role-user").textContent =
        data.tipo === "admin" ? "Administrador EAS" : data.tipo;
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function cargarContenidoEnMain(url) {
  const main = document.querySelector("main.contenido");
  main.innerHTML = "<p>Cargando...</p>";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("No se pudo cargar el contenido");
    const html = await response.text();
    main.innerHTML = html;

    if (url.includes("lista_infantes")) {
      cargarInfantes();
    }
    if (url.includes("formulario_focalizacion")) {
      cargarInfantes();
      await cargarTiposDNI();
      await cargarTiposFocalizacion();
      inicializarFormularioInfante();
    }
    if (url.includes("historial_focalizaciones")) {
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
      const url = this.getAttribute("data-url");
      if (url) {
        cargarContenidoEnMain(url);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  inicializarMenuLateral();
  cargarEntidadAdministradora();
  cargarInfoUser();
});
