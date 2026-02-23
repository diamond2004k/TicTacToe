# 🎮 Real-Time Multiplayer Tic-Tac-Toe

A real-time multiplayer Tic-Tac-Toe game playable from two different devices or browser tabs using WebSockets.

---

## 🚀 Features

### ✅ Core Features
- Create & Join game rooms using a unique room code
- Real-time synchronization using Socket.io
- Alternate player turns (X and O)
- Winner detection
- Draw detection
- Prevent invalid moves
- Winning cells glow 🎉

### ⭐ Bonus Features
- Player names support
- Restart game button
- Improved UI
- Room-based multiplayer architecture

---

## 🛠 Tech Stack

### Frontend
- React.js
- Socket.io Client
- CSS

### Backend
- Node.js
- Express.js
- Socket.io

---

## 📂 Project Structure

```

tic-tac-toe-server/
│
├── client/              # React frontend
│
├── server/
│   ├── server.js
│   ├── gameHandler.js
│   ├── checkWinner.js
│
├── package.json
└── README.md

````

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/tic-tac-toe-multiplayer.git
cd tic-tac-toe-multiplayer
````

---

### 2️⃣ Install Backend Dependencies

```bash
cd server
npm install
```

Start backend:

```bash
node server.js
```

Server runs on:

```
http://localhost:5000
```

---

### 3️⃣ Install Frontend Dependencies

Open new terminal:

```bash
cd client
npm install
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🎮 How to Play

1. Player 1 creates a room.
2. Share the room code with Player 2.
3. Player 2 joins the room.
4. Players take turns placing X and O.
5. Game ends when:

   * A player wins
   * OR the game ends in a draw
6. Click Restart to play again.

---

## 🧠 Game Logic

* The server manages:

  * Room creation
  * Player assignment
  * Turn validation
  * Winner detection
  * Draw detection
* All moves are validated server-side to prevent cheating.

---

## 👩‍💻 Author

Akanksha Raju K
Built as a real-time full-stack project.

---

## 📜 License

This project is open source and free to use.

````
