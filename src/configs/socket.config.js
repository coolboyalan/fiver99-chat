import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import Message from "#models/message";

const app = express();
const server = createServer(app);

const userList = {};
const socketList = {};

// Get user by userId
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

const addUserToList = (userId, socketId) => {
  if (!userList[userId]) {
    userList[userId] = new Set();
  }
  userList[userId].add(socketId);
  socketList[socketId] = userId;
};

const removeUserFromList = (socketId) => {
  const userId = socketList[socketId];

  if (userId && userList[userId]) {
    userList[userId].delete(socketId);

    if (userList[userId].size === 0) {
      delete userList[userId];
    }
  }

  delete socketList[socketId];
};

io.on("connection", (socket) => {
  socket.on("message", async (payload, file) => {
    if (typeof payload !== "object") {
      return;
    }
    const { senderId, receiverId, text } = payload;
    if (!senderId || !receiverId) {
      return io.to(socket.id).emit("message", {
        status: false,
        message: "Both senderId and receiverId are required",
      });
    }
    const message = await Message.create({
      senderId,
      receiverId,
      text,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000);

export default server;
