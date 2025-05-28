/*async function cargarEntidadAdministradora() {
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
}*/

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

async function unirYGuardarPDFInfante(e) {
  e.preventDefault();
  const token = localStorage.getItem("access_token");
  const formData = new FormData();
  formData.append(
    "registro_pdf",
    document.getElementById("registro-pdf").files[0]
  );
  formData.append(
    "focalizacion_pdf",
    document.getElementById("focalizacion-pdf").files[0]
  );
  formData.append(
    "tipo_focalizacion",
    document.getElementById("tipo-focalizacion").value
  );
  formData.append("tipo_doc", document.getElementById("tipo-doc").value);
  formData.append("numero_doc", document.getElementById("numero-doc").value);
  formData.append(
    "primer_nombre",
    document.getElementById("primer-nombre").value
  );
  formData.append(
    "primer_apellido",
    document.getElementById("primer-apellido").value
  );
  formData.append(
    "segundo_nombre",
    document.getElementById("segundo-nombre").value
  );
  formData.append(
    "primer_segundo",
    document.getElementById("primer-segundo").value
  );
  // Debes obtener el id_uds real según tu lógica
  formData.append("id_uds", 1);

  const res = await fetch("http://127.0.0.1:8000/api/unir-guardar-pdf/", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: formData,
  });

  if (res.ok) {
    const data = await res.json();
    alert("PDF unido y guardado como: " + data.filename);
  } else {
    const error = await res.json();
    alert("Error al unir y guardar PDFs: " + JSON.stringify(error));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  //cargarEntidadAdministradora();
  cargarTiposDNI();
  cargarTiposFocalizacion();
  document
    .getElementById("guardarInfanteBtn")
    .addEventListener("click", unirYGuardarPDFInfante);
});
