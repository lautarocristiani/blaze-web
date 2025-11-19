# Blaze Marketplace 🛒

**Blaze** is a modern, secure, and scalable marketplace platform built with the latest web technologies. It allows users to register, manage their profiles, list products for sale, and explore items.

![Project Status](https://img.shields.io/badge/Status-MVP%20Complete-brightgreen)

## 🚀 Tech Stack

This project is built using a robust architecture focused on performance and developer experience:

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router & Server Actions)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Backend & Auth:** [Supabase](https://supabase.com/) (Auth, Database, Storage, Triggers)
* **Payment Processing:** [Stripe](https://stripe.com/) (Checkout & Webhooks)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
* **Validation:** [Zod](https://zod.dev/) (Client & Server-side schema validation)
* **State Management:** Server Components & Server Actions

---

## ✨ Current Features (MVP)

### 🔑 Core User Features
- [x] **Sign Up & Login:** Secure authentication with support for **Username** login.
- [x] **Route Protection:** Protected routes ensure authenticated access where required.
- [x] **Profile Management:** Users can update name, bio, avatar, and theme settings.
- [x] **Theme System:** Persistent Dark/Light/System mode preferences.

### 🛍️ Marketplace Functionality
- [x] **Product Listing:** Create, Edit, and Delete products with secure file uploads (Storage & RLS).
- [x] **Browsing & Search:** Product grid with search, filter (Category), and sort functionality.
- [x] **Transaction Flow:** Complete buyer/seller cycle using **Stripe Checkout** and **Webhooks** for successful order creation and product status updates (`is_sold`).
- [x] **User Dashboard:** Dedicated view for users to see their **Sales History** (including buyer ID) and **Purchase History**.

---

## 🗺️ Database Architecture

The project leverages **PostgreSQL Triggers** and **Row Level Security (RLS)** to ensure data integrity and security:
* **Trigger `on_auth_user_created`:** Automatically creates an entry in the public `profiles` table whenever a user registers in `auth.users`, ensuring profile data consistency.
* **Service Role:** Used securely within **Server Actions** and **Webhooks** (Stripe) for privileged database operations, such as creating orders or marking products as sold, bypassing RLS where necessary.

---

## 🛠️ Getting Started (Run Locally)

Follow these steps to run the project on your machine:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/lautarocristiani/blaze-web.git
    cd blaze-web
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory and add your Supabase and Stripe keys:

    ```env
    # Supabase Keys
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

    # Stripe Keys
    STRIPE_SECRET_KEY=your_stripe_secret_key
    STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

4.  **Run Stripe CLI for Webhook Tunneling:**
    Before running the app, start the Stripe local listener to handle webhooks:

    ```bash
    stripe listen --forward-to localhost:3000/api/webhooks/stripe
    ```
    *The output will provide the `STRIPE_WEBHOOK_SECRET` for step 3.*

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.