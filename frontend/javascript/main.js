fetch("http://127.0.0.1:8000/api/madres/")
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById("lista-madres");
      data.forEach(madre => {
        const li = document.createElement("li");
        li.textContent = `${madre.p_nombre} - ${madre.s_nombre}`;
        console.log(`${madre.nombre} - ${madre.telefono}`);
        lista.appendChild(li);
      });
});