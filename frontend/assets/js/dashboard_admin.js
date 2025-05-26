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
      li.textContent = `${madre.p_nombre} - ${madre.s_nombre}`;
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
    // Si solo hay una entidad, usa la primera
    if (entidades.length > 0) {
      document.getElementById("name-EAS").textContent = entidades[0].nombre;
      document.getElementById("nit-EAS").textContent =
        "NIT: " + entidades[0].nit;
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
