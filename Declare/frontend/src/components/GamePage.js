import React, { useState, useEffect } from "react";
// import { Button } from "@material-ui/core";
import Game from "./Game";

const GamePage = ({ socket, name, room, setLoggedIn }) => {
  const [start, setStart] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);
  const [updates, setUpdates] = useState([]);


  useState(() => {

    socket.current.on("player_count", (count) => {
      setPlayerCount(count);
    });

    socket.current.on("start_game", () => {
      setStart(true);
    });

  }, [socket.current]);

  useEffect(() => {

    socket.current.on("update", (msg) => {
      setUpdates((updates) => [...updates, msg]);
    });

  }, [socket.current]);

  const startGame = () => {

    if (playerCount < 2) {
      window.alert("you need at least 2 players to start the game");
      return null;
    }
    
    socket.current.emit("start_game", room);
    console.log("start game");

  };

  const leaveRoom = () => {
    socket.current.emit("leave_room", { name, room });
    setLoggedIn(false);
  };

  return (
    <div>
    {start ? (
        <Game
          room={room}
          socket={socket}
          name={name}
          setLoggedIn={setLoggedIn}
        />
      ) : (
        <div className="bg-repeat bg-gray-300 dark:bg-gray-700" style={{backgroundImage: 'url(https://md.rereadgames.com/assets/images/background.9fd67490ba48987ac0c8.svg)'}}>

        <section className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col md:flex-row sm:flex-wrap">
          <div className="sm:w-auto md:flex-grow mb-4 md:mb-0 md:mr-4">
            <div className="rounded-lg bg-white dark:bg-gray-800 py-4 px-4">
              <div className="mb-4 border-gray-200 dark:border-gray-700">
                <div className="rounded-md flex justify-center flex-wrap text-xl font-medium text-center bg-primary-100 text-purple-600 hover:text-purple-600 dark:text-purple-500 dark:bg-primary-200 dark:border-primary-500">
                  <div className="w-full p-4 flex items-center justify-center">
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path  stroke-linejoin="round" stroke-width="2" d="M17 13v5l-5-1-5 1v-5l5-1 5 1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 13h2v2h-2v-2zm0-6h2v5h-2v-5z" />
                    </svg>
                    <span>Te has unido a la sala {room}</span>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="max-w-sm mx-auto">
                  <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                    Actualmente hay {playerCount} jugador(es) en esta sala
                  </p>
                </div>

                <div className="max-w-sm mx-auto mt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <button
                    type="button"
                    onClick={startGame}
                    className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-md px-5 py-2.5 sm:px-4 sm:py-2 text-center w-full inline-flex items-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-auto mb-2 sm:mb-0 sm:mr-3"
                  >
                    <svg
                      className="w-3.5 h-3.5 me-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 21"
                    >
                      <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                    </svg>

                    Empezar juego
                  </button>
                  <button
                    type="button"
                    onClick={leaveRoom}
                    className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-md px-5 py-2.5 sm:px-4 sm:py-2 text-center w-full inline-flex items-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-auto"
                  >
                    <svg
                      className="w-3.5 h-3.5 me-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 21"
                    >
                      <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                    </svg>
                    Salir de la sala
                  </button>
                </div>



              </div>
            </div>
          </div>

          <div className="sm:w-auto md:flex-grow">
            <div className="rounded-lg bg-white dark:bg-gray-800 py-4 px-4">
              <div className="mb-4 border-gray-200 dark:border-gray-700">
                <div className="rounded-md flex justify-center flex-wrap text-xl font-medium text-center bg-primary-100 text-purple-600 hover:text-purple-600 dark:text-purple-500 dark:bg-primary-200 dark:border-primary-500">
                  <div className="w-full p-4 flex items-center justify-center">
                    Actualizaciones
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="max-w-sm mx-auto">
                  <ul className="list-disc list-inside">
                    {updates.map((update, index) => (
                      <li key={index} className="text-primary-600 dark:text-primary-500">{update}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>

      )}
      </div>
  );
};

export default GamePage;


