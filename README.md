# Clinic Management System

A full-stack web application for managing clinic operations, built with React + Node.js + MongoDB. Supports patient records, medication catalog, and visit prescriptions with a Vietnamese-localized interface.

---

## Features

- **Patient Management** — Create, edit, and delete patient profiles (name, DOB, gender, address, phone, national ID)
- **Medication Catalog** — Manage medications with name and effects description, with search support
- **Visit & Prescription Tracking** — Record diagnoses and prescriptions per visit, view full visit history
- **Vietnamese Name Autocomplete** — Smart suggestions from 400+ common Vietnamese surnames, middle names, and first names
- **Prescription Notifications** — Toast notifications in the bottom-right corner when creating or updating records
- **Responsive UI** — Works on both desktop and mobile

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, React Router 7, Tailwind CSS 4, Vite |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas (Mongoose 8) |
| HTTP Client | Axios |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone https://github.com/huukhang2423/Clinic-Management-System.git
cd Clinic-Management-System
```

### 2. Configure environment variables

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/phongkham?retryWrites=true&w=majority
```

### 3. Install dependencies

```bash
npm run install:all
```

Or install separately:

```bash
cd server && npm install
cd client && npm install
```

### 4. Run in development mode

```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 5. Build for production

```bash
npm run build   # Build React app to client/dist
npm start       # Start server (serves both API and static files)
```

---

## API Endpoints

### Patients

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | List all patients (supports `?search=`) |
| GET | `/api/patients/:id` | Get patient details |
| POST | `/api/patients` | Create new patient |
| PUT | `/api/patients/:id` | Update patient info |
| DELETE | `/api/patients/:id` | Delete patient |
| POST | `/api/patients/:id/visits` | Add a visit to patient |

### Medications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/medications` | List all medications (supports `?search=`) |
| GET | `/api/medications/:id` | Get medication details |
| POST | `/api/medications` | Create new medication |
| PUT | `/api/medications/:id` | Update medication |
| DELETE | `/api/medications/:id` | Delete medication |

---

## Project Structure

```
phongkham_final/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Route pages
│   │   ├── services/        # API calls (Axios)
│   │   ├── context/         # React Context (notifications)
│   │   ├── hooks/           # Custom hooks
│   │   └── utils/           # Helper utilities
│   └── vite.config.js
└── server/                  # Express backend
    └── src/
        ├── models/          # Mongoose schemas
        ├── controllers/     # Business logic
        ├── routes/          # API routes
        ├── middleware/      # Express middleware
        └── config/          # DB & env config
```

---

## Client Routes

| Route | Page |
|-------|------|
| `/` | Dashboard |
| `/benh-nhan` | Patient list |
| `/benh-nhan/tao-moi` | Create new patient |
| `/benh-nhan/:id` | Patient detail & visit history |
| `/benh-nhan/chinh-sua/:id` | Edit patient |
| `/thuoc` | Medication list |
| `/thuoc/tao-moi` | Add new medication |
| `/thuoc/chinh-sua/:id` | Edit medication |
