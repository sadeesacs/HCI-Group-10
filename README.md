<div align="center">

#  Casa Ceylon

### Premium Sri Lankan Furniture — E-Commerce & Interactive 3D Room Designer

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-0.183-black?logo=threedotjs&logoColor=white)](https://threejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.5-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**A full-stack furniture e-commerce platform with an interactive 3D room designer, built as part of a Human-Computer Interaction (HCI) course project.**

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [API Endpoints](#-api-endpoints) · [License](#-license)

</div>

---

## ✨ Features

### 🛍️ E-Commerce Platform
- **Product Catalog** — Browse curated Sri Lankan furniture with filtering and search
- **Product Details** — View pricing (LKR), descriptions, dimensions, and multiple images
- **Shopping Cart** — Add, update quantities, and remove items
- **Checkout Flow** — Complete order placement with delivery details
- **User Authentication** — Register, login, password recovery with OTP verification (JWT-based)
- **Order Tracking** — View order success and confirmation

### 🎨 Interactive 3D Room Designer
- **6 Room Shapes** — Rectangular, L-Shape, T-Shape, U-Shape, Circular, and Custom polygons
- **Dual View Modes** — Seamless toggle between 2D floor plan (Konva) and 3D perspective (Three.js)
- **Camera Presets** — Front, Back, Left, Right, Top-Down, and Default orbital views
- **Furniture Library** — Categorized catalog with real GLB 3D models and accurate dimensions
- **Drag & Drop Placement** — Intuitive furniture placement with collision boundaries
- **Properties Panel** — Fine-tune position, rotation, dimensions (cm), upholstery colors, and view pricing
- **Doors & Windows** — Place and configure openings on room walls
- **Save & Load** — Up to 10 design slots with rename support
- **Undo / Redo** — Full history tracking with throttled state snapshots

### 🌐 Landing & Content Pages
- **Hero Section** with animated call-to-action
- **Featured Products** carousel
- **"Why Choose Us"** value propositions
- **How It Works** step-by-step guide
- **Customer Testimonials**
- **Inspiration Gallery** for design ideas
- **FAQ** and **About Us** pages
- **Store Locator** with interactive Leaflet map

---

## 🛠 Tech Stack

<table>
<tr>
  <td><b>Frontend</b></td>
  <td>
    React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion<br/>
    Three.js · React Three Fiber · React Three Drei<br/>
    Radix UI · React Router 7 · TanStack Query · Konva · Leaflet · Sonner
  </td>
</tr>
<tr>
  <td><b>Backend</b></td>
  <td>
    Node.js · Express 4 · TypeScript · Mongoose (MongoDB) · JWT · bcrypt
  </td>
</tr>
<tr>
  <td><b>DevOps</b></td>
  <td>
    Docker Compose · Vite Dev Server · ts-node-dev
  </td>
</tr>
</table>

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18+
- [Docker](https://www.docker.com/) & Docker Compose (optional)

### Option 1 — Docker Compose (Recommended)

```bash
git clone https://github.com/your-username/HCI-Group-10.git
cd HCI-Group-10
docker compose up --build
```

| Service    | URL                        |
|------------|----------------------------|
| Frontend   | http://localhost:5173      |
| Backend    | http://localhost:5000      |

### Option 2 — Manual Setup

**Backend**
```bash
cd app/backend
npm install
npm run seed:products   # Seed the product database
npm run dev             # Starts on port 5000
```

**Frontend**
```bash
cd app/frontend
npm install
npm run dev             # Starts on port 5173
```

---

## 📁 Project Structure

```
HCI-Group-10/
├── docker-compose.yml
├── app/
│   ├── backend/
│   │   └── src/
│   │       ├── config/          # Database & environment config
│   │       ├── controllers/     # Route handlers
│   │       ├── middleware/       # Auth & validation middleware
│   │       ├── models/          # Mongoose schemas
│   │       ├── routes/          # Express route definitions
│   │       └── services/        # Business logic
│   └── frontend/
│       └── src/
│           ├── components/
│           │   ├── designer/    # 3D Room Designer (Canvas, Toolbar, Properties, etc.)
│           │   ├── landing/     # Landing page sections
│           │   ├── layout/      # Header, Footer, Layout wrappers
│           │   └── ui/          # Reusable Radix-based UI primitives
│           ├── data/            # Mock data & constants
│           ├── hooks/           # Custom React hooks
│           ├── lib/             # Utility functions
│           └── pages/           # Route-level page components
```

---

## 📡 API Endpoints

| Method   | Endpoint                  | Description              | Auth |
|----------|---------------------------|--------------------------|------|
| `GET`    | `/api/health`             | Health check             | ✅   |
| `GET`    | `/api/products`           | List all products        | ✅   |
| `GET`    | `/api/products/:id`       | Get product by ID        | ✅   |
| `POST`   | `/api/auth/register`      | Register new user        | ✅   |
| `POST`   | `/api/auth/login`         | Login & receive JWT      | ✅   |
| `POST`   | `/api/checkout`           | Create an order          | ✅   |
| `GET`    | `/api/checkout/:id`       | Get order details        | ✅   |
| `GET`    | `/api/designs`            | List saved designs       | ✅   |
| `PUT`    | `/api/designs/:id`        | Update a design          | ✅   |
| `DELETE` | `/api/designs/:id`        | Delete a design          | ✅   |
| `PATCH`  | `/api/designs/:id/rename` | Rename a design          | ✅   |
| `POST`   | `/api/contact`            | Submit contact form      | ✅   |

---

## 👥 Team

**HCI Group 10** — University Year 3, Human-Computer Interaction Course Project

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
