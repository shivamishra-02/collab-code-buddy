import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { executeCode } from "./executor.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
  },
});

// Keep track of users in each room: { roomId: { socketId: username } }
const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // When a user joins a room
  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {};
    }
    rooms[roomId][socket.id] = username;

    // Save info on socket object for later use
    socket.roomId = roomId;
    socket.username = username;

    // Send updated user list to everyone in the room
    io.to(roomId).emit("user-list", Object.values(rooms[roomId]));

    console.log(`${username} joined room ${roomId}`);
  });

  // When a user types code, broadcast to others in the same room
  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("code-update", code);
  });

  // When a user changes the selected language
  socket.on("language-change", ({ roomId, language }) => {
    socket.to(roomId).emit("language-update", language);
  });

  // Run code using Piston API
  socket.on("run-code", async ({ roomId, language, code }) => {
    const result = await executeCode(language, code);
    io.to(roomId).emit("code-output", result.output);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    const { roomId, username } = socket;

    if (roomId && rooms[roomId]) {
      delete rooms[roomId][socket.id];

      // Remove room entry if empty
      if (Object.keys(rooms[roomId]).length === 0) {
        delete rooms[roomId];
      } else {
        io.to(roomId).emit("user-list", Object.values(rooms[roomId]));
      }
    }

    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Collab Code Buddy server is running");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});