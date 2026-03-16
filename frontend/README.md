# School Management System — Frontend

> React + Vite frontend for the School Management System. Supports Admin and Student roles with a responsive UI, dark mode, and animated page transitions.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| React Router v6 | Client-side routing |
| Axios | HTTP client (with JWT interceptor) |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Page transition animations |
| React Toastify | Toast notifications |
| Context API | Auth & theme global state |

---

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── API/
│   │   ├── api.js              # Axios instance + JWT interceptor
│   │   ├── authAPI.js          # login, register, getMe
│   │   ├── courseAPI.js        # course CRUD
│   │   ├── enrolmentAPI.js     # enrol, remove, stats
│   │   ├── gradesAPI.js        # grades + attendance
│   │   ├── profileAPI.js       # profile + password
│   │   └── userAPI.js          # user CRUD (admin)
│   ├── assets/
│   ├── components/
│   │   ├── AdminLayout.jsx         # Navbar + Sidebar shell for admin pages
│   │   ├── AvatarUpload.jsx
│   │   ├── Breadcrumb.jsx
│   │   ├── ConfirmModal.jsx
│   │   ├── DataTable.jsx
│   │   ├── EmptyState.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Modal.jsx
│   │   ├── NavBar.jsx
│   │   ├── PageTransition.jsx
│   │   ├── Pagination.jsx
│   │   ├── PasswordStrength.jsx
│   │   ├── ProtectedRoute.jsx      # Auth + role guards
│   │   ├── SearchBar.jsx
│   │   ├── SideBar.jsx
│   │   ├── Skeleton.jsx
│   │   └── Tooltip.jsx
│   ├── context/
│   │   ├── AuthContext.jsx         # Auth state (user, token, login, logout)
│   │   └── ThemeContext.jsx        # Dark / light mode toggle
│   ├── hooks/
│   │   ├── UseCountUp.jsx          # Animated number counter
│   │   └── UseVisible.jsx          # Intersection observer hook
│   ├── pages/
│   │   ├── Admin/
│   │   │   ├── DashBoard/
│   │   │   │   ├── AttendanceChart.jsx
│   │   │   │   ├── EnrolmentChart.jsx
│   │   │   │   ├── GradeChart.jsx
│   │   │   │   ├── QuickActions.jsx
│   │   │   │   ├── StatCard.jsx
│   │   │   │   ├── StatsGrid.jsx
│   │   │   │   ├── TopCoursesChart.jsx
│   │   │   │   └── WelcomeBanner.jsx
│   │   │   ├── Attendance.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Enrolment.jsx
│   │   │   ├── Grades.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Students.jsx
│   │   ├── HomePage/
│   │   │   ├── CTASection.jsx
│   │   │   ├── FeatureCard.jsx
│   │   │   ├── FeaturesSection.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── HomeNavbar.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── StatsSection.jsx
│   │   │   └── Testimonials.jsx
│   │   ├── Students/
│   │   │   └── MyCourses.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   └── Register.jsx
│   ├── App.jsx                 # Animated route definitions
│   ├── index.css               # Tailwind base + custom component classes
│   └── main.jsx                # App entry point + providers
├── .env
├── index.html
├── package.json
├── tailwind.config.js
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- Backend API running (see `/backend/README.md`)

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:8000/api
```

For production, point this to your deployed backend URL:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

### 3. Run the Dev Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Pages & Routes

| Path | Role | Page |
|---|---|---|
| `/` | Public | Landing / HomePage |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/admin/dashboard` | Admin | Dashboard with charts & stats |
| `/admin/students` | Admin | Manage students |
| `/admin/courses` | Admin | Manage courses |
| `/admin/enrolment` | Admin | Manage enrolments |
| `/admin/grades` | Admin | Manage grades |
| `/admin/attendance` | Admin | Manage attendance |
| `/my-courses` | Student | View enrolled courses |
| `/profile` | All (auth) | View & edit profile |
| `*` | Public | 404 Not Found |

---

## Route Protection

Two route guard components live in `components/ProtectedRoute.jsx`:

- **`<ProtectedRoute>`** — requires any authenticated user. Redirects to `/login` if no token.
- **`<RoleRoute role="admin">`** — requires a specific role. Redirects unauthorized users.

```jsx
// Any logged-in user
<ProtectedRoute><Profile /></ProtectedRoute>

// Admin only
<RoleRoute role="admin"><Dashboard /></RoleRoute>

// Student only
<RoleRoute role="student"><MyCourses /></RoleRoute>
```

---

## API Layer

All API calls go through `src/API/api.js` — an Axios instance that:

- Points to `VITE_API_URL` as the base URL
- Automatically attaches the JWT token from `localStorage` to every request via a request interceptor

Each module maps to a backend resource:

| File | Covers |
|---|---|
| `authAPI.js` | login, register, getMe |
| `courseAPI.js` | course CRUD |
| `enrolmentAPI.js` | enrol, remove, stats, my courses |
| `gradesAPI.js` | grades + attendance |
| `profileAPI.js` | profile info + password change |
| `userAPI.js` | admin user management |

---

## Global State (Context)

| Context | File | What it provides |
|---|---|---|
| `AuthContext` | `context/AuthContext.jsx` | `user`, `token`, `login()`, `logout()` |
| `ThemeContext` | `context/ThemeContext.jsx` | `theme`, `toggleTheme()` (dark / light) |

Both are wrapped at the root level in `main.jsx`, so they're available everywhere in the app.

---

## Styling

Tailwind CSS is used throughout. Custom reusable classes are defined in `index.css` under `@layer components`:

| Class | Description |
|---|---|
| `.btn-primary` | Blue primary button |
| `.btn-secondary` | Gray secondary button (dark mode aware) |
| `.btn-danger` | Red destructive button |
| `.input` | Styled form input (dark mode aware) |
| `.card` | White rounded card with shadow (dark mode aware) |

---

## Dark Mode

Theme is toggled via `ThemeContext` and persisted in `localStorage`. The Tailwind `dark:` variant is used throughout components. The `<html>` element receives the `dark` class when dark mode is active.

---

## Scripts

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Production build → /dist
npm run preview  # Preview production build locally
```

---

## Deployment

The frontend is deployed on **Vercel**.

- Set `VITE_API_URL` in your Vercel project's environment variables
- The build output is the `/dist` folder (`npm run build`)
- Vercel auto-deploys on push to the main branch