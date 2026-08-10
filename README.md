# Tomato 🍅 — Food Delivery App

Tomato is a full-stack food delivery web application built with the MERN stack. It includes a customer-facing app for browsing the menu, managing a cart, and checking out with Stripe; a separate admin dashboard for managing the food catalog and tracking orders; and a Node.js/Express/MongoDB backend handling authentication, cart persistence, order processing, and image uploads.

**Live demo:** [tomato-food-delivery-beige.vercel.app](https://tomato-food-delivery-beige.vercel.app)

---

## Features

**Customer app**
- Browse the menu by category
- User registration & login (JWT-based auth)
- Add to cart, adjust quantities, view running total
- Checkout via Stripe
- Order history and status tracking

**Admin dashboard**
- Add new food items with image upload (stored on Cloudinary)
- View and remove items from the catalog
- View all orders and update their delivery status

**Backend**
- REST API built with Express
- MongoDB (via Mongoose) for data storage
- JWT authentication & protected routes
- Stripe integration for payments
- Cloudinary for image storage

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router, Axios, React Toastify |
| Admin | React, Vite, React Router, Axios, React Toastify |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Auth | JSON Web Tokens (JWT), bcrypt |
| Payments | Stripe |
| Image Storage | Cloudinary |
| Deployment | Vercel (frontend & admin), Render (backend), MongoDB Atlas |

---

## Project Structure

```
project-del/
├── frontend/     # Customer-facing React app
├── admin/        # Admin dashboard React app
└── backend/      # Express + MongoDB API
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- A MongoDB Atlas connection string
- A Stripe account (test mode is fine)
- A Cloudinary account (free tier is fine)

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `backend/.env` file:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<db-name>
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
FRONTEND_URL=http://localhost:5173
PORT=4000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the backend:

```bash
npm run server
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173`.

### 4. Admin setup

```bash
cd admin
npm install
npm run dev
```

Runs at `http://localhost:5174`.

> Both `frontend` and `admin` talk to the backend at `http://localhost:4000` by default. To point them at a different backend (e.g. a deployed one), set `VITE_BACKEND_URL` in each app's environment.

---

## Deployment

This project is deployed as three separate services:

- **Backend** → [Render](https://render.com) (Root Directory: `backend`, Build: `npm install`, Start: `node server.js`)
- **Frontend** → [Vercel](https://vercel.com) (Root Directory: `frontend`, Framework: Vite)
- **Admin** → [Vercel](https://vercel.com) (Root Directory: `admin`, Framework: Vite)
- **Database** → [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Images** → [Cloudinary](https://cloudinary.com)

Remember to whitelist your backend host's IP (or `0.0.0.0/0` for platforms without a static IP) in MongoDB Atlas's Network Access settings.

---

## Environment Variables Reference

| Variable | Used in | Description |
|---|---|---|
| `MONGO_URI` | backend | MongoDB Atlas connection string |
| `JWT_SECRET` | backend | Secret used to sign JWTs |
| `STRIPE_SECRET_KEY` | backend | Stripe secret key |
| `FRONTEND_URL` | backend | Deployed frontend URL, used for Stripe checkout redirects |
| `CLOUDINARY_CLOUD_NAME` | backend | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | backend | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | backend | Cloudinary API secret |
| `VITE_BACKEND_URL` | frontend, admin | URL of the deployed backend API |

---

## Screenshots

<!-- Add screenshots here, e.g. -->
<!-- ![Home page](./docs/screenshots/home.png) -->

---

## License

This project is open source and available for personal/educational use.
