# 🎯 Servicios Pro

Plataforma de servicios profesionales con carrito de compras, checkout inteligente y gestión de pedidos.

## 🚀 Características

- ✅ Catálogo de servicios por categorías
- ✅ Carrito de compras (con y sin autenticación)
- ✅ Checkout inteligente (verifica email, crea cuentas automáticamente)
- ✅ Sistema de autenticación con JWT
- ✅ Panel de administración
- ✅ Integración con WhatsApp y Email
- ✅ Gestión de pedidos

## 🛠️ Tecnologías

**Frontend:**
- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Framer Motion

**Backend:**
- Node.js
- Express
- MySQL 9.5
- JWT

## 📋 Requisitos

- Node.js 18+
- MySQL 9.5+
- Git

## 🚀 Instalación

### Backend
```bash
cd backend
npm install
```

Crea `.env`:
```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=tienda_db
JWT_SECRET=tu_secret_key
NODE_ENV=development
```

Inicia:
```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
```

Crea `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Inicia:
```bash
npm run dev
```

## 📚 Estructura del Proyecto
```
servicios-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── hooks/
    │   ├── context/
    │   └── utils/
    ├── package.json
    └── .env.example
```

## 📖 Documentación API

### Endpoints Principales

**Usuarios:**
- `POST /api/usuarios/registro` - Registrar usuario
- `POST /api/usuarios/login` - Iniciar sesión
- `GET /api/usuarios/perfil` - Obtener perfil

**Categorías:**
- `GET /api/categorias` - Obtener todas
- `POST /api/categorias` - Crear (admin)

**Servicios:**
- `GET /api/servicios` - Obtener todos
- `GET /api/servicios/categoria/:id` - Por categoría

**Carrito:**
- `GET /api/carrito` - Obtener carrito
- `POST /api/carrito` - Agregar item
- `PUT /api/carrito/:id` - Actualizar cantidad
- `DELETE /api/carrito/:id` - Eliminar item

**Pedidos:**
- `POST /api/pedidos` - Crear pedido
- `GET /api/pedidos/mis-pedidos` - Mis pedidos

## 👨‍💻 Autor

Tu Nombre

## 📄 Licencia

MIT