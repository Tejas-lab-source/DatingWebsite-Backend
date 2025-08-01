// --------------------
// 📦 Module Imports
// --------------------
const express = require('express');
const bodyParser = require('body-parser'); // Optional
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

// --------------------
// 📁 Local Imports
// --------------------
const connectDB = require('./config/mongodb');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const swipeRouter = require('./routes/swipeRouter');
const matchesRouter = require('./routes/matchesRouter');
const messageRouter = require('./routes/messageRouter');
const confessionsRouter = require('./routes/confessionRoutes');
const messageController = require('./controller/messageController');
const { profileRouter } = require('./routes/profileRouter');
const { searchProfileRouter } = require('./routes/searchRoute');
const User = require("./models/user");

// --------------------
// 🌐 Config & Init
// --------------------
dotenv.config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// --------------------
// 🔌 Middleware
// --------------------


const allowedOrigins = [
  "https://datingcollege-u9i1.vercel.app",  // ✅ for Vercel frontend
  'http://localhost:5173'                   // ✅ for local dev
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};




app.use(cors(corsOptions));   
app.use(express.json());          // ✅ To parse JSON body
app.use(cookieParser());   



// --------------------
// 🔗 Database Connection
// --------------------
connectDB();
const { userSocketMap, setIo } = require('./socketManger');

// --------------------
// 💬 Socket.IO Setup
// --------------------
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  }
});

setIo(io);

io.use((socket, next) => {
  const userId = socket.handshake.query.UserID;

  if (
    !userId ||
    userId === "null" ||
    userId === "undefined" ||
    userId.trim() === ""
  ) {
    console.warn("❌ Rejected anonymous socket attempt.");
    return next(new Error("Authentication error"));
  }

  socket.userId = userId;
  next();
});

io.on("connection", async (socket) => {
  const userId = socket.userId;

  console.log("-----------------------------");
  console.log("✅ User connected:", userId);
  console.log("🔌 Socket ID:", socket.id);
  console.log("-----------------------------");

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { isOnline: true },
    { new: true, runValidators: true }
  );
  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on('private-message', (newMessage) => {
    console.log(newMessage);

    const toSocketId = userSocketMap[newMessage.receiverId];
    if (toSocketId) {
      io.to(toSocketId).emit('private-message', newMessage);
    }
  });

  socket.on("disconnect", async () => {
    console.log("❎ User disconnected:", userId);
    delete userSocketMap[userId];

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isOnline: false },
      { new: true, runValidators: true }
    );

    if (updatedUser) {
      console.log(userId, " :is offline");
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// --------------------
// 🧪 Test Route
// --------------------
app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});

// --------------------
// 🚏 API Routes
// --------------------
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/matches', matchesRouter);
app.use('/api/v1/swipe', swipeRouter);
app.use('/api/v1/message', messageRouter);
app.use('/api/v1/confessions', confessionsRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/search', searchProfileRouter);


// --------------------
// 🚀 Start Server
// --------------------
server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

module.exports = { userSocketMap, io };
