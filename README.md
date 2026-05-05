# TaskMaster - Production Ready Project Management Tool

TaskMaster is a high-performance, scalable MERN stack application built with a production-level architecture.

🚀 **[Live Demo](https://your-railway-url.railway.app)**

## 🏗️ Architecture Overview

This project follows the **Service-Controller-Route** pattern, a standard in industry-level Node.js applications.

### 📁 Folder Structure

```text
kiet_task/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── api/           # API service layer (Axios config + endpoints)
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # State management (AuthContext)
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Routing and Protected Routes
│   │   └── main.jsx
├── server/                 # Backend (Node + Express)
│   ├── src/
│   │   ├── config/        # Database and env configurations
│   │   ├── controllers/   # Request/Response handling ONLY
│   │   ├── middleware/    # Auth, Error handling, Async wrappers
│   │   ├── models/        # Database schemas (Mongoose)
│   │   ├── routes/        # REST API route definitions
│   │   ├── services/      # Business logic and DB operations
│   │   ├── validations/   # Data validation (express-validator)
│   │   ├── app.js         # Express app configuration
│   │   └── server.js      # Server entry point (PORT listener)
└── package.json            # Root scripts for build/dev
```

## 🛠️ Key Refactorings (Backend)

### 1. Separation of Concerns
- **Controllers**: Now only handle `req` and `res`. They don't know about the database.
- **Services**: Contain all business logic. This makes them reusable and easier to test.

### 2. Centralized Validations
- Used `express-validator` to create a dedicated `validations/` folder. Routes are protected by these validation middlewares before reaching the controller.

### 3. Scalable Server Setup
- Split `app.js` and `server.js`. This is crucial for **Unit Testing** (allowing you to test the app without starting a real server).

### 4. Robust Error Handling
- **Async Wrapper**: A centralized `asyncHandler` removes the need for `try-catch` blocks in every controller, making the code much cleaner.
- **Global Error Middleware**: Handles all errors in one place, ensuring consistent API responses.

## 💻 Example Code Snippets

### Route (`routes/projectRoutes.js`)
```javascript
router.post('/', protect, admin, validateProject, createProject);
```

### Controller (`controllers/projectController.js`)
```javascript
const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.body, req.user._id);
  res.status(201).json(project);
});
```

### Service (`services/projectService.js`)
```javascript
const createProject = async (projectData, adminId) => {
  const { name, description, members } = projectData;
  return await Project.create({
    name,
    description,
    admin: adminId,
    members: members || [],
  });
};
```

## 🌟 Why this structure is better for interviews?

1. **Scalability**: New features can be added by simply creating a new Service and Controller without cluttering existing files.
2. **Maintainability**: Logic is decoupled. If you change the database from MongoDB to PostgreSQL, you only change the Services, not the Controllers or Routes.
3. **Testability**: Because business logic is isolated in Services, you can write unit tests for it very easily.
4. **Professionalism**: It demonstrates that you understand how real-world enterprise applications are structured beyond simple MVC.

## 📦 Getting Started

1. Clone the repo and run `npm run install-all`.
2. Set up your `.env` in the `server` folder.
3. Run `npm run dev` to start both client and server.

## 🌐 Deployment

Ready for one-click deployment on **Railway**.
