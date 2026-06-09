function iniciarSesion() {
  const correo = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const mensaje = document.getElementById("msg-error-login");

  // Buscar usuario en el array
  const usuario = usuarios.find(u => u.correo === correo && u.password === password);

  if (!usuario) {
    mensaje.textContent = "❌ Credenciales incorrectas. Verifica tu correo y contraseña.";
    mensaje.style.display = "block";
    return;
  }

  // Ocultar mensaje de error si existía
  mensaje.style.display = "none";

  // Guardar usuario en localStorage
  localStorage.setItem("user", JSON.stringify(usuario));

  // Redirigir según rol
  if (usuario.rol === "user") {
    window.location.href = "dashboard-usuario.html";
  } else if (usuario.rol === "coach") {
    window.location.href = "dashboard-coach.html";
  } else if (usuario.rol === "admin") {
    window.location.href = "dashboard-admin.html";
  }
}
