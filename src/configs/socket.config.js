import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import Message from "#models/message";
import saveFile from "#utils/upload";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const server = createServer(app);

const userList = {};
const socketList = {};

// Get user by userId
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const io = new Server(server, {
  cors: {
    origin: "*",
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
  console.log("User connected", socket.id);
  socket.on("message", async (payload, file = null) => {
    try {
      if (typeof payload !== "object") {
        return;
      }
      let { senderId, receiverId, text } = payload;
      if (!senderId || !receiverId) {
        return io.to(socket.id).emit("message", {
          status: false,
          message: "Both senderId and receiverId are required",
        });
      }
      if (!text && !file) {
        return io.to(socket.id).emit("message", {
          status: false,
          message: "Please send a valid text or file",
        });
      }
      let filePath = null;
      if (file) {
        text = null;
        filePath = await saveFile(file);
        filePath = filePath.replace("src/", "/");
      }

      const message = await Message.create({
        senderId,
        receiverId,
        text,
        file: filePath,
      });

      const receiverSocketId = userList[receiverId];
      socket.to(receiverSocketId).emit("message", {
        senderId,
        text,
        file: filePath,
      });
    } catch (err) {
      console.log(err);
      io.to(socket.id).emit("message", {
        status: false,
        message: "Some internal error occured",
      });
    }
  });

  socket.on("addUser", async (payload) => {
    userList[payload] = socket.id;
    socketList[socket.id] = payload;
  });

  socket.on("read", async (payload) => {
    const receiverId = socketList[socket.id];
    await Message.update(
      { read: true },
      { where: { receiverId, senderId: payload } },
    );
  });

  socket.on("user-typing", async (payload) => {
    const socketId = userList[payload];
    const senderId = socketList[socket.id];
    if (socketId) {
      socket.to(socketId).emit("user-typing", senderId);
    }
  });

  socket.on("disconnect", () => {
    const userId = socketList[socket.id];
    delete socketList[socket.id];
    delete userList[userId];
    console.log(`User disconnected ${socket.id}`);
  });
});

server.listen(3030);

export default server;
