// ========================================
// LOGIN DEL ADMINISTRADOR
// ========================================
async function loginAdmin() {

    // obtener email y contraseña del formulario
    const email = document.getElementById("email").value;
    const contrasena = document.getElementById("contrasena").value;

    // enviar solicitud al backend
    const res = await fetch("http://localhost:3000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena })
    });

    const data = await res.json();

    // si hay error lo mostramos
    if (!res.ok) {
        document.getElementById("msg").textContent = data.msg || "Error al iniciar sesión";
        return;
    }

    // guardar token del admin en localStorage
    localStorage.setItem("token_admin", data.token);

    // mostrar mensaje
    document.getElementById("msg").textContent = "Login de administrador exitoso ✔";

    // redirigir a un panel temporal
    setTimeout(() => {
        window.location.href = "panel_admin.html"; // esta pantalla la hacemos enseguida
    }, 1000);
}
