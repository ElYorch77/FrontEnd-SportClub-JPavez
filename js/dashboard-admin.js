const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "login.html";
}

document.getElementById("nombre-usuario").textContent = user.nombre + " " + user.apellido;
