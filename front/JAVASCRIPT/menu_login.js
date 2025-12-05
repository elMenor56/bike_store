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


// =========================================================
//  LOGIN — INTEGRACIÓN BACKEND
// =========================================================
const btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", async () => {

    const email = document.getElementById("loginCorreo").value.trim();
    const contrasena = document.getElementById("loginContrasena").value.trim();

    if (!email || !contrasena) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    try {
        let url = "";
        let tipoLogin = "";

        // Login ADMIN
        if (email === "adminbikestore@email.com") {
            url = "http://localhost:3000/admin/login";
            tipoLogin = "admin";
        } 
        // Login CLIENTE NORMAL
        else {
            url = "http://localhost:3000/api/clientes/login";
            tipoLogin = "cliente";
        }

        const respuesta = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, contrasena })
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            alert(data.message || "Credenciales incorrectas.");
            return;
        }

        // ADMIN
        if (tipoLogin === "admin") {
            localStorage.setItem("tokenAdmin", data.token);
            localStorage.setItem("admin", JSON.stringify(data.admin));

            window.location.href = "/front/HTML/admin/admin_panel.html";
            return;
        }

        // CLIENTE
        localStorage.setItem("tokenCliente", data.token);
        localStorage.setItem("cliente", JSON.stringify(data.cliente));

        window.location.href = "/front/HTML/cliente_logueado/inicio_cliente.html";

    } catch (err) {
        console.error("Error al iniciar sesión:", err);
        alert("Error al conectar con el servidor.");
    }
});

// ============================
// VALIDACIONES PERSONALIZADAS
// ============================

// Validar email con dominio correcto
function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|co|net|org)$/;
    return regex.test(email);
}

// Validar teléfono colombiano (10 dígitos, empieza en 3)
function validarTelefonoColombia(telefono) {
    const regex = /^3\d{9}$/;
    return regex.test(telefono);
}


// =========================================================
//  REGISTRO — INTEGRACIÓN BACKEND
// =========================================================
const btnRegistro = document.getElementById("btnRegistro");

btnRegistro.addEventListener("click", async () => {

    const nombre = document.getElementById("regNombre").value.trim();
    const telefono = document.getElementById("regTelefono").value.trim();
    const direccion = document.getElementById("regDireccion").value.trim();
    const email = document.getElementById("regCorreo").value.trim();
    const contrasena = document.getElementById("regContrasena").value.trim();

    // ============================
    // VALIDACIONES
    // ============================

    if (!nombre || !email || !contrasena) {
        alert("Nombre, correo y contraseña son obligatorios.");
        return;
    }

    // Validar correo con dominio correcto
    if (!validarEmail(email)) {
        alert("Ingresa un correo válido. Debe terminar en un dominio como: @gmail.com, @hotmail.com, @email.com, etc.");
        return;
    }

    // Validar teléfono colombiano
    if (telefono && !validarTelefonoColombia(telefono)) {
        alert("Ingresa un teléfono válido colombiano (10 dígitos y debe iniciar con 3). Ejemplo: 3014567890");
        return;
    }

    try {
        const respuesta = await fetch("http://localhost:3000/api/clientes/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, telefono, direccion, email, contrasena })
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            alert(data.message || "Error al registrar usuario");
            return;
        }

        alert("Registro exitoso. Ahora puedes iniciar sesión.");

        // Mostrar el formulario de login
        formRegistro.classList.add("hidden");
        formLogin.classList.remove("hidden");

    } catch (err) {
        console.error("Error al registrar usuario:", err);
        alert("Error al conectar con el servidor.");
    }
});


// =========================================================
//  ENTER PARA LOGIN
// =========================================================
const loginCorreo = document.getElementById("loginCorreo");
const loginContrasena = document.getElementById("loginContrasena");

[loginCorreo, loginContrasena].forEach(input => {
    input.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            btnLogin.click();
        }
    });
});


// =========================================================
//  ENTER PARA REGISTRO
// =========================================================
const regNombre = document.getElementById("regNombre");
const regTelefono = document.getElementById("regTelefono");
const regDireccion = document.getElementById("regDireccion");
const regCorreo = document.getElementById("regCorreo");
const regContrasena = document.getElementById("regContrasena");

[regNombre, regTelefono, regDireccion, regCorreo, regContrasena].forEach(input => {
    input.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            btnRegistro.click();
        }
    });
});
