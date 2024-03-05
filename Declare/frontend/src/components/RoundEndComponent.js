// ResultScreen.js
import React from 'react';

const ResultScreen = ({ selectedCards, opencard }) => {
  return (
    <div className="bg-repeat bg-gray-300 dark:bg-gray-700" style={{ backgroundImage: 'url(https://md.rereadgames.com/assets/images/background.9fd67490ba48987ac0c8.svg)' }}>
      <section className="h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="bg-black rounded-lg px-5 py-4 m-2 text-white w-64 h-96 mb-4 overflow-auto">
          <p className={`font-bold ${opencard.length > 152 ? "text-xl" : "text-2xl"}`}>{opencard}</p>
        </div>

        {/* Display selected cards of all players */}
        <div className="flex flex-wrap justify-center gap-4">
          {selectedCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg px-5 py-4 m-2 w-64 h-96 overflow-auto">
              <p className="text-2xl font-bold">{card}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResultScreen;
