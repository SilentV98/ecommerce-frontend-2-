# React E-Commerce Admin Dashboard & User System

A fully responsive, feature-rich React e-commerce application equipped with an admin dashboard, role-based access control, local state management via LocalStorage, strict dark-mode design (Purple & Mint theme), and full accessibility (A11y) compliance.
---

## Tools & Libraries Used

* **React (v18+)** - Frontend JavaScript library for building user interfaces.
* **React Router DOM** - For multi-page routing, route protection, and unauthorized handling.
* **LocalStorage** - For persistent local data storage (cart, orders, users, and products).
* **Vite** - High-performance build tool and development server.
* **CSS Variables & Custom Styling** - For a strict responsive design system.

---

## Prerequisites

Make sure you have the following installed on your machine:
* **Node.js** (v16.0 or higher recommended)
* **npm** (Node Package Manager)

---

## Features

* **Admin Dashboard & Management:** Manage products, track inventory stock, update order statuses (with automatic stock deduction upon delivery), and view registered customer accounts.
* **User Profile & Authentication:** Secure login, account registration with password strength indicators, and profile editing capabilities.
* **Shopping Cart & Checkout:** Persistent cart state using LocalStorage and a direct checkout system capturing phone numbers and shipping details.
* **Responsive Design:** Optimized for desktop, tablet, and mobile viewports with tight layouts and collapsible mobile product filters.
* **Accessibility (A11y):** Semantic HTML elements, clear keyboard focus-visible rings, screen-reader utilities (`.sr-only`), and high-contrast color schemes.

---

## Project Setup & Installation

1. **Clone the repository or open your project folder in your terminal.**

2. **Install dependencies:**
   ```bash
1.	npm install
2.	cd ecommerce-frontend
3.	npm run dev

It will Run on http://localhost:5173
*Ensure the link from bash*




Key Components
AdminDashboard: Centralized admin management panel featuring real-time revenue overview, product inventory stock tracking, category management, order status updates (with automatic stock deduction upon delivery), and registered users list.

AdminSidebar: Navigation sidebar for switching between administrative tabs.

Toast: Reusable notification alert component for user feedback.

Register / Profile: Forms featuring robust validation states and clear focus management.




Mock Accounts & Credentials
This application utilizes safe mock credentials for testing and evaluation purposes:

Administrator Account:

Email: admin@store.com

Password: admin123

Role: Admin (Grants full access to /admin dashboard).

Customer Account:

Email: customer@store.com

Password: user123

Role: Customer (Standard buyer access with order history tracking).


Data Architecture Note
Important Architecture Notice: This project currently operates entirely using Mock Data (mockData.js)
and browser LocalStorage for data persistence and state synchronization across components.
The frontend is fully structured and decoupled, and it is fully prepared to be connected to a real backend REST or GraphQL API in future updates.



## Folder Structure

```text
src/
├── assets/
├── components/
│   ├── cart/
│   ├── common/         # Reusable components (Alert, Button, Toast, Modal, ProtectedRoute, etc.)
│   ├── forms/
│   ├── layout/         # Layout components (Navbar, Footer, AdminSidebar)
│   └── products/       # Product-specific components (CategoryCard, ProductCard)
├── context/
│   ├── AuthContext.jsx # Authentication state management
│   └── CartContext.jsx # Shopping cart state management
├── data/
│   └── mockData.js     # Centralized mock datasets (products, categories, users, orders)
├── hooks/
│   ├── useCart.js      # Cart custom hook
│   ├── useLocalStorage.js # LocalStorage synchronization hook
│   └── useProducts.js  # Product catalog and stock management hook
├── pages/
│   ├── AdminDashboard.jsx # Admin management panel
│   ├── Cart.jsx           # Shopping cart page
│   ├── Checkout.jsx       # Checkout and order placement page
│   ├── Home.jsx           # Landing / Home page
│   ├── Login.jsx          # Authentication login page
│   ├── NotFound.jsx       # 404 Error page
│   ├── ProductDetails.jsx # Detailed product view
│   ├── Products.jsx       # Product catalog & filters page
│   ├── Profile.jsx        # Customer profile and order history
│   ├── Register.jsx       # User registration page
│   └── Unauthorized.jsx   # Access control error page
├── styles/
│   └── design-system.css  # Strict purple/mint dark theme design system
├── utils/
│   └── auth.js         # Authentication helpers and storage utilities
├── App.css             # Main application styling overrides
├── App.jsx             # Main routing and layout wrapper
├── index.css           # Global root variables and responsive base styles
└── main.jsx            # Application entry point






Pages & Routes in your application:

/ (Home): The landing or home page of the store.

/products: The product catalog and browsing page with filtering options.

/product/:id (Product Details): The detailed view for an individual product (ProductDetails.jsx).

/cart: The shopping cart management page.

/checkout: The secure checkout and shipping details processing page.

/login: The user and administrator login authentication page.

/register: The account registration page with password strength validation.

/profile: The customer account profile page displaying personal information editing and personal order history.

/admin: The restricted administrator dashboard (AdminDashboard.jsx) featuring management tabs for overview/revenue, products, categories, orders, and registered users.

/unauthorized: The access control error page for users lacking permissions.

* (Not Found / 404): The fallback error page for invalid or missing routes (NotFound.jsx).