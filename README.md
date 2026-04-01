# 💬 Full fledged Real-Time Chat Application

A modern, feature-rich chat application built with Node.js, Express, and Socket.IO for seamless real-time communication.

## 📸 Screenshots

<div align="center">
  <img src="https://github.com/rushabhT3/ChatApp/blob/main/screenshots/signup.png?raw=true" height="280" alt="Sign Up Page" style="margin: 8px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
  <img src="https://github.com/rushabhT3/ChatApp/blob/main/screenshots/login.png?raw=true" height="280" alt="Login Page" style="margin: 8px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
  <img src="https://github.com/rushabhT3/ChatApp/blob/main/screenshots/chat.png?raw=true" height="280" alt="Chat Interface" style="margin: 8px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
</div>

## ✨ Features

- **Real-time Messaging** - Instant message delivery with Socket.IO
- **Group Chat** - Create and manage group conversations
- **User Authentication** - Secure signup/login with JWT
- **Member Management** - Add/remove members, assign admin roles
- **File Sharing** - Support for multimedia attachments
- **Search Functionality** - Find and add users to groups
- **Responsive Design** - Clean, modern UI

## 🛠 Tech Stack

**Backend:**
- Node.js & Express
- Socket.IO (real-time communication)
- Sequelize ORM with MySQL
- JWT Authentication
- Multer (file uploads)

**Frontend:**
- Vanilla JavaScript
- HTML5 & CSS3
- Socket.IO Client

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app runs on `http://localhost:3000` by default.

## 📁 Project Structure

```
├── controllers/    # Route handlers
├── models/        # Database models
├── routes/        # API routes
├── middlewares/   # Auth middleware
├── public/        # Frontend assets
├── Services/      # Business logic
└── socket.js      # Socket.IO setup
```

## 🔐 Environment Variables

Create a `.env` file with:
```
PORT=3000
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_password
DB_NAME=chat_app
JWT_SECRET=your_jwt_secret
```

## 📝 API Endpoints

- `POST /signup` - User registration
- `POST /login` - User authentication
- `POST /sendMessage` - Send messages
- `GET /getMessages` - Fetch chat history
- `POST /makeGroup` - Create groups
- `POST /addMember` - Add members to groups
- `GET /search` - Search users

---

**Built by Rushabh** | MIT License
