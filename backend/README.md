# School Management System — Backend API

> RESTful API built with Node.js, Express, PostgreSQL, and Cloudinary.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express | HTTP server & routing |
| PostgreSQL (`pg`) | Primary database |
| Supabase | Hosted PostgreSQL (production) |
| Cloudinary | Avatar image storage & CDN |
| JWT (`jsonwebtoken`) | Authentication tokens |
| bcryptjs | Password hashing |
| Multer | File upload middleware |
| Helmet | HTTP security headers |
| Morgan | Request logging |
| dotenv | Environment config |

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── DB.js                   # PostgreSQL pool config
│   │   ├── cloudinary.js           # Cloudinary + Multer (cloud storage)
│   │   └── multer.js               # Multer (local disk, fallback)
│   ├── controllers/
│   │   ├── authController.js       # register, login, getMe
│   │   ├── avatarController.js     # upload / delete avatar
│   │   ├── courseController.js     # CRUD for courses
│   │   ├── dashboardController.js  # admin chart data
│   │   ├── enrolmentController.js  # enrol / remove students
│   │   ├── gradesController.js     # grades + attendance
│   │   ├── profileController.js    # profile + password
│   │   └── userController.js       # admin user management
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification
│   │   ├── errorMiddleware.js      # global error handler
│   │   └── roleMiddleware.js       # role-based access control
│   ├── models/
│   │   ├── courseModel.js
│   │   ├── enrolmentModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── avatarRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── enrolmentRoutes.js
│   │   ├── gradesRoutes.js
│   │   ├── profileRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── fileUtils.js
│   └── server.js                   # App entry point
├── .env
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A PostgreSQL database (local or Supabase)
- A Cloudinary account (free tier works)

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the backend root:

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

> ⚠️ Never commit your `.env` file. Make sure it's in `.gitignore`.

### 3. Run the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:8000`.

---

## API Reference

All protected routes require this header:

```
Authorization: Bearer <your_jwt_token>
```

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user (default role: `student`) |
| POST | `/api/auth/login` | Public | Login and receive a JWT token |
| GET | `/api/auth/me` | Auth | Get current authenticated user |

### Users — `/api/users` _(Admin only)_

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | List all users (paginated, filterable by `role` / `search`) |
| GET | `/api/users/:id` | Get a specific user by ID |
| POST | `/api/users` | Create a new user |
| PUT | `/api/users/:id` | Update user details |
| DELETE | `/api/users/:id` | Delete a user (cannot delete self) |

### Courses — `/api/courses`

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/courses` | All | List courses (paginated + search) |
| GET | `/api/courses/:id` | All | Get a single course |
| POST | `/api/courses` | Admin | Create a course |
| PUT | `/api/courses/:id` | Admin | Update a course |
| DELETE | `/api/courses/:id` | Admin | Delete a course |

### Enrolments — `/api/enrolments`

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/enrolments/my` | Student | Get my enrolled courses |
| GET | `/api/enrolments/stats` | Admin | Dashboard stats (total counts) |
| GET | `/api/enrolments` | Admin | All enrolments |
| POST | `/api/enrolments` | Admin | Enrol a student in a course |
| DELETE | `/api/enrolments/:id` | Admin | Remove an enrolment |

### Grades & Attendance — `/api`

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/grades/my` | Student | My grades with letter grade + remarks |
| GET | `/api/grades` | Admin | All grades (filter by `course_id` / `user_id`) |
| POST | `/api/grades` | Admin | Set or update a student grade |
| GET | `/api/attendance/my` | Student | My attendance records |
| GET | `/api/attendance` | Admin | Course attendance (filter by date) |
| POST | `/api/attendance` | Admin | Mark attendance for a session |

### Profile — `/api/profile`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/profile` | Get authenticated user's profile |
| PUT | `/api/profile` | Update name and email |
| PUT | `/api/profile/password` | Change password (requires current password) |

### Avatar — `/api/avatar`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/avatar` | Upload profile avatar (JPG, PNG, WEBP — max 2MB) |
| DELETE | `/api/avatar` | Remove avatar (also deletes from Cloudinary) |

### Dashboard — `/api/dashboard` _(Admin only)_

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/charts` | Enrolments by month, grade distribution, top 5 courses, attendance summary |

---

## Grading Scale

| Score | Grade |
|---|---|
| 70+ | A |
| 59 – 69 | B |
| 49 – 58 | C |
| 39 – 48 | D |
| Below 39 | F |

---

## Roles & Permissions

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

> Public registration is locked to the `student` role. Admin accounts must be created by an existing admin.

---

## Security

- JWT tokens expire after `1d` (configurable via `JWT_EXPIRES_IN`)
- Passwords hashed with bcryptjs (10 salt rounds)
- CORS restricted to `FRONTEND_URL`
- Helmet sets secure HTTP response headers
- Admins cannot delete their own account

---

## Deployment

The project is configured for **Render** with a **Supabase** PostgreSQL database.

- Set `NODE_ENV=production` in your hosting environment
- The DB pool automatically enables SSL in production
- Avatars are stored on Cloudinary — no local disk writes in production
- Ensure all `.env` variables are set in your hosting platform's config

---

## Scripts

```bash
npm run dev   # Start with nodemon (development)
npm start     # Start with node (production)
```

