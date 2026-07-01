# Kraya E-Commerce Platform

![Kraya Platform](https://img.shields.io/badge/Status-Production-success) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)

**Production URL**: [https://ecommerce-application-pied-five.vercel.app](https://ecommerce-application-pied-five.vercel.app)

---

## 📖 Overview

**Kraya** is a production-grade, full-stack e-commerce platform built to handle modern online retail needs. Designed with scalability, security, and developer experience in mind, it leverages a highly modular architecture separating the frontend client from a robust Node.js backend API.

The platform is engineered to support an end-to-end shopping experience, from dynamic product browsing and shopping cart state management to secure payment processing and comprehensive administrative oversight.

### Tech Stack Highlights
- **Frontend**: React, Vite, Tailwind CSS (Deployed on **Vercel**)
- **Backend**: Node.js, Express, TypeScript (Deployed on **Render**)
- **Database**: PostgreSQL with Prisma ORM
- **Media Storage**: Cloudinary integration for scalable asset management
- **Payments**: Razorpay integration for secure checkout processing

---

## ⚙️ Backend Architecture

The Kraya backend is a highly structured, strongly-typed RESTful API built with **Node.js, Express, and TypeScript**. It follows a modular design pattern to ensure maintainability and separation of concerns.

### Core Modules & Features

- **🔐 Authentication & Authorization**
  - JWT-based authentication using HTTP-only secure cookies.
  - Role-Based Access Control (RBAC) distinguishing `CUSTOMER` and `ADMIN` privileges.
  - Integrated OAuth (Google & Facebook) via Passport.js.
  - Secure email verification and password reset workflows.

- **🛍️ Catalog Management (Products & Categories)**
  - Relational mapping between Products and Categories.
  - Multi-variant support (Sizes, Colors, Inventory tracking).
  - Cloudinary integration via Multer for high-performance image uploads and automated media destruction on deletion.

- **🛒 Shopping Lifecycle**
  - **Cart**: Persistent cart state management.
  - **Wishlist**: User-specific product saving.
  - **Orders**: Secure checkout pipeline integrated with Razorpay verification.
  - **Addresses**: Multi-address management with automated default-address toggling.

- **📊 Admin Dashboard**
  - Granular control over the product catalog, users, and order fulfillment (status updating).
  - High-performance dashboard analytics utilizing parallelized database aggregation queries.

### Infrastructure & Deployments
- **Hosting**: Deployed on **Render** utilizing automated CI/CD pipelines from the main branch.
- **Database**: Managed PostgreSQL instance (e.g., Neon) utilizing Prisma migrations for schema synchronization.
- **Media Assets**: Handled seamlessly by **Cloudinary**, returning optimized CDN URLs to the database.

### Environment Configuration

To run the backend locally, you will need the following environment variables defined in a `.env` file within the `/ecommerce-backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/dbname?schema=public"

# Authentication Secrets
JWT_SECRET=your_jwt_secret_key

# Cloudinary (Media Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (Payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Running Locally
```bash
# Navigate to backend
cd ecommerce-backend

# Install dependencies
npm install

# Sync database schema
npx prisma db push

# Start development server
npm run dev
```

---

## 🖥️ Frontend Architecture

> 🚧 *Detailed frontend documentation is currently being finalized and will be updated here shortly.*

The frontend is a modern React application deployed on **Vercel** ([Live App](https://ecommerce-application-pied-five.vercel.app)). It consumes the Kraya REST API to deliver a lightning-fast, responsive user experience utilizing optimized styling frameworks and state management.

Features included:
- Pixel-perfect, responsive UI designs.
- Seamless shopping cart and checkout experiences.
- Dedicated Customer Account and Admin Management dashboards.

*(More details coming soon...)*
