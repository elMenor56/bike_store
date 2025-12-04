// ==========================================
// FUNCIÓN PARA CARGAR PEDIDOS
// ==========================================
async function cargarPedidos() {
    try {
        // hacemos petición GET
        const res = await fetch("http://localhost:3000/api/admin/pedidos", {
            headers: { "Authorization": "Bearer " + token }
        });

        const pedidos = await res.json();

        const tbody = document.getElementById("tablaPedidos");

        pedidos.forEach(p => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${p.id_pedido}</td>
                <td>${p.nombre_cliente}</td>
                <td>${p.fecha_pedido}</td>
                <td>$${p.total_pedido}</td>
                <td>${p.estado}</td>
                <td>
                    <button onclick="verDetalle(${p.id_pedido})">Ver</button>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.log("Error:", error);
    }
}

cargarPedidos();

// ==========================================
// FUNCIÓN PARA IR A DETALLE
// ==========================================
function verDetalle(id) {
    localStorage.setItem("pedido_id", id);
    window.location.href = "admin_pedido_detalle.html";
}
