import React from 'react';
import { useVocabularyGame } from './hooks/useVocabularyGame';
import { GameItem } from './types';

export default function App() {
  const {
    words,
    meanings,
    selectedWord,
    selectedMeaning,
    incorrectPair,
    score,
    total,
    initializeGame,
    handleWordClick,
    handleMeaningClick,
  } = useVocabularyGame();

  const allMatched = score === total && total > 0;

  const getItemClasses = (item: GameItem, type: 'word' | 'meaning'): string => {
    const isSelected = type === 'word' 
      ? selectedWord?.id === item.id 
      : selectedMeaning?.id === item.id;
    
    const isIncorrect = type === 'word'
      ? incorrectPair?.wordId === item.id
      : incorrectPair?.meaningId === item.id;

    let classes = "w-full p-4 rounded-xl shadow-md text-left transition-all duration-200 cursor-pointer text-base md:text-lg font-medium ";
    
    if (item.matched) {
      classes += " bg-gradient-to-r from-green-100 to-green-200 text-green-700 line-through cursor-not-allowed transform scale-95 opacity-70";
    } else if (isIncorrect) {
      classes += " bg-red-100 border-2 border-red-500 text-red-700 animate-shake";
    } else if (isSelected) {
      classes += " bg-blue-100 border-2 border-blue-500 text-blue-800 ring-2 ring-blue-300 transform scale-102";
    } else {
      classes += " bg-white hover:bg-gray-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2";
    }
    return classes;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-sans antialiased">
      <style>
        {`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes bounce-once {
          0%, 100% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(-15%);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        .animate-bounce-once {
          animation: bounce-once 1s ease-in-out;
        }
        `}
      </style>
      <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-200">
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-4 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
            Vocab Match: The Power of Editorial Cartoons
          </span>
        </h1>
        <p className="text-center text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          Match the English words with their definitions to master your vocabulary!
        </p>

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-5 mb-8 flex flex-col md:flex-row justify-between items-center shadow-lg transform hover:scale-101 transition-transform duration-300">
          <div className="text-2xl font-bold text-white mb-3 md:mb-0">
            Score: <span className="text-yellow-300 text-3xl">{score}</span> / {total}
          </div>
          <button
            onClick={initializeGame}
            className="px-8 py-3 bg-white text-blue-700 font-bold rounded-full shadow-md hover:bg-gray-100 hover:text-blue-800 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2"
          >
            Reset Game
          </button>
        </div>

        {allMatched ? (
          <div className="text-center p-12 bg-green-50 rounded-2xl border-4 border-green-300 shadow-lg animate-bounce-once">
            <h2 className="text-4xl font-extrabold text-green-800 mb-3">🎉 Congratulations! 🎉</h2>
            <p className="text-2xl text-green-700">
              You've successfully matched all the vocabulary words! Excellent job!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">Words</h2>
              <ul className="space-y-4">
                {words.map(word => (
                  <li key={`word-${word.id}`}>
                    <button
                      onClick={() => handleWordClick(word)}
                      disabled={word.matched}
                      className={getItemClasses(word, 'word')}
                    >
                      {word.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">Definitions</h2>
              <ul className="space-y-4">
                {meanings.map(meaning => (
                  <li key={`meaning-${meaning.id}`}>
                    <button
                      onClick={() => handleMeaningClick(meaning)}
                      disabled={meaning.matched}
                      className={getItemClasses(meaning, 'meaning')}
                    >
                      {meaning.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}