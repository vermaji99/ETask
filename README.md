# TaskMaster - Project Management Tool

TaskMaster is a full-stack project management application that allows users to create projects, manage team members, and track tasks with role-based access control (Admin/Member).

🚀 **[Live Demo](https://your-railway-url.railway.app)** (Replace with actual URL after deployment)

## 🌟 Key Features

- **Authentication**: Secure Signup and Login with JWT.
- **Role-Based Access Control**:
  - **Admin**: Create projects, add/remove team members, create and assign tasks.
  - **Member**: View projects they belong to, update status of tasks assigned to them.
- **Project Management**: Create and manage projects with team collaboration.
- **Task Tracking**: Kanban-style task board with status tracking (Todo, In Progress, Done).
- **Dashboard**: Visual overview of total tasks, completed tasks, pending tasks, and overdue items.
- **Responsive UI**: Modern, clean, and responsive design built with Tailwind CSS.

## ⚙️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express, Mongoose, JWT, Express-Validator.
- **Database**: MongoDB (Atlas or Local).
- **Deployment**: Railway.

## 📦 Getting Started

### Prerequisites

- Node.js installed
- MongoDB instance (Local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/kiet_task.git
   cd kiet_task
   ```

2. Install dependencies for both client and server:
   ```bash
   npm run install-all
   ```

3. Create a `.env` file in the `server` directory and add the following:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

### Running the App

- Run both client and server in development mode:
  ```bash
  npm run dev
  ```
- The frontend will run on `http://localhost:5173` and the backend on `http://localhost:5000`.

## 🌐 Deployment

This app is optimized for deployment on **Railway**.

1. Connect your GitHub repository to Railway.
2. Railway will automatically detect the root `package.json` and run the `build` and `start` scripts.
3. Ensure you add the necessary Environment Variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`) in the Railway dashboard.

## 📝 License

This project is licensed under the ISC License.
