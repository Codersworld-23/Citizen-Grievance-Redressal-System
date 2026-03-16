# Citizen Grievance Redressal System (CGRS)

A focused, production-ready grievance redressal platform built with the MERN stack. This README is aligned with the project's Project Summary and contains actionable setup instructions, architecture notes, API references, and visual placeholders.

Table of Contents
- Project overview
- Key features
- Tech stack
- Quick start
- Environment variables
- API reference (core)
- Architecture
- Screenshots (existing + placeholders)
- Email notifications
- Contributing & Maintainers

---

## Project overview

The Citizen Grievance Redressal System enables citizens to file civic complaints (roads, sanitation, electricity, water, etc.) with photos and location, and allows authorities to triage, update, and resolve issues. The system supports duplicate detection, upvotes for prioritization, role-based access, and notification workflows.

Goals
- Reduce duplicate reports and consolidate citizen feedback
- Provide authorities with an easy triage dashboard
- Keep citizens informed through status updates and comments

---

## Key features

1. Authentication & roles
        - Citizen registration with email validation
        - Authority accounts with role-based access
        - JWT-based session handling

2. Complaint lifecycle
        - Submit complaints with title, description, department, location, and up to 3 photo attachments
        - Status workflow: Submitted → In Progress → On Hold → Resolved → Reopened → Rejected
        - Authorities can add remarks/comments and close complaints

3. Duplicate detection
        - Smart duplicate check based on title keywords, department and location
        - User-facing modal showing similar complaints before submission

4. Community engagement
        - Upvote complaints (prevents duplicate upvotes and self-upvotes)
        - Sorting by upvotes to improve prioritization

5. Location autocomplete
        - Google Places API integration for address suggestions

6. Media & email
        - Photo uploads (Multer) with preview
        - Email notifications for new complaints, status updates, comments, and reopens

7. Dashboards
        - Citizen dashboard (My Complaints)
        - Authority dashboard (department-wise filtering, quick actions)

---

## Tech stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express.js, Multer, JWT
- Database: MongoDB (Mongoose)
- Email: Nodemailer (Gmail SMTP configurable)
- Dev tools: Axios, ESLint, Vite

---

## Quick start

1. Clone

```bash
git clone https://github.com/Varyam20/Citizen-Grievance-Redressal-System.git
cd Citizen-Grievance-Redressal-System
```

2. Backend

```bash
cd backend
npm install
# create .env (see Environment variables below)
npm run dev
```

3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the app:

- Frontend: http://localhost:5173/
- Backend: http://localhost:5000/

---

## Environment variables

Create a `.env` file in `backend/` with at least:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=you@example.com
EMAIL_PASS=your_email_password
DEMO_EMAIL=your_demo_forwarding_email@example.com
```

On the frontend create `.env` in `frontend/`:

```env
VITE_API_URL=http://localhost:5000
```

Do not commit `.env` to source control.

---

## API reference (core)

Auth
- `POST /api/auth/register` — register { name, email, password }
- `POST /api/auth/login` — login returns `{ token, role, user }`

Complaints
- `POST /api/complaints` — submit complaint (FormData: title, description, department, locationText, photos[])
- `GET /api/complaints` — list public complaints (supports pagination & filters)
- `GET /api/complaints/my` — authenticated user's complaints
- `GET /api/complaints/:id` — single complaint details
- `POST /api/complaints/check-duplicate` — check duplicates before submit
- `POST /api/complaints/:id/upvote` — upvote complaint
- `PUT /api/complaints/:id/status` — authority updates status/comment
- `PUT /api/complaints/:id/reopen` — reopen resolved complaint
- `DELETE /api/complaints/:id` — delete own complaint

See `backend/routes/` for full route details and required auth/role middleware.

---

## Architecture

Backend responsibilities:
- `server.js`: express entry, middleware, routes
- `config/db.js`: Mongo connection
- `models/`: `User`, `Complaint`, `Notification`
- `utils/emailService.js`: email sending and templates
- `middleware/`: `authMiddleware.js`, `roleMiddleware.js`

Frontend responsibilities:
- Pages: `Login`, `Register`, `NewComplaint`, `MyComplaints`, `AllComplaints`, `AuthorityDashboard`, `FullComplaintView`
- Components: `Navbar`, `Autocomplete`, `DuplicateModal`

---

## Screenshots & image placeholders

The repository already contains screenshots in `frontend/public/screenshots/` — these will show on GitHub if committed. Add or replace images as needed. Below are a set of curated visuals: existing screenshots are used where available; placeholders remain where you should add new images.

- Home / Landing
       - ![Home](frontend/public/screenshots/home.png)

- Registration
       - ![Registration](frontend/public/screenshots/RegistrationPage.png)

- New Complaint (form + autocomplete + upload)
       - ![New Complaint](frontend/public/screenshots/newComplaints.png)

- Duplicate detection modal (add if not present)
       - ![Duplicate Modal](frontend/public/screenshots/placeholder-duplicate.png)

- My Complaints (user view)
       - ![My Complaints](frontend/public/screenshots/userViewComplaints.png)

- All Complaints / Filters
       - ![All Complaints](frontend/public/screenshots/allComplaintsUser.png)

- Authority Dashboard (department filters, upvotes)
       - ![Authority Dashboard](frontend/public/screenshots/authDashboard.png)

- Upvote interaction
       - ![Upvote](frontend/public/screenshots/upvoteUser.png)

- Address Autocomplete (add screenshot if desired)
       - ![Autocomplete Placeholder](frontend/public/screenshots/placeholder-autocomplete.png)

- Full complaint view (timeline & remarks) — add screenshot
       - ![Full Complaint View](frontend/public/screenshots/placeholder-fullview.png)

How to add screenshots

1. Place your image under `frontend/public/screenshots/` with one of the filenames above (or update the README paths).
2. Commit and push.

Example:

```bash
cp ~/Downloads/fullview.png frontend/public/screenshots/placeholder-fullview.png
git add frontend/public/screenshots/placeholder-fullview.png && git commit -m "Add full complaint view screenshot"
git push
```

---

## Email notifications

Types:
- NEW_COMPLAINT: notify authorities
- STATUS_UPDATE: notify citizen
- COMMENT: notify citizen
- REOPENED: notify authorities

Configuration is in `backend/utils/emailService.js`. Use `.env` EMAIL_* values for credentials and a test/demo forwarding address `DEMO_EMAIL` in development.

---

## Contributing & maintainers

To contribute:

1. Fork the repo
2. Create a feature branch
3. Open a PR with a clear description

---