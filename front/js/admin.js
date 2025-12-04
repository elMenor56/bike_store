// ========================================
// LOGIN DEL ADMINISTRADOR
// ========================================
async function loginAdmin() {

    // saco el email del cuadro de texto
    const email = document.getElementById("email").value; // aquí el admin escribe su correo

    // saco la contraseña escrita
    const contrasena = document.getElementById("contrasena").value; // aquí el admin escribe su clave

    // hago la petición al backend para intentar hacer login
    const res = await fetch("http://localhost:3000/admin/login", { // mando los datos al login del admin
        method: "POST", // envío tipo POST
        headers: { 
            "Content-Type": "application/json" // digo que mando JSON
        },
        body: JSON.stringify({ email, contrasena }) // convierto los datos a JSON
    });

    // convierto la respuesta en json
    const data = await res.json(); // aquí recibo token o error

    // si el servidor responde con error (status 400 o 401)
    if (!res.ok) { 
        // muestro el mensaje de error en pantalla
        document.getElementById("msg").textContent = data.msg || "Error al iniciar sesión"; 
        return; // salgo de la función
    }

    // si todo salió bien, guardo el token del admin
    localStorage.setItem("token_admin", data.token); // guardo token para las demás funciones privadas

    // aviso que se inició sesión
    document.getElementById("msg").textContent = "Login de administrador exitoso ✔";

    // redirijo al panel del admin después de 1 segundo
    setTimeout(() => {
        window.location.href = "panel_admin.html"; // mando al usuario al panel
    }, 1000);
}
