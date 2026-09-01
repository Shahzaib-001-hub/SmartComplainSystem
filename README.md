# Smart Complaint Management System (MERN Stack)

A modern, component-based **Smart Complaint Management System** built with **React (Vite) + Tailwind CSS + FontAwesome Icons** on the frontend, and **Node.js + Express.js + MongoDB (Mongoose)** on the backend.

---

## 🌟 Key Features

1. **Single Common Login Page**:
   - Seamless authentication for Students, Staff, and Administrators from a unified portal.
   - Dynamic account status validation (`PENDING`, `ACTIVE`, `REJECTED`, `DEACTIVATED`).
   - Smart role-based automatic redirection (`role = 'user'` $\rightarrow$ Student Dashboard, `role = 'admin'` $\rightarrow$ Admin Control Center).
   - Quick Demo Credentials Fill buttons for rapid testing.

2. **User / Student Workflow**:
   - **Registration**: Student registration with name, email, department, student ID, and phone. Creates account with `Status = PENDING`.
   - **Approval Wait**: Explanatory status notices explaining account is awaiting admin approval.
   - **File Complaint**: Submit issues with title, category, priority (Low, Medium, High, Urgent), location, department, description, and photo attachments.
   - **Complaint Tracking**: Real-time lifecycle audit trail with status indicators (`PENDING` $\rightarrow$ `IN PROGRESS` $\rightarrow$ `RESOLVED` / `REJECTED`).
   - **Interactive Views**: Switch between responsive card grid and tabular registry view with live filtering.

3. **Administrator Workflow**:
   - **Overview & Analytics**: Live resolution rates, urgent ticket counters, complaints category breakdown, and pending approval queues.
   - **Manage Complaints**: Search, filter by status/category/priority, view complete submitter profiles and photos, update ticket status, and add official admin remarks / resolution logs.
   - **Manage Users**: Review pending student registrations with one-click **Approve** and **Reject**, toggle **Active / Deactivated** status, promote or demote roles between User and Admin, and manage accounts.

4. **Light & Dark Theme Switcher**:
   - Complete toggle button with sun/moon icons available in the top navigation bar and authentication pages.
   - Preserves user preference in `localStorage`.

---

## 📁 Project Structure

```
SmartComplainSystem/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection handler
│   │   └── seeder.js             # Initial Admin and demo dataset seeder
│   ├── controllers/
│   │   ├── authController.js     # Register, Common Login, Profile
│   │   ├── userController.js     # Admin User Management & Approvals
│   │   ├── complaintController.js# Complaint CRUD, Status Updates, Audit Timeline
│   │   └── statsController.js    # Analytical Metrics & Dashboards
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & RBAC middlewares
│   │   └── errorMiddleware.js    # Not found & global error handlers
│   ├── models/
│   │   ├── User.js               # Mongoose User model with bcrypt hashing
│   │   └── Complaint.js          # Mongoose Complaint model with timeline audit
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── complaintRoutes.js
│   │   └── statsRoutes.js
│   ├── utils/
│   │   └── generateToken.js      # JWT generator
│   ├── .env                      # Environment variables
│   ├── server.js                 # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx        # Top header with profile, role badge & theme toggle
│   │   │   │   ├── Sidebar.jsx       # Responsive navigation sidebar
│   │   │   │   ├── ThemeToggle.jsx   # Dark / Light theme button
│   │   │   │   ├── StatCard.jsx      # Metric cards with FontAwesome icons
│   │   │   │   ├── StatusBadge.jsx   # Color-coded lifecycle badges
│   │   │   │   ├── PriorityBadge.jsx # Priority level indicators
│   │   │   │   ├── Timeline.jsx      # Progression audit trail
│   │   │   │   ├── Modal.jsx         # Accessible modal wrapper
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   └── ProtectedRoute.jsx# Role-based route guard
│   │   │   ├── complaints/
│   │   │   │   ├── ComplaintCard.jsx # Student card view
│   │   │   │   ├── ComplaintTable.jsx# Searchable, filterable complaints table
│   │   │   │   ├── ComplaintFormModal.jsx # New complaint lodging modal
│   │   │   │   ├── ComplaintDetailModal.jsx # Detailed view with full timeline
│   │   │   │   └── StatusUpdateModal.jsx # Admin status update modal
│   │   │   └── users/
│   │   │       └── UserTable.jsx     # User management & approvals table
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Authentication & user state
│   │   │   └── ThemeContext.jsx      # Dark / Light theme provider
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Single Common Login Page
│   │   │   ├── Register.jsx          # Student Registration Page
│   │   │   ├── UserDashboard.jsx     # Student Dashboard
│   │   │   ├── AdminDashboard.jsx    # Central Admin Control Center
│   │   │   └── NotFound.jsx          # 404 Page
│   │   ├── services/
│   │   │   └── api.js                # Axios instance with JWT interceptors
│   │   ├── App.jsx                   # Route configurations
│   │   ├── main.jsx                  # React DOM entry
│   │   └── index.css                 # Tailwind CSS styles
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
│
└── package.json                      # Workspace runner scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [MongoDB](https://www.mongodb.com/) (Local service on port 27017 or MongoDB Atlas URI)

### 2. Configure Environment (`backend/.env`)
Ensure `backend/.env` is configured with your database settings:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smart_complaint_db
JWT_SECRET=smart_complaint_super_secret_jwt_key_2026_!#
JWT_EXPIRE=30d
NODE_ENV=development

ADMIN_NAME=System Administrator
ADMIN_EMAIL=admin@smartcomplaint.com
ADMIN_PASSWORD=Admin@123
```

### 3. Run the Application

You can start both the backend API and frontend Vite dev server concurrently with one command from the root directory:

```bash
npm run dev
```

Or run them individually:
```bash
# Start Backend (Port 5000)
npm run dev:backend

# Start Frontend (Port 5173)
npm run dev:frontend
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/api/health`

---

## 🔑 Default Credentials (Auto-Seeded)

| Role | Email | Password | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `admin@smartcomplaint.com` | `Admin@123` | `ACTIVE` | Full admin privileges |
| **Active Student** | `alex@student.com` | `Password@123` | `ACTIVE` | Pre-approved student |
| **Pending Student** | `sarah@student.com` | `Password@123` | `PENDING` | Test admin approval flow |

*(You can click the Quick Demo buttons on the Login page to autofill any of these accounts!)*

