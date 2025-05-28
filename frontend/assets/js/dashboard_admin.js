async function cargarMadres() {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch("http://127.0.0.1:8000/api/madres/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (!response.ok) throw new Error("Error al cargar los datos");

    const data = await response.json();
    const lista = document.getElementById("lista-madres");

    data.forEach((madre) => {
      const li = document.createElement("li");
      li.textContent =
        `Nombre: ${madre.p_nombre} ${madre.s_nombre} ${madre.p_apellido} ${madre.s_apellido} | ` +
        `DNI: ${madre.dni} | Teléfono: ${madre.telefono} | Dirección: ${madre.direccion}`;
      lista.appendChild(li);
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function cargarEntidadAdministradora() {
  const token = localStorage.getItem("access_token");
  try {
    const response = await fetch("http://127.0.0.1:8000/api/entidades/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (!response.ok)
      throw new Error("No se pudo obtener la entidad administradora");
    const entidades = await response.json();
    if (entidades.length > 0) {
      document.getElementById("name-EAS").textContent = entidades[0].nombre;
      document.getElementById("nit-EAS").textContent =
        "NIT: " + entidades[0].nit;
      // Renderizar el logo si existe y no es null/vacío
      let logoUrl = "/frontend/assets/img/user.png";
      if (entidades[0].logo) {
        // Si logo ya empieza por "http", úsalo tal cual
        if (/^https?:\/\//.test(entidades[0].logo)) {
          logoUrl = entidades[0].logo;
        } else {
          // Si logo empieza por "/media/", úsalo con el backend
          logoUrl = `http://127.0.0.1:8000${
            entidades[0].logo.startsWith("/") ? "" : "/"
          }${entidades[0].logo}`;
        }
      }
      document.getElementById("logo-EAS").src = logoUrl;
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function cargarInfoAdmin() {
  const token = localStorage.getItem("access_token");
  try {
    const response = await fetch("http://127.0.0.1:8000/api/admin-info/", {
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

document.addEventListener("DOMContentLoaded", () => {
  cargarMadres();
  cargarEntidadAdministradora();
  cargarInfoAdmin();
});
