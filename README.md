# ETask - Enterprise Task Management System

ETask is a high-performance, scalable MERN stack application built with a production-level architecture. It features robust task tracking, project management, and team collaboration tools.

🚀 **[Live Demo](https://etask-production-b17e.up.railway.app/)**

## 🏗️ Architecture Overview

This project follows the **Service-Controller-Route** pattern, a standard in industry-level Node.js applications, ensuring maximum maintainability and scalability.

### 📁 Folder Structure

```text
kiet_task/
├── client/                 # Frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── api/           # API service layer (Axios config + endpoints)
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # Global state management
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Routing and logic
├── server/                 # Backend (Node + Express + MongoDB)
│   ├── src/
│   │   ├── controllers/   # Request/Response orchestration
│   │   ├── middleware/    # Auth, Validation, & Error handling
│   │   ├── models/        # Database schemas (Mongoose)
│   │   ├── routes/        # REST API definitions
│   │   ├── services/      # Core business logic
│   │   ├── app.js         # Express configuration
│   │   └── server.js      # Application entry point
└── package.json            # Root scripts and dependencies
```

## 🛠️ Key Engineering Features

### 1. Robust Architecture
- **Separation of Concerns**: Controllers handle HTTP logic, while Services encapsulate business rules and database operations.
- **Service Layer**: Decoupled business logic makes the application easier to test and adapt to different data sources.

### 2. Advanced Security & Validation
- **JWT Authentication**: Secure user sessions with protected routes and administrative privileges.
- **Express-Validator**: Centralized validation middleware ensures data integrity before reaching the business logic.
- **Helmet & CORS**: Configured for secure production deployments.

### 3. Production-Grade Error Handling
- **Async Wrapper**: A centralized `asyncHandler` eliminates repetitive `try-catch` blocks, resulting in cleaner, more readable code.
- **Global Error Middleware**: Provides consistent API error responses across the entire application.

## 🌟 Why This Project Stands Out

1. **Scalability**: Designed to handle increasing complexity by simply adding new Services and Controllers.
2. **Clean Code**: Adheres to SOLID principles and industry best practices.
3. **Optimized Frontend**: Built with Vite for lightning-fast development and optimized production builds.
4. **Resilient Routing**: Implements `HashRouter` to ensure stable navigation and page refreshes on any hosting provider.

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/vermaji99/ETask.git
   ```
2. Install dependencies for both client and server:
   ```bash
   npm run install-all
   ```
3. Configure environment variables in `server/.env`:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the development environment:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

Fully optimized for **Railway**. The application is configured with a robust client-side routing fallback for seamless production deployment.
