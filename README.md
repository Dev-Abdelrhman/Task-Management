

# 📁 Task Management System

A powerful full-stack task management web application designed for team collaboration. It supports project-based roles, task management, real-time updates, file sharing, and more.

---

## 🚀 Features

- 🛠️ Create, manage, and assign tasks within projects
- 🧑‍🤝‍🧑 Role-based access & permissions
- 💬 Real-time comments with Socket.IO
- 📤 File upload via Cloudinary
- 📬 Email invites to project members
- 🔐 Authentication (Local & Google OAuth)
- 📊 Dashboard insights with charts
- ✉️ Notifications & email templates
- 🌗 Light/dark mode toggle
- 📦 Monorepo managed via Lerna + pnpm workspaces

---

## 📦 Tech Stack

### 🖥️ Frontend
- **React 19** + **Vite**
- **TailwindCSS**, **MUI**, **Framer Motion**
- **React Router DOM**
- **Zustand** for state management
- **Socket.IO Client**, **Recharts**, **EmailJS**

### 🔧 Backend
- **Node.js**, **Express**, **MongoDB**
- **Passport.js** (local & Google strategies)
- **Socket.IO** for real-time features
- **Multer**, **Cloudinary**
- **Nodemailer**
- Security: `helmet`, `cors`, `xss`, `rate-limit`, `mongo-sanitize`

---

## 🧬 Project Structure

```
Task-Management/
├── packages/
│   ├── Backend/       # Node.js backend (Express, MongoDB)
│   └── Frontend/      # React + Vite + TailwindCSS SPA
├── Postman_Collections/
│   └── Task_Management.postman_collection.json
├── API_Documentation.json
├── lerna.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/task-management.git
cd task-management
```

### 2. Install Dependencies

```bash
pnpm install
```

> Requires Node.js ≥ 18 and `pnpm` installed globally: `npm install -g pnpm`

### 3. Configure `.env` Files

Create `.env` files in:

- `packages/Backend/.env`

Example `.env` with placeholder values:

```env
NODE_ENV=development
PORT=5000
DATABASE=mongodb://localhost:27017/task-management
DATABASE_PASSWORD=fake_password
JWT_SECRET_ACCESS_TOKEN=fake_access_token_secret
JWT_SECRET_REFRESH_TOKEN=fake_refresh_token_secret
JWT_TEMP_SECRET=fake_temp_secret

JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d
JWT_TEMP_TOKEN_EXPIRES_IN=5m

JWT_COOKIE_EXPIRES_IN=1d

SESSION_SECRET=fake_session_secret

GOOGLE_CLIENT_ID=fake_google_client_id
GOOGLE_CLIENT_SECRET=fake_google_client_secret
GOOGLE_CALLBACK=http://localhost:5000/auth/google/callback

SMTP_HOST=smtp.fakeemail.com
SMTP_PORT=587
SMTP_USERNAME=fake@example.com
SMTP_PASSWORD=fake_email_password

CLOUDINARY_CLOUD_NAME=fake_cloud_name
CLOUDINARY_API_KEY=fake_cloud_api_key
CLOUDINARY_API_SECRET=fake_cloud_api_secret
```

Replace the fake values with your actual configuration for each environment variable.

### 4. Run the App

```bash
pnpm dev
```

This starts both the backend and frontend concurrently via:

```json
"scripts": {
  "dev": "concurrently \"lerna run start --scope=backend\" \"lerna run dev --scope=task-management\""
}
```

---

## 🧪 Testing

Backend tests are written using `jest` and `supertest`:

```bash
cd packages/Backend
pnpm test
```

---

## 📮 API Reference

Use the provided Postman collection:

- `Postman_Collections/Task_Management.postman_collection.json`

Or import the OpenAPI-style:

- `API_Documentation.json`

---

## 🤝 Contributing

1. Fork this repository
2. Create a new branch (`git checkout -b feature/xyz`)
3. Make your changes
4. Commit (`git commit -m "feat: add xyz feature"`)
5. Push (`git push origin feature/xyz`)
6. Open a Pull Request

---

## 📜 License

Licensed under the **ISC License**.

---

> Built by [Dev-Abdelrhman](https://github.com/Dev-Abdelrhman) with 💻 + ☕ and contributors.

