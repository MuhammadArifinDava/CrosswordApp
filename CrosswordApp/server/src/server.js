const http = require("http");
const { Server } = require("socket.io");
const { app } = require("./app");
const { env } = require("./config/env");
const { connectDb } = require("./config/db");

async function start() {
  env.require("JWT_SECRET");
  env.require("MONGO_URI");

  console.log("Connecting to MongoDB...");
  await connectDb(env.mongoUri);
  console.log("Connected to MongoDB");

  const server = http.createServer(app);
  
  // Setup Socket.IO for multiplayer/real-time features
  const io = new Server(server, {
    cors: {
      origin: "*", // Adjust in production
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    
    socket.on("join_puzzle", (puzzleId) => {
        socket.join(puzzleId);
        console.log(`Socket ${socket.id} joined puzzle ${puzzleId}`);
        // Notify others in room
        socket.to(puzzleId).emit("player_joined", { id: socket.id });
        
        // Ask existing clients for the current state to sync the new player
        // This ensures that if the server restarted or it's a new session, 
        // we get the latest state from any active player.
        const roomSize = io.sockets.adapter.rooms.get(puzzleId)?.size || 0;
        if (roomSize > 1) {
            // There is someone else in the room. Ask them for state.
            socket.to(puzzleId).emit("request_sync", { requesterId: socket.id });
        }
    });

    socket.on("provide_sync", ({ requesterId, state, puzzleId }) => {
        // Relay the state to the specific requester
        io.to(requesterId).emit("apply_sync", state);
    });

    socket.on("update_cell", ({ puzzleId, row, col, char }) => {
        // Broadcast to others in the same puzzle room
        socket.to(puzzleId).emit("cell_updated", { row, col, char });
    });

    socket.on("cursor_move", ({ puzzleId, row, col, user }) => {
        // Broadcast cursor position
        socket.to(puzzleId).emit("remote_cursor_moved", { id: socket.id, user, row, col });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  server.listen(env.port, () => {
    console.log(`Server listening on http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
