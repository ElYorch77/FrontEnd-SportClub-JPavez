const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");
const API = "http://localhost:3000/api";

if (!user) window.location.href = "login.html";

// ── CARGAR PERFIL ──
async function cargarPerfil() {
  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    const u = data.data;

    // Mostrar datos
    document.getElementById("perfil-nombre").textContent = u.full_name;
    document.getElementById("perfil-email").textContent = u.email;
    document.getElementById("perfil-rol").textContent = u.role;
    document.getElementById("perfil-fecha").textContent = u.birth_date ? new Date(u.birth_date).toLocaleDateString("es-CL") : "—";

    // Llenar formulario de edición
    document.getElementById("edit-nombre").value = u.full_name;
    document.getElementById("edit-fecha").value = u.birth_date || "";

  } catch (error) {
    console.error("Error al cargar perfil:", error);
  }
}

// ── GUARDAR PERFIL ──
async function guardarPerfil() {
  const full_name = document.getElementById("edit-nombre").value.trim();
  const birth_date = document.getElementById("edit-fecha").value;
  const msgError = document.getElementById("perfil-error");
  const msgSuccess = document.getElementById("perfil-success");

  msgError.style.display = "none";
  msgSuccess.style.display = "none";

  if (!full_name) {
    msgError.textContent = "❌ El nombre es obligatorio.";
    msgError.style.display = "block";
    return;
  }

  try {
    const res = await fetch(`${API}/auth/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ full_name, birth_date })
    });
    const data = await res.json();

    if (data.ok) {
      msgSuccess.textContent = "✅ Perfil actualizado correctamente.";
      msgSuccess.style.display = "block";
      // Actualizar localStorage
      const updatedUser = { ...user, full_name };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      cargarPerfil();
    } else {
      msgError.textContent = "❌ " + data.message;
      msgError.style.display = "block";
    }
  } catch (error) {
    msgError.textContent = "❌ Sin conexión con el servidor.";
    msgError.style.display = "block";
  }
}

// ── CAMBIAR CONTRASEÑA ──
async function cambiarPassword() {
  const current_password = document.getElementById("pass-actual").value.trim();
  const new_password = document.getElementById("pass-nueva").value.trim();
  const confirm_password = document.getElementById("pass-confirmar").value.trim();
  const msgError = document.getElementById("pass-error");
  const msgSuccess = document.getElementById("pass-success");

  msgError.style.display = "none";
  msgSuccess.style.display = "none";

  if (!current_password || !new_password || !confirm_password) {
    msgError.textContent = "❌ Todos los campos son obligatorios.";
    msgError.style.display = "block";
    return;
  }

  if (new_password.length < 8) {
    msgError.textContent = "❌ La nueva contraseña debe tener mínimo 8 caracteres.";
    msgError.style.display = "block";
    return;
  }

  if (new_password !== confirm_password) {
    msgError.textContent = "❌ Las contraseñas no coinciden.";
    msgError.style.display = "block";
    return;
  }

  try {
    const res = await fetch(`${API}/auth/me/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ current_password, new_password, confirm_password })
    });
    const data = await res.json();

    if (data.ok) {
      msgSuccess.textContent = "✅ Contraseña actualizada correctamente.";
      msgSuccess.style.display = "block";
      document.getElementById("pass-actual").value = "";
      document.getElementById("pass-nueva").value = "";
      document.getElementById("pass-confirmar").value = "";
    } else {
      msgError.textContent = "❌ " + data.message;
      msgError.style.display = "block";
    }
  } catch (error) {
    msgError.textContent = "❌ Sin conexión con el servidor.";
    msgError.style.display = "block";
  }
}

// ── INICIAR ──
cargarPerfil();

// ── CERRAR SESION ──
function cerrarSesion() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}