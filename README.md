
# 📌 Team Task Manager (Full Stack Web App)

A role-based full-stack task management system built using React, Node.js, Express, and MySQL.
It allows teams to manage projects, assign tasks, track progress, and monitor dashboards with authentication and role-based access control.

# 🚀 Live Demo
- Frontend: 
- Backend: 

# 🧑‍💻 Tech Stack
## Frontend
- React.js
- Tailwind CSS
- React Router DOM 
- Fetch API
## Backend
- Node.js
- Express.js
- JWT Authentication
- bycrypt.js 
## Database
- MySQL

# 📁 Project Structure
team-task-manager/
│
├── server/                  # Backend
│   ├── config/              # DB connection
│   ├── controllers/         # Business logic
│   ├── routes/              # API routes
│   ├── middleware/          # Auth & RBAC
│   ├── app.js
│
├── client/                  # Frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│
└── README.md

# Features
## 🔐 Authentication
- User Signup and Login
- Password hashing using bcrypt
- JWT-based authentication system

## 👑 Role-Based Access Control (RBAC)

### Roles

#### 🔴 Admin
- Can create new projects
- Can add team members to projects

#### 🟢 Member
- Can view assigned projects
- Can create and update tasks within assigned projects

## 📁 Project Management
- Create new projects
- Assign team members to projects
- View all projects

## 📋 Task Management

- Create tasks under projects  
- Assign tasks to users  
- Update task status:

### Status Types
- 📝 Todo  
- 🔄 In Progress  
- ✅ Done  

## 📊 Dashboard
- Total tasks
- Completed tasks
- Pending tasks
- Overdue tasks

## 🗄️ Database Design (MySQL)

The application follows a relational database structure to manage users, projects, and tasks efficiently.

### 👤 Users Table
Stores user information and roles.

- id (Primary Key)  
- name  
- email  
- password  
- role → admin / member  

---

### 📁 Projects Table
Stores project details.

- id (Primary Key)  
- name  
- description  
- created_by (FK → Users.id)  

---

### 👥 Project Members Table
Maps users to projects with specific roles.

- id (Primary Key)  
- project_id (FK → Projects.id)  
- user_id (FK → Users.id)  
- role  

---

### 📌 Tasks Table
Stores task details within projects.

- id (Primary Key)  
- title  
- description  
- status → Todo / In Progress / Done  
- due_date  
- project_id (FK → Projects.id)  
- assigned_to (FK → Users.id)  
- created_by (FK → Users.id)  
# ⚙️ Setup Instructions
### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
```
### 2️⃣ Backend Setup

```bash
cd server
npm install
```
### Create .env
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_manager
JWT_SECRET=secret123
```
### Run Backend
```bash
npm run dev
```
### 3️⃣ Frontend Setup
```bash
cd client
npm install
npm start
```

# 🔌 API Endpoints
### Auth
- POST /api/auth/signup
- POST /api/auth/login

### Projects
- GET /api/projects
- POST /api/projects (Admin only)

### Tasks
- GET /api/tasks/project/:id
- POST /api/tasks
- PUT /api/tasks/:id
- GET /api/tasks/dashboard
# 🔐 Authentication Flow
1. User logs in
2. JWT token is generated
3. Token stored in localStorage
4. Token sent in headers for protected routes
```http
Authorization: Bearer <token>
```
# 📊 Dashboard Logic
- Total tasks → COUNT(*)
- Completed → status = 'done'
- Pending → status != 'done'
- Overdue → due_date < CURRENT_DATE AND not completed
# 🛡️ Role-Based Access Control
| Role   | Permissions                  |
| ------ | ---------------------------- |
| Admin  | Create projects, manage team |
| Member | View projects, manage tasks  |

# 🚀 Deployment
### Backend
- Deploy using Railway
### Frontend
- Deploy using Railway
### Environment Variables
- Add .env variables in deployment dashboard

# 👨‍💻 Author
Anil Pathania