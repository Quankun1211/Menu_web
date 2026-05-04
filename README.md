# 🖥️ Bep Viet - Smart Admin Dashboard & Web Interface

[![ReactJS](https://img.shields.io/badge/Frontend-ReactJS-blue.svg)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC.svg)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Real--time-Socket.io-010101.svg)](https://socket.io/)
[![Status](https://img.shields.io/badge/Status-Completed-success.svg)]()

## 📌 Project Overview
This repository contains the **Frontend Web Application** for the Bep Viet ecosystem. It serves two primary purposes:
1. **Consumer Web Interface**: Allowing users to discover Vietnamese culinary specialties and consult with an AI assistant.
2. **Admin Business Intelligence Dashboard**: A powerful interface for administrators to manage operations and analyze business performance in real-time.

---

## 🏗 Architecture & Tech Stack
- **Framework**: ReactJS with React Router for seamless navigation.
- **Styling**: TailwindCSS & Material UI (MUI) for a professional, responsive UI/UX.
- **State Management**: React Hooks and Context API.
- **Real-time Communication**: Socket.io-client for instant data synchronization.
- **API Integration**: Axios for communicating with the Node.js backend.

---

## 📊 Key Features

### 1. Business Intelligence & Data Visualization
* **Real-time Analytics**: Integrated charts and graphs to track **Revenue, Order Volume, and Growth Metrics**.
* **Inventory Monitoring**: Visualized data for product stock levels, categories, and ingredient management.
* **User Behavior Insights**: Dashboard designed to display trends and high-performing menu items.

### 2. Smart Operations Management
* **Order Orchestration**: A centralized system to receive, confirm, and assign orders to shippers in real-time.
* **Live Delivery Tracking**: Interactive map/interface to monitor shipper locations and delivery progress via **Socket.io**.
* **AI Consultant Interface**: A clean, intuitive chat interface for users to interact with the **Groq-powered AI Smart Chatbot**.

### 3. Professional Admin UX
* **Dynamic Menu Control**: Full CRUD interface to update dishes, prices, and availability instantly across all platforms (Web & Mobile).
* **Role-Based Access Control (RBAC)**: Secure administrative layers for different levels of management.
* **Media Management**: Integrated with **Cloudinary** for optimized image uploads and gallery management.

---

## 📂 Project Structure
```text
├── src/
│   ├── assets/         # Images, icons, and static files
│   ├── components/     # Reusable UI components (Charts, Tables, Modals)
│   ├── pages/          # Main views: Dashboard, Menu Management, Orders, Analytics
│   ├── context/        # State management and Auth providers
│   ├── services/       # API call definitions and Socket.io setup
│   └── utils/          # Formatting tools and constant definitions
├── tailwind.config.js  # Custom UI configurations
└── package.json        # Dependencies and scripts
