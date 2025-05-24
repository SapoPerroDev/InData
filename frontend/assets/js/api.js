async function cargarMadres() {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/madres/");
    if (!response.ok) throw new Error("Error al cargar los datos");

    const data = await response.json();
    const lista = document.getElementById("lista-madres");

    data.forEach(madre => {
      const li = document.createElement("li");
      li.textContent = `${madre.p_nombre} - ${madre.s_nombre}`;
      lista.appendChild(li);
    });

  } catch (error) {
    console.error("Error:", error.message);
  }
}

cargarMadres();
  
  
  /*fetch("http://127.0.0.1:8000/api/madres/")
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById("lista-madres");
      data.forEach(madre => {
        const li = document.createElement("li");
        li.textContent = `${madre.p_nombre} - ${madre.s_nombre}`;
        console.log(`${madre.nombre} - ${madre.telefono}`);
        lista.appendChild(li);
      });
    });*/