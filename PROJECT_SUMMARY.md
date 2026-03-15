# Citizen Grievance Redressal System (CGRS) - Project Summary

**Project Type:** Full-Stack Web Application  
**Technology Stack:** MERN (MongoDB, Express, React, Node.js)  
**Frontend Framework:** React + Vite + Tailwind CSS  
**Backend Framework:** Express.js  
**Database:** MongoDB with Mongoose ODM  
**Build Tool:** Vite  
**Styling:** Tailwind CSS with PostCSS  
**Authentication:** JWT (JSON Web Tokens)  

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Core Functionalities](#core-functionalities)
3. [User Roles & Workflows](#user-roles--workflows)
4. [System Architecture](#system-architecture)
5. [Database Models](#database-models)
6. [API Endpoints](#api-endpoints)
7. [Frontend Pages & Components](#frontend-pages--components)
8. [Email Notification System](#email-notification-system)
9. [Security Features](#security-features)
10. [Technology Stack Details](#technology-stack-details)

---

## 🎯 Project Overview

The Citizen Grievance Redressal System (CGRS) is a platform that enables citizens to file complaints and grievances, which are then managed and resolved by government authorities. The system facilitates communication between citizens and authorities, tracks complaint status, and ensures transparent grievance management.

**Key Objectives:**
- Allow citizens to file complaints with detailed information and attachments
- Route complaints to appropriate government departments
- Enable authorities to track, update, and resolve complaints
- Provide email notifications for all complaint activities
- Detect and prevent duplicate complaints
- Allow citizens to upvote relevant complaints
- Maintain detailed audit trails of all complaint interactions

---

## ✨ Core Functionalities

### 1. **User Authentication & Authorization**
- **Citizen Registration:** Users can create new citizen accounts via email validation
- **Authority Login:** Pre-configured authorities can log in with department credentials
- **Session Management:** JWT tokens stored in localStorage for persistent login
- **Role-Based Access Control:** Different features available based on user role (citizen vs authority)

### 2. **Complaint Management**
- **Create Complaints:** Citizens can file new complaints with:
  - Title and detailed description
  - Location information (autocomplete support)
  - Department selection (General, Infrastructure, Health, etc.)
  - Photo attachments (up to 3 photos)
  
- **View Complaints:**
  - Citizens can view their own complaints
  - Citizens can browse all public complaints
  - Authorities can see complaints relevant to their department + General complaints
  
- **Update Complaints:**
  - Authorities can update complaint status (Submitted, In Progress, On Hold, Resolved, Reopened, Rejected)
  - Authorities can add comments/notes to complaints
  - Citizens can reopen resolved complaints if needed
  
- **Delete Complaints:**
  - Citizens can delete their own complaints before resolution

### 3. **Complaint Status Tracking**
- **Status States:** Submitted → In Progress → On Hold → Resolved → Reopened → Rejected
- **Timeline Tracking:** Complaints are tracked with creation and resolution timestamps
- **Authority Comments:** Authorities can leave comments on complaints for citizen visibility
- **Status Transitions:** Proper validation of status changes

### 4. **Duplicate Detection & Prevention**
- **Smart Detection:** System checks for similar complaints based on:
  - Keywords in title
  - Location
  - Department
  - Status (excluding resolved/rejected)
  
- **User Choice:** If duplicates are found, user can:
  - View similar complaints
  - Upvote existing complaint instead of creating duplicate
  - Submit anyway (if genuinely different issue)

### 5. **Upvote & Community Engagement**
- Users can upvote complaints (except their own)
- Upvotes indicate grievance severity/frequency
- Complaints sorted by upvote count
- Prevents duplicate upvotes from same user

### 6. **Email Notifications**
- Automated email alerts on:
  - New complaint filing (admins notified)
  - Status updates (citizens notified)
  - Authority comments (citizens notified)
  - Complaint reopening (admins notified)
  
- Email logs stored in Notification database
- Demo email inbox for testing (@cgrs.in emails redirect to DEMO_EMAIL)

### 7. **Dashboard & Filtering**
- **Citizen Dashboard:** 
  - View all personal complaints
  - Sort by upvotes
  - Filter by status
  
- **Authority Dashboard:**
  - View complaints for their department + General complaints
  - Filter by status and area
  - Sort by date/priority
  - Pagination support
  - Quick Status + Comment update interface

### 8. **Location Autocomplete**
- Google Places API integration
- Autocomplete suggestions for location input
- Schema validation for location fields

---

## 👥 User Roles & Workflows

### **Citizen Workflow**

```
1. Registration
   ↓
2. Login (via email + password)
   ↓
3. Dashboard - View My Complaints
   ├─ Create New Complaint
   │  ├─ Fill complaint details (title, desc, location, department)
   │  ├─ Check for duplicates
   │  ├─ Upload photos (optional)
   │  └─ Submit → Email notification sent to authorities
   │
   ├─ View Complaint Details
   │  ├─ See authority comments
   │  ├─ Monitor status changes
   │  └─ Receive email notifications on updates
   │
   ├─ Upvote Complaints (in "All Complaints" view)
   │  └─ Signal importance/frequency of issue
   │
   └─ Reopen Resolved Complaint
      └─ If complaint needs more work after resolution
      
4. Logout
```

### **Authority Workflow**

```
1. Login (pre-configured authority account)
   ↓
2. Dashboard - View Assigned Complaints
   ├─ See complaints for their department + General complaints
   ├─ Filter by status/area/sort preference
   │
   ├─ Click on Complaint → Full View
   │  ├─ See citizen details & complaint info
   │  ├─ View history of comments
   │  └─ Receive email notification of filing
   │
   ├─ Update Complaint Status
   │  ├─ Change status (Submitted → In Progress → On Hold → Resolved)
   │  ├─ Add comments for citizen
   │  └─ Email sent to citizen on updates
   │
   └─ Handle Pagination
      └─ Navigate between complaint pages

3. Logout
```

---

## 🏗️ System Architecture

### **Backend Architecture**

```
server.js (Entry Point)
├─ Security Middleware
│  ├─ Helmet (Security headers)
│  ├─ CORS (Cross-origin requests)
│  ├─ Rate Limiting (100 requests/15min)
│  └─ Request Size Limiting (10KB limit)
│
├─ Database Connection
│  └─ MongoDB via Mongoose
│
├─ Routes
│  ├─ /api/auth → authRoutes.js
│  │  ├─ POST /register
│  │  └─ POST /login
│  │
│  └─ /api/complaints → complaintRoutes.js
│     ├─ POST /
│     ├─ GET /
│     ├─ GET /:id
│     ├─ GET /my
│     ├─ GET /all
│     ├─ POST /check-duplicate
│     ├─ POST /:id/upvote
│     ├─ PUT /:id/status
│     ├─ PUT /:id/reopen
│     └─ DELETE /:id
│
├─ Middleware
│  ├─ authMiddleware.js (JWT verification)
│  └─ roleMiddleware.js (Role-based authorization)
│
├─ Models
│  ├─ User.js (Citizens & Authorities)
│  ├─ Complaint.js (Grievance records)
│  └─ Notification.js (Email logs)
│
├─ Utils
│  ├─ emailService.js (Nodemailer SMTP)
│  └─ config/db.js (MongoDB connection)
│
└─ Error Handling (Global error handler)
```

### **Frontend Architecture**

```
App.jsx (Main Router)
├─ Navbar Component
│
├─ Public Routes
│  ├─ /login → Login.jsx
│  └─ /register → Register.jsx
│
├─ Protected Routes (Citizen)
│  ├─ /new → NewComplaint.jsx
│  ├─ /my → MyComplaints.jsx
│  └─ /all → AllComplaints.jsx
│
├─ Protected Routes (Authority)
│  └─ /authority → AuthorityDashboard.jsx
│
├─ Shared Routes
│  └─ /complaint/:id → FullComplaintView.jsx
│
└─ Components
   ├─ Navbar.jsx (Navigation & Logout)
   ├─ Autocomplete.jsx (Location input)
   ├─ DuplicateModal.jsx (Duplicate complaint warning)
   └─ Utils/constants.js (Department list, API base URL)
```

---

## 📊 Database Models

### **User Model**
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  passwordHash: String (required),
  role: String (enum: "citizen" | "authority", default: "citizen"),
  department: String (only for authorities),
  createdAt: Date
}
```

### **Complaint Model**
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  locationText: String (required),
  department: String (required),
  photos: [String], // File paths of uploaded images
  status: String (enum: ["Submitted", "In Progress", "On Hold", "Resolved", "Reopened", "Rejected"]),
  authorId: ObjectId (ref: User),
  upvotes: Number (default: 0),
  upvoters: [ObjectId] (ref: User),
  authorityComments: [{
    by: ObjectId (ref: User),
    comment: String,
    createdAt: Date
  }],
  resolvedAt: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto),
  
  // Indexes for performance:
  // - department
  // - status
  // - locationText
  // - createdAt (descending)
  // - upvotes (descending)
  // - compound: (department, locationText, status)
}
```

### **Notification Model**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  email: String (required),
  subject: String,
  type: String (enum: ["NEW_COMPLAINT", "STATUS_UPDATE", "COMMENT", "REOPENED"]),
  complaintId: ObjectId (ref: Complaint),
  sentAt: Date (default: now)
}
```

---

## 🔌 API Endpoints

### **Authentication Routes** (`/api/auth`)

#### `POST /register`
- **Purpose:** Register new citizen account
- **Body:** `{ name, email, password }`
- **Returns:** Success message
- **Validation:** Email domain whitelist (gmail.com, yahoo.com, outlook.com, etc.)

#### `POST /login`
- **Purpose:** Authenticate user and return JWT token
- **Body:** `{ email, password }`
- **Returns:** `{ token, role, name, department, id }`
- **Validation:** Email domain whitelist

---

### **Complaint Routes** (`/api/complaints`)

#### `POST /`
- **Purpose:** Create new complaint
- **Auth:** JWT required
- **Body:** FormData with `{ title, description, locationText, department, photos[] }`
- **Returns:** New complaint object
- **Side Effect:** Sends email notification to authorities

#### `GET /my`
- **Purpose:** Get citizen's own complaints
- **Auth:** JWT required
- **Params:** None
- **Returns:** Array of complaints sorted by upvotes

#### `GET /all`
- **Purpose:** Browse all public complaints
- **Auth:** JWT required
- **Params:** None
- **Returns:** Array of all complaints sorted by upvotes

#### `GET /`
- **Purpose:** Authority dashboard - get assigned complaints
- **Auth:** JWT required + Authority role
- **Params:** `{ status?, area?, sort?, page?, limit? }`
- **Returns:** `{ complaints: [], totalPages: number }`
- **Filtering:** Shows complaints for user's department + General

#### `GET /:id`
- **Purpose:** Get single complaint details
- **Auth:** JWT required
- **Params:** complaint ID
- **Returns:** Complaint object with populated author & comments
- **Authorization:** Author OR relevant authority

#### `POST /check-duplicate`
- **Purpose:** Check for similar existing complaints
- **Auth:** JWT required
- **Body:** `{ title, locationText, department }`
- **Returns:** `{ duplicate: boolean, similarComplaints?: [] }`

#### `POST /:id/upvote`
- **Purpose:** Upvote a complaint
- **Auth:** JWT required
- **Restrictions:** Cannot upvote own complaint, cannot upvote twice
- **Returns:** Updated complaint

#### `PUT /:id/status`
- **Purpose:** Update complaint status and/or add comment
- **Auth:** JWT required + Authority role
- **Body:** `{ status?, comment? }`
- **Returns:** Updated complaint
- **Side Effect:** Sends email notifications to citizen

#### `PUT /:id/reopen`
- **Purpose:** Reopen a resolved complaint
- **Auth:** JWT required + Citizen role
- **Restrictions:** Only resolved complaints can be reopened
- **Returns:** `{ message, complaint }`
- **Side Effect:** Sends email notification to authorities

#### `DELETE /:id`
- **Purpose:** Delete complaint
- **Auth:** JWT required + Citizen role
- **Restrictions:** Can only delete own complaints
- **Returns:** Success message
- **Side Effect:** Sends email to authorities

---

## 🖥️ Frontend Pages & Components

### **Pages**

#### **Login.jsx**
- **Purpose:** User authentication entry point
- **Features:**
  - Email and password input
  - Email domain validation
  - Role-based redirect (Citizen → /my, Authority → /authority)
  - Loading state during submission
  - Link to registration page

#### **Register.jsx**
- **Purpose:** Citizen account creation
- **Features:**
  - Name, email, password input
  - Email domain validation
  - Password hashing (backend bcrypt)
  - Duplicate email check
  - Link back to login

#### **NewComplaint.jsx**
- **Purpose:** File new complaint
- **Features:**
  - Title, description, location, department fields
  - Photo upload (up to 3 files)
  - Duplicate detection before submission
  - Modal showing duplicate complaints
  - Option to upvote existing or submit anyway
  - Auto-expanding textarea
  - Success confirmation with redirect to /my
  - Form validation

#### **MyComplaints.jsx**
- **Purpose:** Citizen's personal complaint dashboard
- **Features:**
  - List of all citizen's complaints
  - Sort by upvotes/date
  - Filter by status
  - Click to view full details
  - Quick delete option
  - Pagination support

#### **AllComplaints.jsx**
- **Purpose:** Browse all public complaints
- **Features:**
  - List all complaints system-wide
  - Sort by upvotes/date
  - Filter by status/department
  - Upvote button (cannot self-vote)
  - Click to view full details
  - Pagination

#### **AuthorityDashboard.jsx**
- **Purpose:** Authority complaint management interface
- **Features:**
  - View complaints for their department + General
  - Filter by status, area
  - Sort options (date, priority)
  - Pagination (6 complaints per page)
  - Click complaint to view/update
  - Inline status + comment update form
  - Form submission with loading states
  - Real-time list refresh after updates

#### **FullComplaintView.jsx**
- **Purpose:** Detailed complaint view
- **Features:**
  - Complaint title, description, location, photos
  - Citizen profile info
  - Department and status display
  - All authority comments with timestamps
  - Photo gallery/slider
  - Authorization checks (author or relevant authority only)
  - Back button to return to dashboard

### **Components**

#### **Navbar.jsx**
- **Purpose:** Navigation bar for all pages
- **Features:**
  - Logo/title
  - Navigation links (context-aware for citizen vs authority)
  - User name display (from localStorage)
  - Logout button with localStorage cleanup
  - Responsive menu

#### **Autocomplete.jsx**
- **Purpose:** Location input with Google Places autocomplete
- **Features:**
  - Google Places API integration
  - Dropdown suggestions as user types
  - Select suggestion to populate field
  - Validation for required selections
  - Schema for location validation

#### **DuplicateModal.jsx**
- **Purpose:** Modal dialog for duplicate complaint warning
- **Features:**
  - Display similar complaints list
  - Show upvote count for each
  - Upvote existing button
  - Submit anyway button
  - Close/cancel option

---

## 📧 Email Notification System

### **Overview**
The system sends automated emails via Nodemailer with Gmail SMTP for all grievance activities.

### **Email Types**

#### 1. **NEW_COMPLAINT**
- **Trigger:** When citizen files new complaint
- **Recipients:** Authorities in relevant department + General authorities
- **Subject:** "New Complaint Filed"
- **Content:** Complaint title, location, department
- **Action:** Prompt to login and review

#### 2. **STATUS_UPDATE**
- **Trigger:** When authority updates complaint status
- **Recipients:** Citizen who filed complaint
- **Subject:** "Complaint Status Updated"
- **Content:** Complaint title, new status
- **Action:** Notify of progress

#### 3. **COMMENT**
- **Trigger:** When authority adds comment to complaint
- **Recipients:** Citizen who filed complaint
- **Subject:** "New Comment on Your Complaint"
- **Content:** Complaint title, authority's comment
- **Action:** Inform of feedback

#### 4. **REOPENED**
- **Trigger:** When citizen reopens resolved complaint
- **Recipients:** Authorities in relevant department
- **Subject:** "Complaint Reopened"
- **Content:** Complaint title, location, department
- **Action:** Notify for further investigation

### **Email Configuration**
- **Service:** Gmail SMTP (smtp.gmail.com:587)
- **From Address:** citygrievanceportal@gmail.com
- **Credentials:** Stored in `.env` file (EMAIL_USER, EMAIL_PASS)
- **Demo Mode:** @cgrs.in emails redirect to DEMO_EMAIL for testing
- **Logging:** All sent emails logged to Notification collection

### **Email Templates**
All emails use HTML formatting with:
- Styled containers
- Clear subject lines
- Action-oriented messaging
- System branding
- Professional layout

---

## 🔒 Security Features

### **1. Authentication**
- JWT tokens for stateless authentication
- Bcrypt password hashing (10 rounds)
- Token stored in localStorage (client-side)
- Expiration managed in middleware

### **2. Authorization**
- Role-based access control (citizen vs authority)
- Department-specific complaint filtering for authorities
- Ownership validation (citizens can only delete own complaints)
- Activity validation (only authorities update status)

### **3. Data Protection**
- HTTPS headers via Helmet middleware
- CORS configuration (localhost/configurable origin)
- Rate limiting (100 requests per 15 minutes per IP)
- Request size limiting (10KB max payload)

### **4. Input Validation**
- Email domain whitelist
- Required field validation
- Enum validation for status/role/type
- FormData validation for file uploads
- Sanitization of user inputs

### **5. Error Handling**
- Global error handler prevents information leakage
- Specific error messages for debugging (dev)
- Generic messages for users (prod)
- Try-catch blocks around database operations

---

## 🛠️ Technology Stack Details

### **Backend**

| Package | Version | Purpose |
|---------|---------|---------|
| express | 5.1.0 | Web framework |
| mongoose | 8.19.3 | MongoDB ODM |
| jsonwebtoken | 9.0.2 | JWT authentication |
| bcrypt | 6.0.0 | Password hashing |
| dotenv | 17.2.3 | Environment variables |
| nodemailer | 8.0.2 | Email sending |
| multer | 2.0.2 | File upload handling |
| helmet | 8.1.0 | Security headers |
| cors | 2.8.5 | Cross-origin requests |
| express-rate-limit | 8.2.1 | Rate limiting |
| resend | 6.9.3 | Alternative email service |

**Dev Dependencies:**
- nodemon (3.1.14) - Auto-restart on file changes

---

### **Frontend**

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.2.0 | UI framework |
| react-dom | 19.2.0 | React rendering |
| react-router-dom | 7.9.5 | Client-side routing |
| axios | 1.13.2 | HTTP client |
| @react-google-maps/api | 2.20.7 | Google Maps integration |
| use-places-autocomplete | 4.0.1 | Google Places autocomplete |
| tailwindcss | 3.4.18 | Utility-first CSS |
| postcss | 8.5.6 | CSS processing |
| autoprefixer | 10.4.22 | CSS vendor prefixes |
| vite | 7.2.2 (rolldown-vite) | Build tool |

**Dev Dependencies:**
- eslint (9.39.1) - Code linting
- Various eslint plugins for React

---

### **Database**

- **MongoDB** - NoSQL document database
- **Mongoose** - Object-Document Mapper (ODM)
- **Collections:**
  - users (citizen + authority accounts)
  - complaints (grievance records)
  - notifications (email logs)

### **Environment Variables** (`.env`)
```
PORT=5000
MONGO_URI=mongodb://...
JWT_SECRET=your-secret-key
EMAIL_USER=citygrievanceportal@gmail.com
EMAIL_PASS=app-specific-password
DEMO_EMAIL=citygrievanceportal@gmail.com
CLIENT_URL=http://localhost:5173
GOOGLE_MAPS_API_KEY=your-api-key
```

---

## 📈 Data Flow

### **Complaint Creation Flow**
```
Citizen fills form
       ↓
Frontend validates input
       ↓
Check for duplicates (server)
       ↓
If duplicates found → Show modal
  └─ User can: upvote existing OR submit anyway
       ↓
Upload photos to server
       ↓
Create complaint in MongoDB
       ↓
Send email to authorities
       ↓
Redirect to /my (MyComplaints page)
```

### **Status Update Flow**
```
Authority selects complaint
       ↓
Opens FullComplaintView
       ↓
Changes status + adds comment
       ↓
Frontend sends PUT request
       ↓
Backend validates authorization
       ↓
Update complaint in MongoDB
       ↓
Send email to citizen
       ↓
Update local state → UI reflects change
```

### **Complaint Discovery Flow**
```
Citizen logs in
       ↓
Can view:
  ├─ /my → Personal complaints
  ├─ /all → All public complaints
  └─ Click any complaint → FullComplaintView
       ↓
For General complaints:
  └─ All citizens + all authorities can view
       ↓
For Department complaints:
  ├─ Citizen author can view
  ├─ Relevant authority can view
  └─ Others get 403 (forbidden)
```

---

## 🚀 Key Features Summary

| Feature | Citizen | Authority | Status |
|---------|---------|-----------|--------|
| Create Complaint | ✅ | ❌ | Active |
| File Attachments | ✅ | ❌ | Active |
| View Own Complaints | ✅ | - | Active |
| View Public Complaints | ✅ | - | Active |
| Upvote Complaints | ✅ | - | Active |
| Duplicate Detection | ✅ | - | Active |
| Reopen Resolved | ✅ | ❌ | Active |
| Delete Own Complaint | ✅ | ❌ | Active |
| View Department Complaints | ❌ | ✅ | Active |
| Update Status | ❌ | ✅ | Active |
| Add Comments | ❌ | ✅ | Active |
| Email Notifications | ✅ | ✅ | Active |
| Filter & Sort | ✅ | ✅ | Active |
| Pagination | ✅ | ✅ | Active |
| Role-Based Access | ✅ | ✅ | Active |

---

## 📝 Notes for Developers

1. **Authentication:** All protected routes require JWT token in `Authorization: Bearer <token>` header
2. **File Uploads:** Photos stored in `/backend/uploads` directory; paths saved in complaint.photos array
3. **Email Testing:** Use @cgrs.in emails for testing; they auto-redirect to DEMO_EMAIL
4. **Database Indexes:** Compound indexes for performance on duplicate detection (dept + location + status)
5. **Rate Limiting:** 100 requests per 15 minutes per IP address
6. **CORS:** Configured for localhost:5173 (frontend); update CLIENT_URL for production
7. **Photo Gallery:** Frontend FullComplaintView supports multiple photo display with carousel
8. **Pagination:** Authority dashboard supports 6 complaints per page

---

## 🔄 Workflow Diagrams

### **System Workflow Overview**
```
┌─────────────────────────────────────────────────────────┐
│              CITIZEN GRIEVANCE PORTAL                    │
└─────────────────────────────────────────────────────────┘

┌────────────────┐                    ┌────────────────┐
│    CITIZEN     │                    │   AUTHORITY    │
├────────────────┤                    ├────────────────┤
│ • Register     │                    │ • View Dept    │
│ • Login        │                    │   Complaints   │
│ • Create       │◄──────────────────►│ • Update       │
│   Complaint    │   Email Notify     │   Status       │
│ • Upload Photos│                    │ • Add Comments │
│ • View Status  │                    │ • Send Emails  │
│ • Upvote       │                    │                │
│ • Reopen       │                    │                │
└────────────────┘                    └────────────────┘
         │
         │ Complaint Data
         ↓
    ┌─────────────┐
    │  MONGODB    │
    ├─────────────┤
    │ • Users     │
    │ • Complaints│
    │ • Notif     │
    └─────────────┘
         │
         ↓ Alerts
    ┌─────────────┐
    │Email Service│ (Nodemailer)
    └─────────────┘
```

---

## 📞 Support & Troubleshooting

### **Common Issues**
1. **Emails not sending:** Check .env credentials and DEMO_EMAIL configuration
2. **Complaints not appearing:** Verify department assignment and user role
3. **Duplicate detection not working:** Ensure compound index exists on Complaint model
4. **Photos not uploading:** Check multer configuration and /uploads folder permissions
5. **JWT errors:** Verify token format in Authorization header

### **Development Commands**
```bash
# Backend
npm run dev          # Start with nodemon
npm start            # Direct start

# Frontend
npm run dev          # Vite dev server
npm run build        # Production build
npm run preview      # Preview prod build
npm run lint         # ESLint check
```

---

**Document Generated:** March 15, 2026  
**Last Updated:** Current Session  
**Version:** 1.0
