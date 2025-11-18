# Blaze Marketplace 🛒

**Blaze** es una plataforma de marketplace moderna, segura y escalable construida con las últimas tecnologías web. Permite a los usuarios registrarse, gestionar sus perfiles, listar productos para la venta y explorar artículos.

![Project Status](https://img.shields.io/badge/Status-In%20Development-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 Tech Stack

Este proyecto utiliza una arquitectura robusta centrada en la performance y la seguridad:

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router & Server Actions)
* **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
* **Backend & Auth:** [Supabase](https://supabase.com/) (Auth, Database, Storage, Triggers)
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
* **Validación:** [Zod](https://zod.dev/) (Validación de esquemas en cliente y servidor)
* **Gestión de Estado:** Server Components & Server Actions

---

## ✨ Features Implementadas (MVP)

### 🔐 Autenticación Robusta
- [x] **Sign Up:** Registro con validación previa de duplicados (Username/Email) y creación atómica de perfil mediante **Database Triggers**.
- [x] **Login:** Inicio de sesión seguro con Supabase Auth.
- [x] **Logout:** Cierre de sesión con limpieza correcta de cookies.
- [x] **Protección:** Middleware para manejo de sesiones y rutas protegidas.

### 🎨 UI/UX Dinámica
- [x] **Header Dinámico:** La interfaz se adapta al estado del usuario (Invitado vs. Logueado).
- [x] **Theme System:** Modo Oscuro/Claro/Sistema con persistencia en base de datos y sincronización automática.
- [x] **Avatar:** Gestión de avatar de usuario desde el registro.

---

## 🗺️ Roadmap & Scenarios

Basado en los objetivos del proyecto (`SCENARIOS.md`), este es el estado del desarrollo:

### User Profile Management
- [ ] Edición de perfil (Bio, Nombre, cambio de Avatar).
- [ ] Visualización de perfil público.

### Product Management (Selling)
- [ ] Crear producto (Upload de imágenes, Categorías, Precios).
- [ ] Editar y Borrar productos propios.
- [ ] Validación de esquemas de producto.

### Product Browsing (Buying)
- [ ] Grid de productos en Home.
- [ ] Página de detalle de producto.
- [ ] Búsqueda y Filtros (Categoría, Precio).

### Transaction Flow
- [ ] Integración simulada con Stripe.
- [ ] Creación de Órdenes de compra.
- [ ] Historial de compras y ventas (Dashboard).

---

## 🛠️ Instalación y Configuración Local

Sigue estos pasos para correr el proyecto en tu máquina:

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/lautarocristiani/blaze-web.git](https://github.com/lautarocristiani/blaze-web.git)
    cd blaze-web
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env.local` en la raíz y añade tus claves de Supabase:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_clave_anonima
    SUPABASE_SERVICE_ROLE_KEY=tu_clave_secreta_service_role
    ```

4.  **Correr el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🔒 Arquitectura de Base de Datos

El proyecto utiliza **Triggers de PostgreSQL** para garantizar la integridad de los datos:
* **Trigger `on_auth_user_created`:** Automáticamente crea una entrada en la tabla pública `profiles` cuando un usuario se registra en `auth.users`, asegurando consistencia y evitando usuarios "fantasmas".

---

*Developed by Lautaro Cristiani*