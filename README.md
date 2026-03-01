# 🏦 Sistema Bancario - BancoEstado 

> **Tagline:** "Construyendo experiencias digitales desde la empatía y la creatividad."

Este proyecto es una aplicación web full-stack que simula la gestión de clientes y cuentas bancarias. Permite administrar Cuentas RUT y múltiples Cuentas de Ahorro con persistencia de datos en tiempo real.

## ✨ Características
- **Registro de Clientes:** Almacenamiento de nombre y RUT con saldo inicial.
- **Gestión de Ahorros:** Creación dinámica de cuentas de ahorro con alias personalizados.
- **Módulo de Movimientos:** Realización de giros y depósitos con validación de saldo (no permite saldos negativos).
- **Persistencia de Datos:** Uso de archivos JSON (`clientes.json`) para mantener la información tras reiniciar el servidor.
- **API REST:** Endpoints estructurados para una comunicación limpia entre el cliente y el servidor.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Uso |
| :--- | :--- |
| **Node.js** | Entorno de ejecución para el servidor. |
| **Express** | Framework para la gestión de rutas y API. |
| **FileSystem (fs/promises)** | Manejo de base de datos en formato JSON. |
| **JavaScript (ES6+)** | Lógica de frontend (Fetch API, Async/Await). |
| **HTML5 / CSS3** | Interfaz de usuario interactiva y responsiva. |

---

## 🚀 Instalación y Uso

1. **Clonar o descargar** el repositorio.
2. Abrir una terminal en la carpeta del proyecto.
3. Instalar las dependencias (si aplica):
   ```bash
   npm install
Iniciar el servidor:

Bash
node app.js
Abrir en el navegador: http://localhost:3000

📂 Estructura del Proyecto
Plaintext
📁 m6-ejercicio08
├── 📁 public           # Archivos estáticos
│   ├── index.html     # Interfaz principal
│   ├── script.js      # Lógica del cliente y Fetch
│   └── style.css      # Estilos visuales
├── app.js             # Servidor Express y rutas API
├── clientes.json      # Base de datos (Generada automáticamente)
└── README.md          # Documentación del proyecto

Creado con ❤️ por Jenoveva Quijada.
