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

// Botones
const btnLogin = document.getElementById("btnLogin");
const btnRegistro = document.getElementById("btnRegistro");

// Inputs login
const loginCorreo = document.getElementById("loginCorreo");
const loginContrasena = document.getElementById("loginContrasena");

// Inputs registro
const regNombre = document.getElementById("regNombre");
const regTelefono = document.getElementById("regTelefono");
const regDireccion = document.getElementById("regDireccion");
const regCorreo = document.getElementById("regCorreo");
const regContrasena = document.getElementById("regContrasena");


// ============================
// MOSTRAR MENÚ CON ANIMACIÓN
// ============================
abrirLogin.addEventListener("click", () => {

    // Mostrar contenedor
    menu.classList.remove("hidden");
    overlay.classList.remove("hidden");

    // Animaciones de ENTRADA
    menu.classList.add("slide-in-right");
    overlay.classList.add("fade-in");

    // Limpiar clases después de la animación
    setTimeout(() => {
        menu.classList.remove("slide-in-right");
        overlay.classList.remove("fade-in");
    }, 300);
});


// ============================
// CERRAR MENÚ CON ANIMACIÓN
// ============================
function cerrarMenu() {

    // Animaciones de SALIDA
    menu.classList.add("slide-out-right");
    overlay.classList.add("fade-out");

    setTimeout(() => {

        // Ocultar después de la animación
        menu.classList.add("hidden");
        overlay.classList.add("hidden");

        // Resetear clases
        menu.classList.remove("slide-out-right");
        overlay.classList.remove("fade-out");

        // Asegurar que solo un formulario esté visible
        formLogin.classList.remove("hidden");
        formRegistro.classList.add("hidden");

    }, 300);
}

cerrar.addEventListener("click", cerrarMenu);
overlay.addEventListener("click", cerrarMenu);



// ============================
// CAMBIO ENTRE LOGIN / REGISTRO (CON ANIMACIÓN)
// ============================
mostrarRegistro.addEventListener("click", () => {

    // Ocultar login con animación
    formLogin.classList.add("slide-out-left");

    setTimeout(() => {
        formLogin.classList.add("hidden");
        formLogin.classList.remove("slide-out-left");

        // Mostrar registro con animación
        formRegistro.classList.remove("hidden");
        formRegistro.classList.add("slide-in-right");

        setTimeout(() => {
            formRegistro.classList.remove("slide-in-right");
        }, 300);

    }, );
});

mostrarLogin.addEventListener("click", () => {

    // Ocultar registro con animación
    formRegistro.classList.add("slide-out-left");

    setTimeout(() => {
        formRegistro.classList.add("hidden");
        formRegistro.classList.remove("slide-out-left");

        // Mostrar login con animación
        formLogin.classList.remove("hidden");
        formLogin.classList.add("slide-in-right");

        setTimeout(() => {
            formLogin.classList.remove("slide-in-right");
        }, 300);

    }, );
});

const mensajeLogin = document.getElementById("mensajeLogin");

function mostrarMensaje(texto) {
    mensajeLogin.textContent = texto;
    mensajeLogin.classList.remove("hidden");

    setTimeout(() => {
        mensajeLogin.classList.add("hidden");
    }, 3000);
}

const mensajeRegistro = document.getElementById("mensajeRegistro");

function mostrarMensajeRegistro(texto) {
    mensajeRegistro.textContent = texto;
    mensajeRegistro.classList.remove("hidden");
    mensajeRegistro.classList.add("show");

    setTimeout(() => {
        mensajeRegistro.classList.remove("show");
        setTimeout(() => mensajeRegistro.classList.add("hidden"), 300);
    }, 3000);
}


// =========================================================
//  LOGIN — INTEGRACIÓN BACKEND
// =========================================================
btnLogin.addEventListener("click", async () => {

    const email = document.getElementById("loginCorreo").value.trim();
    const contrasena = document.getElementById("loginContrasena").value.trim();

    if (!email || !contrasena) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    try {

        // Desactivar mientras inicia sesión
        btnLogin.disabled = true;
        btnLogin.classList.add("cargando");


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
        } else {
            mostrarMensaje("Inicio de sesión exitoso. Bienvenido!");
        }

        // ADMIN
        if (tipoLogin === "admin") {
            localStorage.setItem("tokenAdmin", data.token);
            localStorage.setItem("admin", JSON.stringify(data.admin));

            setTimeout(() => {
                window.location.href = "/front/HTML/admin/admin_panel.html";
            }, 1500);
            return;
        }

        // CLIENTE
        localStorage.setItem("tokenCliente", data.token);
        localStorage.setItem("cliente", JSON.stringify(data.cliente));

        setTimeout(() => {
            window.location.href = "/front/HTML/cliente_logueado/inicio_cliente.html";
        }, 1500);

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

// Validar contraseña (mínimo 4 y máximo 20 caracteres)
function validarContrasena(contrasena) {
    return contrasena.length >= 4 && contrasena.length <= 20;
}


// ============================
// HABILITAR / DESHABILITAR BOTÓN REGISTRO
// ============================
function validarRegistroInputs() {
    const nombre = regNombre.value.trim();
    const telefono = regTelefono.value.trim();
    const direccion = regDireccion.value.trim();
    const email = regCorreo.value.trim();
    const contrasena = regContrasena.value.trim();

    const nombreOk = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/.test(nombre);
    const emailOk = validarEmail(email);
    const contrasenaOk = validarContrasena(contrasena);
    const telefonoOk = validarTelefonoColombia(telefono);
    const direccionOk = /^(Calle|Carrera|Transversal|Diagonal) \d+ #\d+-\d+$/.test(direccion);
    

    btnRegistro.disabled = !(nombreOk && emailOk && contrasenaOk && telefonoOk && direccionOk);
}

// Escuchar cambios en inputs
[regNombre, regTelefono, regDireccion, regCorreo, regContrasena].forEach(input => {
    input.addEventListener("input", validarRegistroInputs);
});

// ============================
// VALIDACIÓN EN VIVO: TELÉFONO
// ============================

const errorTelefono = document.getElementById("errorTelefono");

regTelefono.addEventListener("input", () => {
    // Solo números
    regTelefono.value = regTelefono.value.replace(/[^0-9]/g, "");

    if (regTelefono.value.length > 10) {
        regTelefono.value = regTelefono.value.slice(0, 10); // máximo 10 dígitos
    }

    const esValido = validarTelefonoColombia(regTelefono.value);

    if (!esValido) {
        errorTelefono.classList.remove("hidden");
    } else {
        errorTelefono.classList.add("hidden");
    }

    validarRegistroInputs();
});


// ============================
// VALIDACIÓN EN VIVO: CONTRASEÑA
// ============================

const errorContrasena = document.getElementById("errorContrasena");

regContrasena.addEventListener("input", () => {
    const pass = regContrasena.value.trim();

    const esValida = validarContrasena(pass);

    if (!esValida) {
        errorContrasena.classList.remove("hidden");
    } else {
        errorContrasena.classList.add("hidden");
    }

    validarRegistroInputs();
});

// ---- Correo ----
const errorCorreo = document.getElementById("errorCorreo");

regCorreo.addEventListener("input", () => {
    const correo = regCorreo.value.trim();
    const esValido = validarEmail(correo);

    if (!esValido) errorCorreo.classList.remove("hidden");
    else errorCorreo.classList.add("hidden");

    validarRegistroInputs();
});

// ---- Nombre ----
const errorNombre = document.getElementById("errorNombre");

regNombre.addEventListener("input", () => {
    const nombre = regNombre.value.trim();
    const esValido = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/.test(nombre);

    if (!esValido) errorNombre.classList.remove("hidden");
    else errorNombre.classList.add("hidden");

    validarRegistroInputs();
});

// ---- Dirección ----
const errorDireccion = document.getElementById("errorDireccion");

regDireccion.addEventListener("input", () => {
    const direccion = regDireccion.value.trim();
    const regex = /^(Calle|Carrera|Transversal|Diagonal|Avenida) \d+ #\d+-\d+$/;

    const esValido = regex.test(direccion);

    if (!esValido) errorDireccion.classList.remove("hidden");
    else errorDireccion.classList.add("hidden");

    validarRegistroInputs();
});




// =========================================================
//  REGISTRO — INTEGRACIÓN BACKEND
// =========================================================

btnRegistro.addEventListener("click", async () => {

    const nombre = regNombre.value.trim();
    const telefono = regTelefono.value.trim();
    const direccion = regDireccion.value.trim();
    const email = regCorreo.value.trim();
    const contrasena = regContrasena.value.trim();

    // ============================
    // VALIDACIONES BÁSICAS
    // ============================
    if (!nombre || !email || !contrasena || !direccion || !telefono) {
        mostrarMensajeRegistro("Todos los campos son obligatorios.");
        return;
    }

    if (!validarEmail(email)) {
        mostrarMensajeRegistro("Correo inválido. Usa un dominio válido como .com, .co, .net, etc.");
        return;
    }

    if (telefono && !validarTelefonoColombia(telefono)) {
        mostrarMensajeRegistro("Teléfono inválido. Debe ser colombiano (10 dígitos y empieza en 3).");
        return;
    }


    if (!validarContrasena(contrasena)) {
        mostrarMensajeRegistro("La contraseña debe tener entre 4 y 20 caracteres.");
        return;
    }

    // 🔒 Deshabilitar botón mientras registra
    btnRegistro.disabled = true;
    btnRegistro.classList.add("cargando");

    try {
        const respuesta = await fetch("http://localhost:3000/api/clientes/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, telefono, direccion, email, contrasena })
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            mostrarMensajeRegistro(data.message || "Error al registrar usuario.");
            btnRegistro.disabled = false;
            btnRegistro.classList.remove("cargando");
            return;
        }

        // 🎉 Registro correcto
        mostrarMensajeRegistro("Registro exitoso. Ahora puedes iniciar sesión.");

        // Espera la animación del mensaje
        setTimeout(() => {
            formRegistro.classList.add("hidden");
            formLogin.classList.remove("hidden");
        }, 1500);

    } catch (err) {
        console.error("Error al registrar usuario:", err);
        mostrarMensajeRegistro("Error al conectar con el servidor.");
    }

    // Rehabilitar si los campos siguen siendo válidos
    btnRegistro.classList.remove("cargando");
    validarRegistroInputs();
});

// ============================
// HABILITAR / DESHABILITAR BOTÓN LOGIN
// ============================
function validarLoginInputs() {
    const emailVal = loginCorreo.value.trim();
    const passVal = loginContrasena.value.trim();

    // Verifica condiciones
    const emailEsValido = validarEmail(emailVal); 
    const contrasenaValida = passVal.length > 0;

    // Habilitar/deshabilitar botón
    btnLogin.disabled = !(emailEsValido && contrasenaValida);
}

// Detectar cambios en ambos inputs
loginCorreo.addEventListener("input", validarLoginInputs);
loginContrasena.addEventListener("input", validarLoginInputs);

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
[regNombre, regTelefono, regDireccion, regCorreo, regContrasena].forEach(input => {
    input.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            btnRegistro.click();
        }
    });
});