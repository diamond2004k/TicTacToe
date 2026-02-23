const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 5000;

let rooms = {};

const winningCombinations = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

function checkGameStatus(board) {
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo };
    }
  }

  if (!board.includes("")) {
    return { winner: "Draw", combo: [] };
  }

  return null;
}

io.on("connection", (socket) => {

  // CREATE ROOM
  socket.on("createRoom", (name) => {
    const roomCode = generateRoomCode();

    rooms[roomCode] = {
      players: [{ id: socket.id, symbol: "X", name }],
      board: Array(9).fill(""),
      turn: "X",
      winner: null,
      winningCells: [],
    };

    socket.join(roomCode);

    socket.emit("roomCreated", {
      roomCode,
      symbol: "X",
    });
  });

  // JOIN ROOM
  socket.on("joinRoom", ({ roomCode, name }) => {
    const room = rooms[roomCode];

    if (!room) {
      socket.emit("errorMessage", "Room does not exist.");
      return;
    }

    if (room.players.length >= 2) {
      socket.emit("errorMessage", "Room is full.");
      return;
    }

    room.players.push({
      id: socket.id,
      symbol: "O",
      name,
    });

    socket.join(roomCode);

    socket.emit("joinedRoom", {
      roomCode,
      symbol: "O",
    });

    io.to(roomCode).emit("startGame", room);
  });

  // MAKE MOVE
  socket.on("makeMove", ({ roomCode, index }) => {
    const room = rooms[roomCode];
    if (!room || room.winner) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    if (room.turn !== player.symbol) return;
    if (room.board[index] !== "") return;

    room.board[index] = player.symbol;

    const result = checkGameStatus(room.board);

    if (result) {
      room.winner = result.winner;
      room.winningCells = result.combo;
    } else {
      room.turn = room.turn === "X" ? "O" : "X";
    }

    io.to(roomCode).emit("updateGame", room);
  });

  // RESTART GAME
  socket.on("restartGame", (roomCode) => {
    const room = rooms[roomCode];
    if (!room) return;

    room.board = Array(9).fill("");
    room.turn = "X";
    room.winner = null;
    room.winningCells = [];

    io.to(roomCode).emit("updateGame", room);
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    for (let roomCode in rooms) {
      const room = rooms[roomCode];
      room.players = room.players.filter(p => p.id !== socket.id);

      if (room.players.length === 0) {
        delete rooms[roomCode];
      }
    }
  });

});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});