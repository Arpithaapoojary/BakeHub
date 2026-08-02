<div align="center">

<img src="https://img.shields.io/badge/BakeHub-Bakery%20Marketplace-e07b54?style=for-the-badge&logo=react" alt="BakeHub" />

# 🍰 BakeHub

### *Your Neighborhood Bakery Marketplace*

A full-stack web application that connects local bakery owners with customers — enabling easy menu browsing, cart management, order placement, and real-time tracking.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Image%20Storage-3448C5?style=flat-square&logo=cloudinary)](https://cloudinary.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📌 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Getting Started](#️-getting-started)
- [🔐 Environment Variables](#-environment-variables)
- [👥 User Roles](#-user-roles)
- [🗺️ API Endpoints](#️-api-endpoints)
- [📸 Screenshots](#-screenshots)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 👤 Customer
- 📍 Browse nearby approved bakeries
- 🛒 Add items to cart (single-bakery enforcement)
- 💳 Checkout with payment popup
- 📦 Track orders in real-time with status updates
- 🧾 Download PDF invoice for any order
- 🔑 OTP-verified registration & secure login
- 🔁 Forgot/reset password via email link

### 🏪 Bakery Owner
- 📝 Register with bakery details (pending admin approval)
- 📋 Manage full menu (add, edit, delete items)
- 🖼️ Upload bakery images (Cloudinary-powered)
- 📊 Dashboard with order analytics & charts
- 📬 Receive and track customer orders
- ⚙️ Update bakery profile and settings

### 🛡️ Admin
- ✅ Approve or reject bakery registrations
- 👥 View and manage all users
- 📊 Platform-wide analytics dashboard
- 📨 Read & reply to customer contact messages
- 🔒 Secure admin-only routes

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router v7, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js (ESM), Mongoose |
| **Database** | MongoDB Atlas |
| **Auth** | JWT (JSON Web Tokens) + bcryptjs |
| **Image Storage** | Cloudinary |
| **Email** | Nodemailer + Brevo SMTP |
| **Charts** | Recharts |
| **PDF** | jsPDF + jsPDF-AutoTable |
| **HTTP Client** | Axios |
| **Icons** | Lucide React, React Icons |

---

## 📁 Project Structure

```
BakeHub/
├── backend/                    # Express API server
│   ├── src/
│   │   ├── config/             # Database connection
│   │   ├── controllers/        # Route handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── bakery.controller.js
│   │   │   ├── order.controller.js
│   │   │   ├── product.controller.js
│   │   │   ├── menu.controller.js
│   │   │   ├── analytics.controller.js
│   │   │   ├── message.controller.js
│   │   │   └── user.controller.js
│   │   ├── middleware/         # Auth, upload middleware
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # API route definitions
│   │   ├── utils/              # Mailer utility
│   │   └── server.js           # Entry point
│   ├── public/uploads/         # Local image fallback
│   └── package.json
│
└── frontend/                   # React application
    ├── src/
    │   ├── api/                # Axios instance
    │   ├── components/         # Header, Footer, Cards
    │   ├── context/            # AuthContext, CartContext
    │   ├── lib/                # API helpers
    │   ├── pages/
    │   │   ├── admin/          # AdminDashboard, AdminSettings
    │   │   ├── owner/          # OwnerDashboard, OwnerSettings
    │   │   ├── customer/       # Browse, Menu, Cart, Checkout, Orders, Invoice
    │   │   └── common/         # MyProfile, Settings
    │   └── App.js
    └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://mongodb.com/atlas) account
- [Cloudinary](https://cloudinary.com/) account (free tier works)
- [Brevo](https://brevo.com/) account for SMTP email (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/Arpithaapoojary/BakeHub.git
cd BakeHub
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder (see [Environment Variables](#-environment-variables)):

```bash
npm run dev        # Development (nodemon)
# or
npm start          # Production
```

Backend runs at: **http://localhost:5000**

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```bash
npm start          # Development
# or
npm run build      # Production build
```

Frontend runs at: **http://localhost:3000**

---

## 🔐 Environment Variables

### `backend/.env`

```env
# Server
PORT=5000

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/BakeHub

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Email (Brevo SMTP)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_smtp_user
SMTP_PASS=your_brevo_smtp_password
EMAIL_FROM="BakeHub <no-reply@bakehub.com>"
FRONTEND_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### `frontend/.env`

```env
REACT_APP_API=http://localhost:5000/api
```

> ⚠️ **Never commit `.env` files** — they are listed in `.gitignore`.

---

## 👥 User Roles

| Role | Access | Registration |
|---|---|---|
| **Customer** | Browse bakeries, place & track orders | Public signup (OTP verified) |
| **Owner** | Manage menu & orders, view analytics | Public signup → Admin approval |
| **Admin** | Full platform management | Created via API (see below) |

### Creating the First Admin

Since there is no sign-up page for admins, use this API call once to create the admin account:

```bash
curl -X POST http://localhost:5000/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@bakehub.com","password":"YourStrongPassword"}'
```

Then log in at `/login` with the **Admin** role selected.

---

## 🗺️ API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/send-otp` | Send email OTP for registration |
| POST | `/verify-otp` | Verify OTP |
| POST | `/register-customer` | Register a customer |
| POST | `/register-owner` | Register a bakery owner |
| POST | `/register-admin` | Register an admin |
| POST | `/login` | Login (all roles) |
| POST | `/forgot-password` | Send password reset email |
| POST | `/reset-password` | Reset password via token |

### Bakeries — `/api/bakeries`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/public` | Public | Get all approved bakeries |
| GET | `/mine` | Owner | Get logged-in owner's bakery |
| GET | `/` | Admin | Get all bakeries |
| PUT | `/:id/approve` | Admin | Approve a bakery |
| PUT | `/:id/reject` | Admin | Reject a bakery |
| PUT | `/upload-image` | Owner | Upload bakery image |

### Orders — `/api/orders`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Customer | Place an order |
| GET | `/my` | Customer | Get my orders |
| GET | `/bakery` | Owner | Get bakery's orders |
| PUT | `/:id/status` | Owner | Update order status |
| GET | `/:id` | Auth | Get order by ID |

### Products — `/api/products`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/bakery/:bakeryId` | Public | Get bakery products |
| POST | `/` | Owner | Add product |
| PUT | `/:id` | Owner | Update product |
| DELETE | `/:id` | Owner | Delete product |

---

## 📸 Screenshots

> _Coming soon — add screenshots of your UI here._

---

## 🚀 Deployment

### Backend (e.g., Render / Railway)
1. Set all environment variables in the platform dashboard
2. Build command: `npm install`
3. Start command: `npm start`

### Frontend (e.g., Vercel / Netlify)
1. Set `REACT_APP_API` to your deployed backend URL
2. Build command: `npm run build`
3. Output directory: `build`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/Arpithaapoojary">Arpitha Poojary</a>
</div>
