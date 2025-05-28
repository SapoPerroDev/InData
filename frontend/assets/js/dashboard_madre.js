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
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function cargarTiposDNI() {
  const token = localStorage.getItem("access_token");
  const select = document.getElementById("tipo-doc");
  select.innerHTML = "";
  const res = await fetch("http://127.0.0.1:8000/api/tipos-dni/", {
    headers: { Authorization: "Bearer " + token },
  });
  const data = await res.json();
  data.forEach((tipo) => {
    const opt = document.createElement("option");
    opt.value = tipo.id;
    opt.textContent = tipo.tipo;
    select.appendChild(opt);
  });
}

async function cargarTiposFocalizacion() {
  const token = localStorage.getItem("access_token");
  const select = document.getElementById("tipo-focalizacion");
  select.innerHTML = "";
  const res = await fetch("http://127.0.0.1:8000/api/tipos-focalizacion/", {
    headers: { Authorization: "Bearer " + token },
  });
  const data = await res.json();
  data.forEach((tipo) => {
    const opt = document.createElement("option");
    opt.value = tipo.id;
    opt.textContent = tipo.tipo;
    select.appendChild(opt);
  });
}

async function guardarInfante(e) {
  e.preventDefault();
  const token = localStorage.getItem("access_token");
  // Aquí debes obtener el id_uds correspondiente (por ejemplo, seleccionando una UDS o asignando una por defecto)
  // Por simplicidad, aquí se usa un valor fijo. Debes adaptarlo según tu lógica.
  const id_uds = 1;

  const body = {
    id_uds: id_uds,
    tipo_dni: document.getElementById("tipo-doc").value,
    dni: document.getElementById("numero-doc").value,
    p_nombre: document.getElementById("primer-nombre").value,
    s_nombre: document.getElementById("segundo-nombre").value,
    p_apellido: document.getElementById("primer-apellido").value,
    s_apellido: document.getElementById("primer-segundo").value,
    tipo_focalizacion: document.getElementById("tipo-focalizacion").value,
  };

  const res = await fetch("http://127.0.0.1:8000/api/infantes/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    alert("Infante guardado correctamente");
    // Opcional: limpiar formulario
  } else {
    const error = await res.json();
    alert("Error al guardar: " + JSON.stringify(error));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarEntidadAdministradora();
  cargarTiposDNI();
  cargarTiposFocalizacion();
  document
    .getElementById("guardarInfanteBtn")
    .addEventListener("click", guardarInfante);
});
