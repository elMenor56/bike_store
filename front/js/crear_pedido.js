const API = "http://localhost:3000/api/pedidos";
const token = localStorage.getItem("token_cliente");

// si no hay token → redirigir al login
if (!token) {
  alert("Debes iniciar sesión");
  window.location.href = "cliente_login.html";
}

async function crearPedido() {
  let items;

  try {
    items = JSON.parse(document.getElementById("items").value);
  } catch (error) {
    return alert("JSON inválido.");
  }

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ items })
  });

  const data = await res.json();
  console.log(data);

  if (data.mensaje) {
    alert(data.mensaje);
  } else {
    alert("Pedido creado!");
  }
}
