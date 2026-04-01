# 💬 Full fledged Real-Time Chat Application

A modern, feature-rich chat application built with Node.js, Express, and Socket.IO for seamless real-time communication.

## 📸 Screenshots

<div align="center">

### Chat Interface
<img src="https://github.com/user-attachments/assets/c7b973cf-0d07-4fc6-8d27-02a1aae51171" height="340" alt="Chat Interface 1" style="margin: 10px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
<img src="https://github.com/user-attachments/assets/5543552f-dee5-4616-96f1-e4be9def6c3f" height="340" alt="Chat Interface 2" style="margin: 10px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">

### Authentication Pages
<img src="https://github.com/user-attachments/assets/5d47af32-a305-438d-a9d3-8fe068c3e0f7" height="340" alt="Login Page" style="margin: 10px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
<img src="https://github.com/user-attachments/assets/7706b1e9-ec69-43cf-b06e-9c12dd177f89" height="340" alt="Sign Up Page" style="margin: 10px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">

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

**Built with 💌 by Rushabh**
