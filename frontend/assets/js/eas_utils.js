export async function cargarEntidadAdministradora() {
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