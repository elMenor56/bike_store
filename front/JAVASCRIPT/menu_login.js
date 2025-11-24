// ============================
// ELEMENTOS DEL MENÚ LATERAL
// ============================
const abrirLogin = document.getElementById("abrirLogin");
const overlay = document.getElementById("overlay-login");
const menu = document.getElementById("menu-login");
const cerrar = document.getElementById("cerrarMenuLogin");

// Formularios
const formLogin = document.getElementById("formLogin");
const formRegistro = document.getElementById("formRegistro");

const mostrarRegistro = document.getElementById("mostrarRegistro");
const mostrarLogin = document.getElementById("mostrarLogin");

// ============================
// MOSTRAR / CERRAR MENÚ
// ============================
abrirLogin.addEventListener("click", () => {
    menu.classList.remove("hidden");
    overlay.classList.remove("hidden");
});

cerrar.addEventListener("click", () => {
    cerrarMenu();
});
overlay.addEventListener("click", () => {
    cerrarMenu();
});

function cerrarMenu() {
    menu.classList.add("hidden");
    overlay.classList.add("hidden");
}


// ============================
// CAMBIO ENTRE LOGIN / REGISTRO
// ============================
mostrarRegistro.addEventListener("click", () => {
    formLogin.classList.add("hidden");
    formRegistro.classList.remove("hidden");
});

mostrarLogin.addEventListener("click", () => {
    formRegistro.classList.add("hidden");
    formLogin.classList.remove("hidden");
});


// ============================
//  LOGIN — INTEGRACIÓN BACKEND
// ============================
const btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", async () => {

    const email = document.getElementById("loginCorreo").value.trim();
    const contrasena = document.getElementById("loginContrasena").value.trim();

    if (!email || !contrasena) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    try {
        const respuesta = await fetch("http://localhost:3000/api/clientes/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, contrasena })
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            alert(data.message || "Credenciales incorrectas.");
            return;
        }

        // Guardar en localStorage
        localStorage.setItem("tokenCliente", data.token);
        localStorage.setItem("cliente", JSON.stringify(data.cliente));

        // Redirigir al inicio del cliente
        window.location.href = "/front/HTML/inicio_cliente.html";

    } catch (err) {
        console.error("Error al iniciar sesión:", err);
        alert("Error al conectar con el servidor.");
    }
});

// ============================
//  REGISTRO — INTEGRACIÓN BACKEND
// ============================
const btnRegistro = document.getElementById("btnRegistro");

btnRegistro.addEventListener("click", async () => {

    // Obtener valores
    const nombre = document.getElementById("regNombre").value.trim();
    const telefono = document.getElementById("regTelefono").value.trim();
    const direccion = document.getElementById("regDireccion").value.trim();
    const email = document.getElementById("regCorreo").value.trim();
    const contrasena = document.getElementById("regContrasena").value.trim();

    // Validación básica
    if (!nombre || !email || !contrasena) {
        alert("Nombre, correo y contraseña son obligatorios.");
        return;
    }

    try {
        const respuesta = await fetch("http://localhost:3000/api/clientes/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre,
                telefono,
                direccion,
                email,
                contrasena
            })
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            alert(data.message || "Error al registrar usuario");
            return;
        }

        alert("Registro exitoso. Ahora puedes iniciar sesión.");

        // Cambiar a formulario de login
        formRegistro.classList.add("hidden");
        formLogin.classList.remove("hidden");

    } catch (err) {
        console.error("Error al registrar usuario:", err);
        alert("Error al conectar con el servidor.");
    }
});