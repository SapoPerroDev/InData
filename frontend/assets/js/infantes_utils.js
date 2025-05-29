// Función compartida para cargar la tabla de infantes
export async function cargarInfantes() {
  const token = localStorage.getItem("access_token");
  try {
    const response = await fetch("http://127.0.0.1:8000/api/infantes/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!response.ok)
      throw new Error("No se pudo obtener la lista de infantes");
    const data = await response.json();
    const tbody = document.querySelector("#tabla-infantes tbody");
    if (!tbody) return; // Evita error si el elemento no existe
    tbody.innerHTML = "";
    data.forEach((infante, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${infante.p_nombre || ""}</td>
        <td>${infante.s_nombre || ""}</td>
        <td>${infante.p_apellido || ""}</td>
        <td>${infante.s_apellido || ""}</td>
        <td>${infante.tipo_dni || ""}</td>
        <td>${infante.dni || ""}</td>
        <td>${infante.tipo_focalizacion || ""}</td>
        <td>${infante.id_uds || ""}</td>
        <td>
          ${
            infante.documento_focalizacion
              ? `<a href="http://127.0.0.1:8000${infante.documento_focalizacion}" target="_blank">Ver PDF</a>`
              : ""
          }
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    // Si no existe la tabla, solo muestra el error en consola
    console.error(error.message);
  }
}
