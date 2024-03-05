import React, { useState, useEffect, useRef } from "react";
import ProfileCircle from "./ProfileCircle";

const Game = ({ socket, name, room, setLoggedIn }) => {
  const [players, setPlayers] = useState([]);
  const [opencard, setOpencard] = useState();
  const [playerCards, setPlayerCards] = useState([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState(null);

  class Card {
    constructor(card) {
      this.card = card;
    }
  }

  useEffect(() => {
    const animateProgress = (timestamp) => {
      if (!startTime) {
        setStartTime(timestamp);
      }

      const elapsed = timestamp - startTime;
      const duration = 20000; // 20 seconds

      if (elapsed < duration) {
        setProgress((elapsed / duration) * 100);
        requestAnimationFrame(animateProgress);
      } else {
        setProgress(100);
      }
    };

    const animationId = requestAnimationFrame(animateProgress);

    socket.current.on("start_variables", ({ opencard, cards, playerNames }) => {
      setOpencard(new Card(opencard));
      let tempCards = [];
      for (let i = 0; i < cards.length; i++) {
        tempCards.push(new Card(cards[i]));
      }
      setPlayerCards(tempCards);
      setPlayers(playerNames);
    });

    socket.current.on("end_game", (message) => {
      setLoggedIn(false);
      socket.current.emit("leave_room", { name, room });
      window.alert(`${message}`);
    });

    // Cleanup animation on component unmount
    return () => cancelAnimationFrame(animationId);
  }, [socket.current, startTime]);

  const endGame = () => {
    setLoggedIn(false);
    socket.current.emit("end_game", room);
  };

  const handleCardClick = (index) => {
    setSelectedCardIndex(index);
  };

  const carta_negra = opencard ? opencard.card : "";

  return (
    <div className="bg-repeat bg-gray-300 dark:bg-gray-700" style={{ backgroundImage: 'url(https://md.rereadgames.com/assets/images/background.9fd67490ba48987ac0c8.svg)' }}>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-green-500" style={{ width: `${progress}%` }}></div>

    <section className="h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="bg-black rounded-lg px-5 py-4 m-2 text-white w-64 h-96 mb-4 overflow-auto">
        <p className={`font-bold ${carta_negra.length > 152 ? "text-xl" : "text-2xl"}`}>{carta_negra}</p>
      </div>

      <div class="relative w-full max-w-screen-3xl flex gap-6 snap-x snap-mandatory overflow-x-auto pb-14">
        <div class="snap-center shrink-0">
          <div class="shrink-0 w-4 sm:w-48"></div>
        </div>

        {playerCards.map((card, index) => (
          <div key={index} class="snap-center shrink-0">
            <div
              className={`bg-white rounded-lg px-5 py-4 m-2 w-64 h-96 overflow-auto ${
                selectedCardIndex === index ? "border-4 border-green-500" : ""
              }`}
              onClick={() => handleCardClick(index)}
            >
              <p className="text-2xl font-bold">{card.card}</p>
            </div>
          </div>
        ))}

        <div class="snap-center shrink-0">
          <div class="shrink-0 w-4 sm:w-48"></div>
        </div>
      </div>

      <div className="fixed top-6 start-6 group">
        <button
          onClick={endGame}
          type="button"
          className="flex items-center justify-center text-white hover:bg-white hover:text-black bg-black rounded-full w-12 h-12 dark:bg-black dark:hover:bg-white dark:hover:text-black focus:ring-4"
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:rotate-45"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
          </svg>
        </button>
      </div>
    </section>
    </div>
  );
};

export default Game;