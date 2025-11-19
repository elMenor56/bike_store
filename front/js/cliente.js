// ===============================
// LOGIN DEL CLIENTE
// ===============================
async function loginCliente() {
    
    // obtenemos email y contraseña
    const email = document.getElementById("email").value;
    const contrasena = document.getElementById("contrasena").value;

    // consumimos el backend
    const res = await fetch("http://localhost:3000/cliente/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena })
    });

    const data = await res.json();

    // si está mal
    if (!res.ok) {
        document.getElementById("msg").textContent = data.mensaje || "Error";
        return;
    }

    // guardamos el token en el navegador
    localStorage.setItem("token_cliente", data.token);

    // mensaje
    document.getElementById("msg").textContent = "Login exitoso";

    // redirigimos al perfil
    setTimeout(() => {
        window.location.href = "perfil_cliente.html";
    }, 1000);
}


// ===============================
// VER PERFIL
// ===============================
async function cargarPerfilCliente() {

    const token = localStorage.getItem("token_cliente");

    const res = await fetch("http://localhost:3000/cliente/perfil", {
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();

    document.getElementById("perfil").textContent = JSON.stringify(data, null, 2);
}


// ===============================
// REGISTRO DEL CLIENTE
// ===============================
async function registrarCliente() {

    // obtenemos los datos del formulario
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const contrasena = document.getElementById("contrasena").value;
    const telefono = document.getElementById("telefono").value;
    const direccion = document.getElementById("direccion").value;

    // enviamos la solicitud al backend
    const res = await fetch("http://localhost:3000/cliente/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nombre,
            email,
            contrasena,
            telefono,
            direccion
        })
    });

    const data = await res.json();

    // si hay error lo mostramos
    if (!res.ok) {
        document.getElementById("msg").textContent = data.mensaje || "Error al registrarse";
        return;
    }

    // mensaje de exito
    document.getElementById("msg").textContent = "Registro exitoso ✔ Redirigiendo...";

    // redirigir al login luego de 1s
    setTimeout(() => {
        window.location.href = "login_cliente.html";
    }, 1000);
}
