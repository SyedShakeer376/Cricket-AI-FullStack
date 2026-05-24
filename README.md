# 🏏 Cricket AI Platform — Full Stack (React + Node + MySQL)

## 📁 Project Structure

```
cricket-ai-fullstack/
├── backend/                  ← Node.js + Express API
│   ├── src/
│   │   ├── server.js         ← Entry point
│   │   ├── config/db.js      ← MySQL connection pool
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   ├── middleware/
│   │   │   └── auth.js       ← JWT verification
│   │   └── routes/
│   │       └── authRoutes.js
│   ├── setup.sql             ← Run this to create DB & tables
│   ├── .env                  ← Your config (DB password, JWT secret)
│   └── package.json
│
└── frontend/                 ← React + Vite app
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── utils/
    │   │   ├── api.js         ← All fetch calls to backend
    │   │   └── AuthContext.jsx← Global user state
    │   └── components/
    │       └── AuthScreen.jsx ← Connected to real backend
    └── package.json
```

---

## ⚙️ SETUP STEPS (do these in order)

---

### STEP 1 — MySQL Setup

Make sure MySQL is installed. Then open MySQL shell and run:

```bash
mysql -u root -p < backend/setup.sql
```

This creates the `cricket_ai` database and `users` table automatically.

**Default admin account created:**
- Email: `admin@cricketai.com`
- Password: `Admin@123`

---

### STEP 2 — Configure Backend

Open `backend/.env` and fill in your MySQL password:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=cricket_ai
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

---

### STEP 3 — Start Backend

```bash
cd backend
npm install
npm run dev
```

You should see:
```
✅ MySQL connected successfully
🚀 Server running on http://localhost:5000
```

Test it: http://localhost:5000/api/health

---

### STEP 4 — Start Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Open: **http://localhost:5173**

---

## 🔐 API Endpoints

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/api/auth/register` | ❌ | Create new account |
| POST | `/api/auth/login`    | ❌ | Login, returns JWT |
| GET  | `/api/auth/me`       | ✅ | Get current user info |
| PUT  | `/api/auth/profile`  | ✅ | Update display name |
| PUT  | `/api/auth/change-password` | ✅ | Change password |

Send JWT token in header:
```
Authorization: Bearer <token>
```

---

## 🗄️ Database Tables

**users**
| Column | Type | Notes |
|--------|------|-------|
| id | INT AUTO_INCREMENT | Primary key |
| name | VARCHAR(100) | Display name |
| email | VARCHAR(150) UNIQUE | Login email |
| password_hash | VARCHAR(255) | bcrypt hash |
| role | ENUM | Admin / Analyst / Viewer |
| is_active | BOOLEAN | Soft disable accounts |
| created_at | TIMESTAMP | |
| last_login | TIMESTAMP | Updated on each login |

**login_history**
| Column | Type | Notes |
|--------|------|-------|
| id | INT | |
| user_id | INT | FK → users.id |
| ip_address | VARCHAR | Client IP |
| logged_in_at | TIMESTAMP | |

---

## 🛠 Common Issues

**MySQL connection error?**
- Check `DB_PASSWORD` in `.env`
- Make sure MySQL service is running: `net start mysql` (Windows)

**CORS error in browser?**
- Make sure `CLIENT_URL=http://localhost:5173` in backend `.env`
- Make sure both frontend and backend are running

**Port already in use?**
- Change `PORT=5001` in backend `.env` and update `api.js` `API_BASE` to match
