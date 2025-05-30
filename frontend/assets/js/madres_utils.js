// Función para cargar la tabla de madres con los datos alineados correctamente y con acciones
export async function cargarMadres() {
  const token = localStorage.getItem("access_token");
  // Cargar mapa de EAS solo una vez
  if (!window.easMap) {
    window.easMap = {};
    try {
      const easRes = await fetch("http://127.0.0.1:8000/api/entidades/", {
        headers: { Authorization: "Bearer " + token },
      });
      if (easRes.ok) {
        const easData = await easRes.json();
        easData.forEach((e) => (window.easMap[e.id] = e.nombre));
      }
    } catch {}
  }
  try {
    // 1. Traer todas las madres
    const response = await fetch("http://127.0.0.1:8000/api/madres/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (!response.ok) throw new Error("No se pudo obtener la lista de madres");
    const data = await response.json();

    // 2. Traer todos los usuarios de Django para mapear username (no password, por seguridad)
    const usuariosRes = await fetch("http://127.0.0.1:8000/api/django-users/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    let usuariosMap = {};
    if (usuariosRes.ok) {
      const usuarios = await usuariosRes.json();
      (Array.isArray(usuarios) ? usuarios : usuarios.results || []).forEach(
        (u) => {
          usuariosMap[u.id] = {
            username: u.username || "",
            // No hay password en la respuesta de DjangoUserSerializer por seguridad
          };
        }
      );
    }

    const tbody = document.querySelector("#tabla-madres tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    const tipoUsuario = localStorage.getItem("user_type");
    (Array.isArray(data) ? data : data.results || []).forEach((madre, idx) => {
      // Buscar username en el mapa de usuarios por id
      let username = "";
      if (madre.user) {
        const userObj = usuariosMap[madre.user];
        if (userObj) {
          username = userObj.username;
        }
      }
      // Extraer EAS nombre
      let easNombre = "";
      if (
        madre.id_eas &&
        typeof madre.id_eas === "object" &&
        madre.id_eas.nombre
      ) {
        easNombre = madre.id_eas.nombre;
      } else if (window.easMap && window.easMap[madre.id_eas]) {
        easNombre = window.easMap[madre.id_eas];
      } else {
        easNombre = madre.id_eas || "";
      }
      // Renderizar la fila en el mismo orden que el encabezado
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="checkbox" class="check-madre" data-id="${
          madre.id
        }" /></td>
        <td>${idx + 1}</td>
        <td>${username}</td>
        <td><span style="color:#888;font-style:italic;">No visible</span></td>
        <td>${madre.tipo || ""}</td>
        <td>${madre.dni || ""}</td>
        <td>${madre.p_nombre || ""}</td>
        <td>${madre.s_nombre || ""}</td>
        <td>${madre.p_apellido || ""}</td>
        <td>${madre.s_apellido || ""}</td>
        <td>${madre.telefono || ""}</td>
        <td>${madre.direccion || ""}</td>
        <td>
          <button type="button" class="editar-madre-btn" data-id="${
            madre.id
          }">Editar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    // Asegura que los botones y checks estén disponibles antes de asociar eventos
    setTimeout(() => {
      if (window.inicializarEliminarMadres) window.inicializarEliminarMadres();
      if (window.inicializarEditarMadres) window.inicializarEditarMadres();
      if (window.mostrarBotonEliminarMadres)
        window.mostrarBotonEliminarMadres();
    }, 50);
  } catch (error) {
    const tbody = document.querySelector("#tabla-madres tbody");
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="13" style="color:red;">${error.message}</td></tr>`;
    }
  }
}
