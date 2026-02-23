const checkWinner = require("../utils/checkWinner");

let rooms = {};

function gameHandler(io, socket) {

  socket.on("createRoom", () => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    rooms[roomCode] = {
      players: [],
      board: Array(9).fill(""),
      turn: "X",
      winner: null,
    };

    socket.join(roomCode);
    rooms[roomCode].players.push({ id: socket.id, symbol: "X" });

    socket.emit("roomCreated", { roomCode, symbol: "X" });
  });

  socket.on("joinRoom", (roomCode) => {
    const room = rooms[roomCode];

    if (!room) {
      socket.emit("errorMessage", "Room not found");
      return;
    }

    if (room.players.length >= 2) {
      socket.emit("errorMessage", "Room full");
      return;
    }

    socket.join(roomCode);
    room.players.push({ id: socket.id, symbol: "O" });

    socket.emit("joinedRoom", { roomCode, symbol: "O" });
    io.to(roomCode).emit("startGame", room);
  });

  socket.on("makeMove", ({ roomCode, index }) => {
    const room = rooms[roomCode];
    if (!room || room.winner) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    if (room.turn !== player.symbol) return;
    if (room.board[index] !== "") return;

    room.board[index] = player.symbol;

    const winner = checkWinner(room.board);

    if (winner) {
      room.winner = winner;
    } else if (!room.board.includes("")) {
      room.winner = "Draw";
    } else {
      room.turn = room.turn === "X" ? "O" : "X";
    }

    io.to(roomCode).emit("updateGame", room);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
}

module.exports = gameHandler;