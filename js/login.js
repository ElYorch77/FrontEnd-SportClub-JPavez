async function iniciarSesion() {
  const correo = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const mensaje = document.getElementById("msg-error-login");

  // Limpiar mensaje anterior
  mensaje.style.display = "none";
  mensaje.textContent = "";

  // Validaciones básicas
  if (correo === "") {
    mensaje.textContent = "❌ El correo es obligatorio.";
    mensaje.style.display = "block";
    return;
  }

  if (password === "") {
    mensaje.textContent = "❌ La contraseña es obligatoria.";
    mensaje.style.display = "block";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: correo, password: password })
    });

    const data = await response.json();

    if (!data.ok) {
      mensaje.textContent = "❌ " + data.message;
      mensaje.style.display = "block";
      return;
    }

    // Guardar token y usuario en localStorage
    localStorage.setItem("token", data.data.token);
    localStorage.setItem("user", JSON.stringify(data.data.user));

    // Redirigir según rol
    const rol = data.data.user.role;

    if (rol === "user") {
      window.location.href = "dashboard-usuario.html";
    } else if (rol === "coach") {
      window.location.href = "dashboard-coach.html";
    } else if (rol === "admin") {
      window.location.href = "dashboard-admin.html";
    }

  } catch (error) {
    mensaje.textContent = "❌ Sin conexión con el servidor.";
    mensaje.style.display = "block";
  }
}

