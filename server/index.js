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

// Keep track of users in each room: { roomId: { socketId: { username, color } } }
const rooms = {};

// Fun color palette assigned to each user's "buddy" character
const BUDDY_COLORS = [
  "#f78166", // warm orange
  "#58a6ff", // blue
  "#3fb950", // green
  "#d29922", // yellow
  "#bc8cff", // purple
  "#ff7b9c", // pink
  "#39c5cf", // cyan
  "#ffa657", // amber
];

const getBuddyColor = (roomId) => {
  const usedCount = rooms[roomId] ? Object.keys(rooms[roomId]).length : 0;
  return BUDDY_COLORS[usedCount % BUDDY_COLORS.length];
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {};
    }

    const color = getBuddyColor(roomId);
    rooms[roomId][socket.id] = { username, color };

    socket.roomId = roomId;
    socket.username = username;

    io.to(roomId).emit("user-list", Object.values(rooms[roomId]));

    console.log(`${username} joined room ${roomId}`);
  });

  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("code-update", code);
  });

  socket.on("language-change", ({ roomId, language }) => {
    socket.to(roomId).emit("language-update", language);
  });

  socket.on("run-code", async ({ roomId, language, code }) => {
    const result = await executeCode(language, code);
    io.to(roomId).emit("code-output", result.output);
  });

  socket.on("disconnect", () => {
    const { roomId, username } = socket;

    if (roomId && rooms[roomId]) {
      delete rooms[roomId][socket.id];

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