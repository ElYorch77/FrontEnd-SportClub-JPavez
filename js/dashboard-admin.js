const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");
const API = "http://localhost:3000/api";

if (!user) window.location.href = "login.html";

document.getElementById("nombre-usuario").textContent = user.full_name;

// ── CARGAR USUARIOS ──
async function cargarUsuarios() {
  try {
    const res = await fetch(`${API}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    renderTabla(data.data);
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
  }
}

// ── RENDERIZAR TABLA ──
function renderTabla(usuarios) {
  const tbody = document.getElementById("tabla-usuarios");
  tbody.innerHTML = "";

  usuarios.forEach(u => {
    const fecha = u.created_at ? new Date(u.created_at).toLocaleDateString("es-CL") : "—";
    const rolBadge = {
      admin: '<span style="background:#c0392b;color:#fff;padding:2px 8px;border-radius:100px;font-size:0.75rem;">admin</span>',
      coach: '<span style="background:#1a56db;color:#fff;padding:2px 8px;border-radius:100px;font-size:0.75rem;">coach</span>',
      user:  '<span style="background:#1a7a3c;color:#fff;padding:2px 8px;border-radius:100px;font-size:0.75rem;">user</span>'
    };

    tbody.innerHTML += `
      <tr>
        <td>${u.id}</td>
        <td>${u.full_name}</td>
        <td>${u.email}</td>
        <td>${rolBadge[u.role] || u.role}</td>
        <td>${fecha}</td>
        <td>
          <button onclick="abrirEditar(${u.id})" style="background:#1a56db;color:#fff;border:none;border-radius:6px;padding:4px 10px;cursor:pointer;margin-right:4px;">✏️ Editar</button>
          <button onclick="eliminarUsuario(${u.id})" style="background:#c0392b;color:#fff;border:none;border-radius:6px;padding:4px 10px;cursor:pointer;">🗑️ Eliminar</button>
        </td>
      </tr>
    `;
  });
}

// ── ELIMINAR USUARIO ──
async function eliminarUsuario(id) {
  if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

  try {
    const res = await fetch(`${API}/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.ok) cargarUsuarios();
    else alert("Error al eliminar: " + data.message);
  } catch (error) {
    console.error("Error al eliminar:", error);
  }
}

// ── ABRIR FORMULARIO EDITAR ──
async function abrirEditar(id) {
  try {
    const res = await fetch(`${API}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    const u = data.data;

    document.getElementById("edit-id").value = u.id;
    document.getElementById("edit-nombre").value = u.full_name;
    document.getElementById("edit-email").value = u.email;
    document.getElementById("edit-rol").value = u.role;

    document.getElementById("modal-editar").style.display = "flex";
  } catch (error) {
    console.error("Error al cargar usuario:", error);
  }
}

// ── GUARDAR EDICIÓN ──
async function guardarEdicion() {
  const id = document.getElementById("edit-id").value;
  const full_name = document.getElementById("edit-nombre").value.trim();
  const email = document.getElementById("edit-email").value.trim();
  const role = document.getElementById("edit-rol").value;
  const msgError = document.getElementById("edit-error");

  if (!full_name || !email) {
    msgError.textContent = "❌ Nombre y correo son obligatorios.";
    msgError.style.display = "block";
    return;
  }

  try {
    const res = await fetch(`${API}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ full_name, email, role })
    });
    const data = await res.json();

    if (data.ok) {
      cerrarModal();
      cargarUsuarios();
    } else {
      msgError.textContent = "❌ " + data.message;
      msgError.style.display = "block";
    }
  } catch (error) {
    console.error("Error al editar:", error);
  }
}

// ── CREAR USUARIO ──
async function crearUsuario() {
  const full_name = document.getElementById("nuevo-nombre").value.trim();
  const email = document.getElementById("nuevo-email").value.trim();
  const role = document.getElementById("nuevo-rol").value;
  const password = document.getElementById("nuevo-password").value.trim();
  const password2 = document.getElementById("nuevo-password2").value.trim();
  const msgError = document.getElementById("nuevo-error");

  msgError.style.display = "none";

  if (!full_name || !email || !password) {
    msgError.textContent = "❌ Todos los campos son obligatorios.";
    msgError.style.display = "block";
    return;
  }

  if (password.length < 8) {
    msgError.textContent = "❌ La contraseña debe tener mínimo 8 caracteres.";
    msgError.style.display = "block";
    return;
  }

  if (password !== password2) {
    msgError.textContent = "❌ Las contraseñas no coinciden.";
    msgError.style.display = "block";
    return;
  }

  try {
    const res = await fetch(`${API}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ full_name, email, role, password, must_change_password: false, metadata: { sports: [] } })
    });
    const data = await res.json();

    if (data.ok) {
      cerrarModalNuevo();
      cargarUsuarios();
    } else {
      msgError.textContent = "❌ " + data.message;
      msgError.style.display = "block";
    }
  } catch (error) {
    console.error("Error al crear usuario:", error);
  }
}

// ── MODALES ──
function cerrarModal() {
  document.getElementById("modal-editar").style.display = "none";
  document.getElementById("edit-error").style.display = "none";
}

function abrirModalNuevo() {
  document.getElementById("modal-nuevo").style.display = "flex";
}

function cerrarModalNuevo() {
  document.getElementById("modal-nuevo").style.display = "none";
  document.getElementById("nuevo-error").style.display = "none";
}

// ── INICIAR ──
cargarUsuarios();
