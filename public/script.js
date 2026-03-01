document.addEventListener('DOMContentLoaded', cargarClientes);

async function leer() {
    const data = await fs.readFile(PATH_CLIENTES, 'utf-8');
    return JSON.parse(data);
}

async function escribir(datos) {
    await fs.writeFile(PATH_CLIENTES, JSON.stringify(datos, null, 2));
}

async function cargarClientes() {
    const res = await fetch('/api/clientes');
    const clientes = await res.json();
    const contenedor = document.getElementById('lista-clientes');
    contenedor.innerHTML = '';

    clientes.forEach(c => {
        let ahorrosHTML = c.cuentasAhorro.map(a => `
            <div style="background:#eef; padding:5px; margin-top:5px; border-radius:4px;">
                ${a.alias}: $${a.saldo} 
                <button onclick="operacion('${c.rut}', 'giro', ${a.id})">💸 Girar</button>
                <button onclick="operacion('${c.rut}', 'deposito', ${a.id})">💰 Dep.</button>
            </div>
        `).join('');

        contenedor.innerHTML += `
            <div class="cliente-item card">
                <h4>👤 ${c.nombre} (${c.rut})</h4>
                <p>💳 <strong>Cuenta RUT: $${c.cuentaRut.saldo}</strong> 
                   <button onclick="operacion('${c.rut}', 'giro', 'rut')">💸</button>
                   <button onclick="operacion('${c.rut}', 'deposito', 'rut')">💰</button>
                </p>
                <h5>📈 Cuentas Ahorro:</h5>
                ${ahorrosHTML || '<small>Sin cuentas de ahorro</small>'}
            </div>
        `;
    });
}

async function operacion(rut, tipo, cuentaId) {
    const monto = prompt(`Ingrese monto para ${tipo}:`);
    if (!monto || isNaN(monto)) return;

    try {
        const res = await fetch('/api/movimiento', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                rut: rut, 
                tipo: tipo, 
                monto: monto, 
                cuentaId: cuentaId 
            })
        });

        const data = await res.json();
        if (res.ok) {
            alert("✅ " + data.mensaje);
            cargarClientes(); 
        } else {
            alert("❌ " + data.error);
        }
    } catch (err) {
        alert("Error de conexión con el servidor");
    }
}

async function eliminarCliente(rut) {
    if(confirm('¿Estás segura de eliminar este cliente y TODAS sus cuentas?')) {
        await fetch(`/api/clientes/${rut}`, { method: 'DELETE' });
        cargarClientes();
    }
}

async function agregarCuentaAhorro() {
    const rutInput = document.getElementById('rut-ahorro');
    const aliasInput = document.getElementById('alias-ahorro');
    const saldoInput = document.getElementById('saldo-ahorro');

    const rut = rutInput.value.trim(); 
    const alias = aliasInput.value;
    const saldo = saldoInput.value;

    if (!rut) {
        alert("⚠️ Por favor, escribe el RUT del cliente antes de continuar.");
        rutInput.focus();
        return; 
    }

    console.log("Enviando ahorro para el RUT:", rut);

    try {
        const res = await fetch(`/api/clientes/${rut}/ahorro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ alias, saldo })
        });

        const data = await res.json();

        if (res.ok) {
            alert("✅ " + data.mensaje);
            cargarClientes(); 
            rutInput.value = '';
            aliasInput.value = '';
            saldoInput.value = '';
        } else {
            alert("❌ Error: " + data.error);
        }
    } catch (error) {
        console.error("Error en la petición:", error);
    }
}