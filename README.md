# Team Task Manager (Full-Stack MERN)

## 🚀 Overview
Team Task Manager is a full-stack web application designed for role-based project and task management. It allows administrators to create projects, assign tasks, and track their progress, while giving team members a dedicated dashboard to update their task statuses. 

The project features a beautiful glassmorphism UI, a secure JWT-based authentication system, and a robust REST API backend.

## 💻 Tech Stack
- **Frontend:** React.js, Vite, React Router, Axios, Vanilla CSS (Premium Glassmorphism design), React-DatePicker.
- **Backend:** Node.js, Express.js, Mongoose.
- **Database:** MongoDB Atlas.
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs.
- **Deployment Config:** Includes `vercel.json` for frontend client-side routing.

## 🛠️ Features & Work Flow
- **Authentication:** Secure signup and login for users. 
- **Role-Based Access Control (RBAC):**
  - **Admin:** Can create new projects, view all projects they own, create tasks, assign tasks to members, and update any task status.
  - **Member:** Can only view projects they are a part of, view tasks assigned to them, and update their own task statuses.
- **Dashboard:** Provides an analytical summary of Total Tasks, Completed, In Progress, and Overdue tasks.
- **Project Management:** Admins can create and manage team projects.
- **Task Management:** Real-time task tracking (Pending -> In Progress -> Completed). Admins use a dedicated interactive calendar picker to assign accurate task due dates.

## 📂 Project Structure
```text
Ethara.AI_Task/
│
├── backend/                  # Node.js & Express API
│   ├── middleware/           # JWT Protection & Admin Validation (authMiddleware.js)
│   ├── models/               # Mongoose Schemas (User, Project, Task)
│   ├── routes/               # API Endpoints (Auth, Projects, Tasks, Dashboard)
│   ├── .env                  # MongoDB URI, JWT Secret, Port
│   └── server.js             # Main server entry point
│
├── frontend/                 # React frontend (Vite)
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable UI (Navbar)
│   │   ├── context/          # Global Auth State (AuthContext.jsx)
│   │   ├── pages/            # Login, Dashboard, Projects, Tasks
│   │   ├── api.js            # Axios instance with dynamic Base URL 
│   │   ├── App.jsx           # React Router & Protected Routes configuration
│   │   └── index.css         # Global Styles (Glassmorphism theme & Layouts)
│   ├── .env                  # VITE_API_URL environment variable
│   └── vercel.json           # Vercel rewrite configuration to fix 404s
│
└── README.md                 # Project documentation
```

## 🌐 Live URL
- **Live Application:** [Insert your Vercel/Railway Live URL Here]

## 🔑 Test Accounts
You can test the application using the following pre-created accounts which are securely stored in the MongoDB Atlas database.

**Test Account 1 (Admin Role):**
- **Email:** `test@test.com`
- **Password:** `password`

**Test Account 2 (Admin Role):**
- **Email:** `alice2@test.com`
- **Password:** `password123`

*Note: You can also dynamically create your own new Admin or Member accounts at any time directly from the Login/Signup page!*

## ⚙️ Local Setup
To run this project on your local machine:

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   ```

2. **Start the Backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```
   *(Backend will run on http://localhost:5000)*

3. **Start the Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *(Frontend will be accessible at http://localhost:5173)*
