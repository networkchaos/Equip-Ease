Here's a complete and well-structured `README.md` file you can use for your project. It explains how to set up and run everything — frontend, backend, and the PostgreSQL database — step-by-step.

---

# EquipEase: Equipment Rental Platform

EquipEase is a full-stack equipment rental platform built with:

* **Frontend**: React.js
* **Backend**: Node.js + Express
* **Database**: PostgreSQL

This guide will walk you through setting up the application on your local machine.

---

## 🗂 Project Structure

```
Tiiff_projo/
├── equip-ease-backend/       # Node.js + Express backend
├── equip-ease-frontend/      # React frontend
├── equip_ease.sql            # SQL file to set up the PostgreSQL database
└── README.md                 # You're here!
```

---

## 🛠 Prerequisites

Before running the project, ensure you have the following installed:

* [Node.js & npm](https://nodejs.org/)
* [PostgreSQL](https://www.postgresql.org/download/) (with pgAdmin)
* A code editor like [VS Code](https://code.visualstudio.com/)

---

## ⚙️ 1. Setting Up the Database

### Step 1: Launch pgAdmin

* Open **pgAdmin** and log in.

### Step 2: Create a New Database

* Name the database: `equip_ease`

### Step 3: Import the SQL File

* Open the `equip_ease.sql` file located at:
  `C:\Users\HP\Desktop\Tiiff_projo\equip_ease.sql`
* In pgAdmin:

  * Right-click your `equip_ease` database → **Query Tool**
  * Paste or open the SQL file and execute it to create the schema and populate data.

---

## 🧪 2. Test Database Connection

Before running the backend, you can test if the Node.js server can connect to your PostgreSQL DB.

### Run the test:

```bash
cd C:\Users\HP\Desktop\Tiiff_projo\equip-ease-backend
node test_db.js
```

If the connection is successful, you’ll see a message like:

```
Database connection successful!
```

---

## 🚀 3. Setting Up the Backend

### Step 1: Navigate to the Backend Folder

```bash
cd C:\Users\HP\Desktop\Tiiff_projo\equip-ease-backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment (if needed)

Make sure your backend has a `.env` file with the correct PostgreSQL credentials:

```env
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=equip_ease
```

### Step 4: Start the Backend Server

```bash
node server.js
```

Server should run on [http://localhost:5001](http://localhost:5001)

---

## 🌐 4. Setting Up the Frontend

### Step 1: Navigate to the Frontend Folder

```bash
cd C:\Users\HP\Desktop\Tiiff_projo\equip-ease-frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start the React App

```bash
npm start
```

React app should open in your browser at [http://localhost:3000](http://localhost:3000)

---

## 📝 Summary

| Component | Command                         | Location                    |
| --------- | ------------------------------- | --------------------------- |
| Database  | Import `equip_ease.sql`         | `pgAdmin` → `equip_ease` DB |
| Test DB   | `node test_db.js`               | `equip-ease-backend` folder |
| Backend   | `npm install && node server.js` | `equip-ease-backend`        |
| Frontend  | `npm install && npm start`      | `equip-ease-frontend`       |

---

## ❓ Troubleshooting

* If you see a connection error, double-check your PostgreSQL credentials and ensure the database is running.
* Make sure ports `3000` (frontend) and `5001` (backend) are not in use.
* If CORS issues occur, make sure your backend has CORS enabled.

---

## 👨‍💻 Author

Built by **Netsh Chaos**
© 2025 EquipEase. All rights reserved.

---

Let me know if you'd like to include screenshots or sample API calls.
