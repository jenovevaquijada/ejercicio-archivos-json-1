const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PATH_CLIENTES = path.join(__dirname, 'clientes.json');

async function leer() {
    try {
        const data = await fs.readFile(PATH_CLIENTES, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.log("Creando nuevo archivo de clientes...");
        return [];
    }
}

async function escribir(datos) {
    await fs.writeFile(PATH_CLIENTES, JSON.stringify(datos, null, 2));
}

app.get('/api/clientes', async (req, res) => {
    const clientes = await leer();
    res.json(clientes);
});

app.post('/api/clientes/rut', async (req, res) => {
    const { rut, nombre, saldo } = req.body;
    let clientes = await leer();
    clientes.push({
        rut, nombre,
        cuentaRut: { saldo: Number(saldo) },
        cuentasAhorro: []
    });
    await escribir(clientes);
    res.json({ mensaje: "Cliente creado con éxito" });
});

app.post('/api/clientes/:rut/ahorro', async (req, res) => {
    const { rut } = req.params;
    const { alias, saldo } = req.body;
    let clientes = await leer();
    const index = clientes.findIndex(c => c.rut === rut);
    if (index !== -1) {
        clientes[index].cuentasAhorro.push({
            id: Date.now(),
            alias: alias || "Ahorro",
            saldo: Number(saldo)
        });
        await escribir(clientes);
        res.json({ mensaje: "Cuenta de ahorro añadida" });
    } else {
        res.status(404).json({ error: "Cliente no encontrado" });
    }
});

app.post('/api/movimiento', async (req, res) => {
    const { rut, tipo, monto, cuentaId } = req.body;
    
    try {
        let clientes = await leer();
        const index = clientes.findIndex(c => c.rut === rut);
        
        if (index === -1) return res.status(404).json({ error: "RUT no encontrado" });

        let cliente = clientes[index];
        let montoNum = Number(monto);

        if (cuentaId === 'rut') {
            if (tipo === 'giro' && cliente.cuentaRut.saldo < montoNum) {
                return res.status(400).json({ error: "Saldo insuficiente" });
            }
            cliente.cuentaRut.saldo += (tipo === 'deposito' ? montoNum : -montoNum);
        } else {
            const ahorroIdx = cliente.cuentasAhorro.findIndex(a => a.id == cuentaId);
            if (ahorroIdx === -1) return res.status(404).json({ error: "Cuenta no existe" });
            
            if (tipo === 'giro' && cliente.cuentasAhorro[ahorroIdx].saldo < montoNum) {
                return res.status(400).json({ error: "Saldo insuficiente en ahorro" });
            }
            cliente.cuentasAhorro[ahorroIdx].saldo += (tipo === 'deposito' ? montoNum : -montoNum);
        }

        await escribir(clientes);
        res.json({ mensaje: "Operación realizada con éxito" });

    } catch (err) {
        console.error("Error detallado:", err);
        res.status(500).json({ error: "Error interno del servidor al procesar el dinero" });
    }
});

app.listen(PORT, () => {
    console.log(`✅ BancoEstado Activo: http://localhost:${PORT}`);
});

