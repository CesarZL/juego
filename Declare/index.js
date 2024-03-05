const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").createServer(app);
const ws = require("ws");
const path = require('path');
const fs = require('fs');

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  wsEngine: ws.Server,
});

var sockets = {};

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`server started on Port ${PORT}`);
});

// Cargar las cartas desde el archivo cartas.json
const cartas = JSON.parse(fs.readFileSync('cartas.json', 'utf-8'));

class Deck {
  constructor(cards) {
    this.cards = cards;
    this.currentIndex = 0;
    this.shuffle();
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  deal() {
    if (this.currentIndex < this.cards.length) {
      return this.cards[this.currentIndex++];
    } else {
      // If deck is empty, reset and shuffle
      this.reset();
      this.shuffle();
      return this.cards[this.currentIndex++];
    }
  }

  reset() {
    this.currentIndex = 0;
  }

  length() {
    return this.cards.length;
  }
}


// Manejo de conexion a la sala
io.on("connection", (socket) => {

  console.log(`el usuario ${socket.id} se ha conectado`);
  io.to(socket.id).emit("server_id", socket.id);

  // Manejo de unión a la sala
  socket.on("join_room", ({ room, name }) => {
    try {
      socket.join(room);
      socket.nickname = name;
      socket.room = room;
      if (!sockets[room]) {
        sockets[room] = {};
        sockets[room].names = [];
        sockets[room].start = false;
      }
      sockets[room].names = [...sockets[room].names, name];
      io.in(room).emit("player_count", io.sockets.adapter.rooms.get(room).size);
      // io.in(room).emit("update", `${name} has joined room ${room}`);
      io.in(room).emit("update", `${name} ha entrado a la sala`);
      console.log(`${name} ha entrado a la sala ${room}`);
    } catch (err) {
      console.log(err.message);
    }
  });

  // Manejo de desconexión de la sala
  socket.on("leave_room", ({ name, room }) => {
    try {
      socket.leave(room);
      delete socket.room;
      delete socket.nickname;
      if (sockets[room]) {
        io.in(room).emit("update", `${name} ha salido de la sala`);
        io.in(room).emit(
          "player_count",
          io.sockets.adapter.rooms.get(room).size
        );
        sockets[room].names.splice(sockets[room].names.indexOf(name), 1);
        console.log(`${name} ha salido de la sala ${room}`);
      }
    } catch (error) {
      console.log(error.message);
    }
  });

// Manejo de update de la sala
  socket.on("update", ({ update, room }) => {
    try {
      io.in(room).emit("update", update);
    } catch (error) {
      console.log(error.message);
    }
  });

  // Manejo de desconexión de jugador de la sala
  socket.on("disconnect", () => {
    try {
      console.log(`${socket.id} se ha desconectado`);
      if (!socket.room) {
        return
      }
      console.log(sockets[socket.room].start);
      if (sockets[socket.room].start) {
        io.in(socket.room).emit(
          "end_game",
          `${socket.nickname} ha salido del juego`
        );
        delete sockets[socket.room];
      } else {
        io.in(socket.room).emit(
          "player_count",
          io.sockets.adapter.rooms.get(socket.room).size
        );
        sockets[socket.room].names.splice(
          sockets[socket.room].names.indexOf(socket.nickname)
        );
        io.in(socket.room).emit("update", `${socket.nickname} ha salido de la sala`);
      }
    } catch (error) {
      console.log(error.message);
    }
  });

  //Manejo de termino de juego
  socket.on("end_game", (room) => {
    try {
      console.log("El juego ha terminado");
      io.in(room).emit("end_game", "El juego ha terminado");
      delete sockets[room];
    } catch (error) {
      console.log(error.message);
    }
  });

  let current_room;

  // Manejo de inicio de juego
  socket.on("start_game", (room) => {
    try {
      io.in(room).emit("start_game");
      sockets[room].start = true;

      // Crear el mazo de cartas usando la clase Deck y las cartas del archivo JSON
      sockets[room].deck = new Deck([...cartas.blanca]);
      if (sockets[room].deck.length() < 7) {
        sockets[room].deck.reset();
        sockets[room].deck.shuffle();
      }

      // Obtener una carta negra para todos
      sockets[room].opencard = cartas.negra[Math.floor(Math.random() * cartas.negra.length)];

      io.sockets.adapter.rooms.get(room).forEach((player) => {
        // Repartir 5 cartas blancas a cada jugador
        const cards = [];
        for (let i = 0; i < 5; i++) {
          cards.push(sockets[room].deck.deal());
        }

        let opencard = sockets[room].opencard;

        let playerNames = sockets[room].names;
        io.to(player).emit("start_variables", { opencard, cards, playerNames });
        // imprimir opencard
        console.log(opencard);
        //imprimir cartas de los jugadores
        console.log(cards);
      });

      current_room = Array.from(io.sockets.adapter.rooms.get(room));
      sockets[room]._turn = 0;
      io.in(room).emit(
        "your_turn",
        io.sockets.sockets.get(current_room[0]).nickname
      );
    } catch (error) {
      console.log(error.message);
    }
  });



});

