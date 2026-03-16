# School Management System

> A full-stack role-based school management platform. Admins manage students, courses, enrolments, grades, and attendance. Students view their courses, grades, and attendance records.

**Live Demo:** [schoolmanagement-omega-ten.vercel.app](https://schoolmanagement-omega-ten.vercel.app)

---

## Overview

| Layer | Tech | Hosted on |
|---|---|---|
| Frontend | React 18 + Vite + Tailwind CSS | Vercel |
| Backend | Node.js + Express | Render |
| Database | PostgreSQL (Supabase) | Supabase |
| Storage | Cloudinary | Cloudinary |

---

## Monorepo Structure

```
school-management/
├── backend/        # Express REST API
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── README.md   ← backend-specific docs
├── frontend/       # React + Vite SPA
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── README.md   ← frontend-specific docs
└── README.md       ← you are here
```

> Each subfolder has its own `README.md` with detailed setup, structure, and API docs.

---

## Features

### Admin
- Dashboard with live charts — enrolments by month, grade distribution, top courses, attendance summary
- Full CRUD for users, courses, and enrolments
- Set and update student grades with auto letter-grade calculation
- Mark and view attendance by course and date
- Upload / remove profile avatar (Cloudinary)

### Student
- View enrolled courses
- View personal grades and attendance records
- Update profile and change password

### General
- JWT-based authentication with role-based route protection
- Dark / light mode toggle
- Animated page transitions (Framer Motion)
- Responsive layout — mobile through desktop
- Toast notifications for all actions

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database (local or [Supabase](https://supabase.com))
- [Cloudinary](https://cloudinary.com) account (free tier)

---

### 1. Clone the repo

```bash
git clone <repo-url>
cd school-management
```

---

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=8000
NODE_ENV=development

DATABASE_URL=postgresql://user:password@host:5432/dbname

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend:

```bash
npm run dev
# API running at http://localhost:8000
```

---

### 3. Set up the Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

Start the frontend:

```bash
npm run dev
# App running at http://localhost:5173
```

---

## Roles & Access

| Feature | Student | Admin |
|---|---|---|
| View courses | ✅ | ✅ |
| Create / edit / delete courses | ❌ | ✅ |
| View own grades | ✅ | ✅ |
| Set / edit grades | ❌ | ✅ |
| View own attendance | ✅ | ✅ |
| Mark attendance | ❌ | ✅ |
| View own enrolments | ✅ | ✅ |
| Enrol / remove students | ❌ | ✅ |
| Manage users | ❌ | ✅ |
| View dashboard charts | ❌ | ✅ |
| Upload / remove avatar | ✅ | ✅ |
| Update profile & password | ✅ | ✅ |

> Public registration defaults to the `student` role. Admin accounts must be created by an existing admin.

---

## API Summary

Base URL: `http://localhost:8000/api`

| Module | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Users | `GET /users`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id` |
| Courses | `GET /courses`, `POST /courses`, `PUT /courses/:id`, `DELETE /courses/:id` |
| Enrolments | `GET /enrolments`, `POST /enrolments`, `DELETE /enrolments/:id` |
| Grades | `GET /grades`, `POST /grades`, `GET /grades/my` |
| Attendance | `GET /attendance`, `POST /attendance`, `GET /attendance/my` |
| Profile | `GET /profile`, `PUT /profile`, `PUT /profile/password` |
| Avatar | `POST /avatar`, `DELETE /avatar` |
| Dashboard | `GET /dashboard/charts` |

> See [`backend/README.md`](./backend/README.md) for full endpoint details, request bodies, and role requirements.

---

## Environment Variables Summary

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 8000) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `1d`) |
| `NODE_ENV` | `development` or `production` |
| `FRONTEND_URL` | Allowed CORS origin |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

> ⚠️ Never commit `.env` files. Both are already in `.gitignore`.

---

## Deployment

### Backend → Render
- Set all backend env variables in Render's environment config
- `NODE_ENV=production` enables SSL for the Supabase DB connection
- Start command: `npm start`

### Frontend → Vercel
- Set `VITE_API_URL` to your Render backend URL in Vercel's environment config
- Build command: `npm run build`
- Output directory: `dist`
- Vercel auto-deploys on push to main

---

## Scripts

### Backend
```bash
npm run dev    # nodemon (development)
npm start      # node (production)
```

### Frontend
```bash
npm run dev      # Vite dev server
npm run build    # Production build → /dist
npm run preview  # Preview production build
```

---

## Further Reading

- [Backend README](./backend/README.md) — full API reference, project structure, grading scale
- [Frontend README](./frontend/README.md) — route protection, API layer, styling guide, context