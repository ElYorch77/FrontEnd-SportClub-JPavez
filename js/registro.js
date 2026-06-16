async function registrarUsuario() {
  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const password2 = document.getElementById("password2").value.trim();

  const msgError = document.getElementById("msg-error");
  const msgSuccess = document.getElementById("msg-success");

  // Limpiar mensajes
  msgError.style.display = "none";
  msgSuccess.style.display = "none";

  // Validaciones
  if (nombre === "") {
    msgError.textContent = "❌ El nombre es obligatorio.";
    msgError.style.display = "block";
    return;
  }

  if (correo === "") {
    msgError.textContent = "❌ El correo es obligatorio.";
    msgError.style.display = "block";
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    msgError.textContent = "❌ El correo no es válido.";
    msgError.style.display = "block";
    return;
  }

  if (password.length < 8) {
    msgError.textContent = "❌ La contraseña debe tener mínimo 8 caracteres.";
    msgError.style.display = "block";
    return;
  }

  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    msgError.textContent = "❌ La contraseña debe tener letras y números.";
    msgError.style.display = "block";
    return;
  }

  if (password !== password2) {
    msgError.textContent = "❌ Las contraseñas no coinciden.";
    msgError.style.display = "block";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: nombre,
        email: correo,
        password: password,
        role: "user",
        must_change_password: false,
        birth_date: null,
        metadata: { sports: [] }
      })
    });

    const data = await response.json();

    if (!data.ok) {
      msgError.textContent = "❌ " + data.message;
      msgError.style.display = "block";
      return;
    }

    msgSuccess.textContent = "✅ Usuario registrado correctamente. ¡Bienvenido a SportClub!";
    msgSuccess.style.display = "block";

  } catch (error) {
    msgError.textContent = "❌ Sin conexión con el servidor.";
    msgError.style.display = "block";
  }
}