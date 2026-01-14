# Shoe Store eCommerce Platform

A full-stack eCommerce web application for selling shoes, built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Project Overview

This project provides a complete backend for eCommerce operations and a modern frontend (in development) for customers and admins. The backend is fully functional, while the client is actively being developed.

---

## Folder Structure

```
eCom/
│   README.md
│   test-server.js
│
├── client/                  # Frontend (React, Vite, Tailwind CSS)
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── test/
│       └── utils/
│
├── server/                  # Backend (Node.js, Express, MongoDB)
│   ├── app.js
│   ├── initial.js
│   ├── package.json
│   ├── server.js
│   ├── .env
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
│
├── postman/                 # API collections for testing
│   └── collections/
│       └── eCom.postman_collection.json
```

### Backend Folder Details

```
server/
│   app.js                  # Express app setup
│   initial.js              # Initial data/configuration loader
│   package.json            # Backend dependencies and scripts
│   server.js               # Server entry point
│   .env                    # Environment variables
│
├── config/
│     db.js                 # MongoDB connection setup
│
├── controllers/
│     adminController.js    # Admin-related logic
│     authController.js     # Auth/register/login logic
│     cartController.js     # Cart operations
│     orderController.js    # Order operations
│     paymentController.js  # Payment processing
│     productController.js  # Product CRUD
│
├── middleware/
│     auth.js               # Auth middleware (JWT, roles)
│     globalErrorHandler.js # Centralized error handler
│
├── models/
│     adminUser.js          # Admin user schema
│     Cart.js               # Cart schema
│     Order.js              # Order schema
│     Product.js            # Product schema
│     User.js               # User schema
│
├── routes/
│     adminRoutes.js        # Admin API routes
│     authRoutes.js         # Auth API routes
│     cartRoutes.js         # Cart API routes
│     orderRoutes.js        # Order API routes
│     paymentRoutes.js      # Payment API routes
│     productRoutes.js      # Product API routes
│
├── services/
│     paymentService.js     # Payment gateway integration
│
├── utils/
│     appError.js           # Custom error class
│     catchAsync.js         # Async error wrapper
│     signToken.js          # JWT token utilities
```

---

## Features

### Backend (Complete)

- User authentication and registration (JWT-based)
- User authorization and protected routes
- Product management (CRUD operations)
- Cart management (add, update, remove items)
- Order management (place, view, update orders)
- Payment processing and Razorpay integration
- Admin panel features (manage users, products, orders)
- Centralized error handling
- Database connection and configuration

### Frontend (In Development)

- Modern React UI for customers and admins
- Product catalog, cart, and checkout pages
- User registration/login and order history
- Admin dashboard for managing products, orders, and users

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Razorpay for payment integration

### Frontend
- React.js
- Tailwind CSS (with dark mode)
- React Router DOM
- Context API for state management
- Vite for build tooling

---

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Razorpay account for payments

### Installation

1. Clone the repository:
	```bash
	git clone <repository-url>
	cd eCom
	```

2. Install backend dependencies:
	```bash
	cd server
	npm install
	```

3. Install frontend dependencies:
	```bash
	cd ../client
	npm install
	```

4. Set up environment variables:
	- Copy `.env.example` to `.env` in both `server` and `client` directories
	- Fill in the required environment variables

5. Start the backend server:
	```bash
	cd server
	npm run dev
	```

6. Start the frontend development server:
	```bash
	cd ../client
	npm run dev
	```

---

## Environment Variables

### Client (.env)
```
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Server (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

## Deployment

- Frontend: Deploy to Vercel or Netlify
- Backend: Deploy to Render, Railway, or similar Node.js hosting

---

## License

MIT