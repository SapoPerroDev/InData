// Módulo ES6 para el formulario de infante

export async function cargarTiposDNI() {
  const token = localStorage.getItem("access_token");
  const select = document.getElementById("tipo-doc");
  if (!select) return;
  select.innerHTML = "<option value=''>Cargando...</option>";
  try {
    const res = await fetch("http://127.0.0.1:8000/api/tipos-dni/", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (!res.ok) {
      select.innerHTML = "<option value=''>Error al cargar tipos</option>";
      return;
    }
    const data = await res.json();
    select.innerHTML = "";
    data.forEach((tipo) => {
      const opt = document.createElement("option");
      opt.value = tipo.id;
      opt.textContent = tipo.tipo;
      select.appendChild(opt);
    });
    if (select.options.length === 0) {
      select.innerHTML = "<option value=''>No hay tipos disponibles</option>";
    }
  } catch (err) {
    select.innerHTML = "<option value=''>Error al cargar tipos</option>";
    console.error("Error al cargar tipos de DNI:", err);
  }
}

export async function cargarTiposFocalizacion() {
  const token = localStorage.getItem("access_token");
  const select = document.getElementById("tipo-focalizacion");
  if (!select) return;
  select.innerHTML = "<option value=''>Cargando...</option>";
  try {
    const res = await fetch("http://127.0.0.1:8000/api/tipos-focalizacion/", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (!res.ok) {
      select.innerHTML = "<option value=''>Error al cargar tipos</option>";
      return;
    }
    const data = await res.json();
    select.innerHTML = "";
    data.forEach((tipo) => {
      const opt = document.createElement("option");
      opt.value = tipo.id;
      opt.textContent = tipo.tipo;
      select.appendChild(opt);
    });
    if (select.options.length === 0) {
      select.innerHTML = "<option value=''>No hay tipos disponibles</option>";
    }
  } catch (err) {
    select.innerHTML = "<option value=''>Error al cargar tipos</option>";
    console.error("Error al cargar tipos de focalización:", err);
  }
}

export function validarArchivo(input) {
  const archivo = input.files[0];
  if (archivo) {
    if (archivo.type !== "application/pdf") {
      alert("Solo se permiten archivos PDF.");
      input.value = "";
    } else if (archivo.size > 10 * 1024 * 1024) {
      alert("El archivo debe pesar menos de 10 MB.");
      input.value = "";
    }
  }
}

async function unirYGuardarPDFInfante(e) {
  e.preventDefault();
  const token = localStorage.getItem("access_token");
  // Obtener el id_uds correcto antes de enviar el formulario
  const id_uds = await obtenerIdUdsMadre();

  if (!id_uds) {
    alert("No se encontró una UDS asignada a la madre actual.");
    return;
  }

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
  // Usar el id_uds correcto
  formData.append("id_uds", id_uds);

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

export async function guardarInfante(e) {
  e.preventDefault();
  const token = localStorage.getItem("access_token");

  // Usa la función optimizada para obtener el id de la UDS
  const id_uds = await obtenerIdUdsMadre();

  if (!id_uds) {
    alert("No se encontró una UDS asignada a la madre actual.");
    return;
  }

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
    // Limpiar los campos del formulario manualmente
    document.getElementById("tipo-doc").value = "";
    document.getElementById("numero-doc").value = "";
    document.getElementById("primer-nombre").value = "";
    document.getElementById("segundo-nombre").value = "";
    document.getElementById("primer-apellido").value = "";
    document.getElementById("primer-segundo").value = "";
    document.getElementById("tipo-focalizacion").value = "";
    if (document.getElementById("registro-pdf")) document.getElementById("registro-pdf").value = "";
    if (document.getElementById("focalizacion-pdf")) document.getElementById("focalizacion-pdf").value = "";
    // Recargar la tabla de infantes si existe
    if (window.cargarInfantes) {
      window.cargarInfantes();
    } else {
      import("/frontend/assets/js/infantes_utils.js").then((mod) => {
        if (mod.cargarInfantes) mod.cargarInfantes();
      });
    }
    // NO cambiar de vista ni recargar el main
  } else {
    const error = await res.json();
    alert("Error al guardar: " + JSON.stringify(error));
  }
}

// Nueva función optimizada para obtener el id de la UDS asociada a la madre autenticada
async function obtenerIdUdsMadre() {
  const token = localStorage.getItem("access_token");
  try {
    // 1. Obtener info de usuario (madre o admin)
    const response = await fetch("http://127.0.0.1:8000/api/user-info/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (data.tipo === "madre") {
      // 2. Buscar la UDS donde id_madre == data.id (id del perfil, no del user)
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
        let idMadre = data.id;
        let uds = null;
        if (Array.isArray(udsData)) {
          uds = udsData.find(
            (u) =>
              String(u.id_madre) === String(idMadre) ||
              (u.id_madre && String(u.id_madre.id) === String(idMadre))
          );
        }
        if (uds) {
          return uds.id;
        }
      }
    }
  } catch (error) {
    // Puedes mostrar el error en consola si lo necesitas
  }
  return null;
}

export function inicializarFormularioInfante() {
  // Validación de archivos PDF
  const registroPdf = document.getElementById("registro-pdf");
  if (registroPdf) {
    registroPdf.addEventListener("change", function () {
      validarArchivo(this);
    });
  }
  const focalizacionPdf = document.getElementById("focalizacion-pdf");
  if (focalizacionPdf) {
    focalizacionPdf.addEventListener("change", function () {
      validarArchivo(this);
    });
  }
  // Evento submit para guardar infante
  const form = document.getElementById("form-infante");
  if (form) {
    form.addEventListener("submit", guardarInfante);
  }
  // Evento click para guardar PDF unido (si existe el botón)
  const btn = document.getElementById("guardarInfanteBtn");
  if (btn && typeof unirYGuardarPDFInfante === "function") {
    btn.addEventListener("click", unirYGuardarPDFInfante);
  }
}

// Al final del archivo, expón la función para uso global si el HTML la llama por onchange
import.meta && (window.validarArchivo = validarArchivo);
