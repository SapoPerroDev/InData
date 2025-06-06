// Función compartida para cargar la tabla de infantes
export async function cargarInfantes() {
  const token = localStorage.getItem("access_token");
  try {
    // 1. Cargar mapas de ids a nombres solo una vez por sesión
    if (!window.tipoDniMap || !window.tipoFocalizacionMap || !window.udsMap) {
      window.tipoDniMap = {};
      window.tipoFocalizacionMap = {};
      window.udsMap = {};
      try {
        const [dniRes, focalRes, udsRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/tipos-dni/", {
            headers: { Authorization: "Bearer " + token },
          }),
          fetch("http://127.0.0.1:8000/api/tipos-focalizacion/", {
            headers: { Authorization: "Bearer " + token },
          }),
          fetch("http://127.0.0.1:8000/api/unidades-servicio/", {
            headers: { Authorization: "Bearer " + token },
          }),
        ]);
        if (dniRes.ok) {
          const dniData = await dniRes.json();
          dniData.forEach((d) => (window.tipoDniMap[d.id] = d.tipo));
        }
        if (focalRes.ok) {
          const focalData = await focalRes.json();
          focalData.forEach((f) => (window.tipoFocalizacionMap[f.id] = f.tipo));
        }
        if (udsRes.ok) {
          const udsData = await udsRes.json();
          udsData.forEach((u) => (window.udsMap[u.id] = u.nombre));
        }
      } catch {}
    }

    // 2. Obtener la UDS de la madre autenticada (solo el id)
    let idUdsMadre = null;
    try {
      const perfilRes = await fetch("http://127.0.0.1:8000/api/user-info/", {
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
        },
      });
      if (perfilRes.ok) {
        const perfilData = await perfilRes.json();
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
          let idMadre = perfilData.id;
          const uds = udsData.find(
            (u) =>
              String(u.id_madre) === String(idMadre) ||
              (u.id_madre && String(u.id_madre.id) === String(idMadre))
          );
          if (uds) idUdsMadre = uds.id;
        }
      }
    } catch {
      // Si no se puede obtener la UDS, no filtrar
    }

    // 3. Obtener infantes y filtrar por la UDS de la madre
    const response = await fetch("http://127.0.0.1:8000/api/infantes/", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!response.ok)
      throw new Error("No se pudo obtener la lista de infantes");
    const data = await response.json();
    const tbody = document.querySelector("#tabla-infantes tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    const infantesFiltrados = idUdsMadre
      ? data.filter(
          (infante) =>
            String(infante.id_uds) === String(idUdsMadre) ||
            (infante.id_uds && String(infante.id_uds.id) === String(idUdsMadre))
        )
      : data;
    infantesFiltrados.forEach((infante, idx) => {
      const tipoUsuario = localStorage.getItem("user_type");
      const tr = document.createElement("tr");
      // Construye la URL absoluta para el PDF si es relativo
      let pdfUrl = "";
      if (infante.documento_focalizacion) {
        pdfUrl = infante.documento_focalizacion.startsWith("http")
          ? infante.documento_focalizacion
          : `http://127.0.0.1:8000${infante.documento_focalizacion}`;
      }
      tr.innerHTML = `
        <td><input type="checkbox" class="check-infante" data-id="${
          infante.id
        }" ${
        tipoUsuario === "admin" || tipoUsuario === "superuser"
          ? ""
          : "style='display:none;'"
      } /></td>
        <td>${idx + 1}</td>
        <td>${infante.p_nombre || ""}</td>
        <td>${infante.s_nombre || ""}</td>
        <td>${infante.p_apellido || ""}</td>
        <td>${infante.s_apellido || ""}</td>
        <td>${
          infante.tipo_dni && typeof infante.tipo_dni === "object"
            ? infante.tipo_dni.tipo
            : window.tipoDniMap && window.tipoDniMap[infante.tipo_dni]
            ? window.tipoDniMap[infante.tipo_dni]
            : infante.tipo_dni || ""
        }</td>
        <td>${infante.dni || ""}</td>
        <td>${
          infante.tipo_focalizacion &&
          typeof infante.tipo_focalizacion === "object"
            ? infante.tipo_focalizacion.tipo
            : window.tipoFocalizacionMap &&
              window.tipoFocalizacionMap[infante.tipo_focalizacion]
            ? window.tipoFocalizacionMap[infante.tipo_focalizacion]
            : infante.tipo_focalizacion || ""
        }</td>
        <td>${
          infante.id_uds && typeof infante.id_uds === "object"
            ? infante.id_uds.nombre
            : window.udsMap && window.udsMap[infante.id_uds]
            ? window.udsMap[infante.id_uds]
            : infante.id_uds || ""
        }</td>
        <td>
          ${
            pdfUrl
              ? `<a href="${pdfUrl}" target="_blank" rel="noopener noreferrer" download="documento_focalizacion_${
                  infante.dni || infante.id
                }.pdf">Ver/Descargar PDF</a>`
              : ""
          }
        </td>
        <td>
          <button type="button" class="editar-infante-btn" data-id="${
            infante.id
          }">Editar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Selección global de checkboxes
    const checkAll = document.getElementById("check-all-infantes");
    if (checkAll) {
      checkAll.onclick = function () {
        document.querySelectorAll(".check-infante").forEach((cb) => {
          cb.checked = checkAll.checked;
        });
      };
    }
    // Reasocia el evento de eliminar después de renderizar la tabla
    if (window.mostrarBotonEliminarInfantes) {
      setTimeout(window.mostrarBotonEliminarInfantes, 50);
    }
    if (window.inicializarEliminarInfantes) {
      setTimeout(window.inicializarEliminarInfantes, 50);
    }
    if (window.inicializarEditarInfantes) {
      setTimeout(window.inicializarEditarInfantes, 50);
    }
    document.querySelectorAll(".editar-infante-btn").forEach((btn) => {
      btn.onclick = function () {
        const id = this.getAttribute("data-id");
        // Implementa aquí la lógica para editar el infante con id
        alert("Funcionalidad de edición para infante ID: " + id);
      };
    });

    // Botón para descargar todos los PDFs en zip con autenticación JWT
    const descargarZipBtn = document.getElementById("descargar-pdfs-zip-btn");
    if (descargarZipBtn) {
      descargarZipBtn.onclick = async function (e) {
        e.preventDefault();
        const token = localStorage.getItem("access_token");
        try {
          const res = await fetch(
            "http://127.0.0.1:8000/api/descargar-pdfs-zip/",
            {
              method: "GET",
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          if (!res.ok) {
            alert("No se pudo descargar el ZIP. ¿Está autenticado?");
            return;
          }
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "documentos_focalizacion.zip";
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
            a.remove();
          }, 100);
        } catch (err) {
          alert("Error al descargar el ZIP: " + err);
        }
      };
    }
  } catch (error) {
    // Si no existe la tabla, solo muestra el error en consola
    console.error(error.message);
  }
}
