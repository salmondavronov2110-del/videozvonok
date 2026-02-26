import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const PORT = 3000;

  // Store active users: { [digitId: string]: socketId }
  const users: Record<string, string> = {};
  // Reverse mapping: { [socketId: string]: digitId }
  const socketToUser: Record<string, string> = {};

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("register", (digitId: string) => {
      users[digitId] = socket.id;
      socketToUser[socket.id] = digitId;
      console.log(`User registered: ${digitId} -> ${socket.id}`);
      io.emit("user-list", Object.keys(users));
    });

    socket.on("call-user", ({ to, offer, from }) => {
      const targetSocketId = users[to];
      if (targetSocketId) {
        io.to(targetSocketId).emit("incoming-call", { from, offer });
      }
    });

    socket.on("answer-call", ({ to, answer }) => {
      const targetSocketId = users[to];
      if (targetSocketId) {
        io.to(targetSocketId).emit("call-answered", { answer });
      }
    });

    socket.on("ice-candidate", ({ to, candidate }) => {
      const targetSocketId = users[to];
      if (targetSocketId) {
        io.to(targetSocketId).emit("ice-candidate", { candidate });
      }
    });

    socket.on("hang-up", ({ to }) => {
      const targetSocketId = users[to];
      if (targetSocketId) {
        io.to(targetSocketId).emit("hang-up");
      }
    });

    socket.on("disconnect", () => {
      const digitId = socketToUser[socket.id];
      if (digitId) {
        delete users[digitId];
        delete socketToUser[socket.id];
        io.emit("user-list", Object.keys(users));
      }
      console.log("User disconnected:", socket.id);
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
