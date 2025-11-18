# Blaze Marketplace 🛒

**Blaze** is a modern, secure, and scalable marketplace platform built with the latest web technologies. It allows users to register, manage their profiles, list products for sale, and explore items.

![Project Status](https://img.shields.io/badge/Status-In%20Development-orange)

## 🚀 Tech Stack

This project is built using a robust architecture focused on performance and developer experience:

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router & Server Actions)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Backend & Auth:** [Supabase](https://supabase.com/) (Auth, Database, Storage, Triggers)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
* **Validation:** [Zod](https://zod.dev/) (Client & Server-side schema validation)
* **State Management:** Server Components & Server Actions

---

## ✨ Current Features (MVP)

### 🔐 Robust Authentication
- [x] **Sign Up:** User registration with pre-validation for duplicates (Username/Email) and atomic profile creation via **Database Triggers**.
- [x] **Login:** Secure sign-in using Supabase Auth (supports Email or Username).
- [x] **Logout:** Session termination with proper cookie cleanup.
- [x] **Route Protection:** Middleware for session management and protected routes.

### 🎨 Dynamic UI/UX
- [x] **Dynamic Header:** Interface adapts to the authentication state (Guest vs. Logged In).
- [x] **Theme System:** Dark/Light/System mode with database persistence and automatic synchronization.
- [x] **Avatar:** User avatar management starting from registration.

---

## 🗺️ Roadmap & Scenarios

Based on the project goals (`SCENARIOS.md`), here is the current development status:

### User Profile Management
- [x] Profile editing (Bio, Name, Avatar update).
- [x] Consistent Avatar UI (Image or Initials).

### Product Management (Selling)
- [x] Create product (Image upload, Categories, Pricing).
- [x] Edit and Delete own products.
- [x] Product schema validation (Zod).
- [x] RLS & Storage Policies (Security).

### Product Browsing (Buying)
- [x] Product Grid on Home page.
- [x] Product Detail page with Seller info.
- [x] Search and Filters (Category, Price, Sort).
- [x] Pagination.

### Transaction Flow
- [ ] Simulated Stripe integration.
- [ ] Purchase Order creation.
- [ ] Sales and Purchases history (Dashboard).

---

## 🛠️ Getting Started (Run Locally)

Follow these steps to run the project on your machine:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/lautarocristiani/blaze-web.git](https://github.com/lautarocristiani/blaze-web.git)
    cd blaze-web
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory and add your Supabase keys:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🔒 Database Architecture

The project leverages **PostgreSQL Triggers** to ensure data integrity:
* **Trigger `on_auth_user_created`:** Automatically creates an entry in the public `profiles` table whenever a user registers in `auth.users`. This ensures consistency and prevents "ghost" users.

---