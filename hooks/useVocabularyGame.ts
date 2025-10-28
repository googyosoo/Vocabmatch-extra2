
import { useState, useEffect, useCallback } from 'react';
import { GameItem, IncorrectPair } from '../types';
import { vocabularyPairs } from '../constants';

// Fisher-Yates shuffle utility function
function shuffleArray<T,>(array: T[]): T[] {
  const newArray = [...array];
  let currentIndex = newArray.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
}

export const useVocabularyGame = () => {
  const [words, setWords] = useState<GameItem[]>([]);
  const [meanings, setMeanings] = useState<GameItem[]>([]);
  const [selectedWord, setSelectedWord] = useState<GameItem | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState<GameItem | null>(null);
  const [incorrectPair, setIncorrectPair] = useState<IncorrectPair | null>(null);
  const [score, setScore] = useState(0);

  const initializeGame = useCallback(() => {
    setScore(0);
    setSelectedWord(null);
    setSelectedMeaning(null);
    setIncorrectPair(null);

    const baseItems = vocabularyPairs.map(pair => ({
      id: pair.id,
      matched: false,
    }));

    setWords(shuffleArray(baseItems.map(item => ({
      ...item,
      text: vocabularyPairs.find(p => p.id === item.id)!.word,
    }))));
    
    setMeanings(shuffleArray(baseItems.map(item => ({
      ...item,
      text: vocabularyPairs.find(p => p.id === item.id)!.meaning,
    }))));
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (incorrectPair) {
      const timer = setTimeout(() => {
        setIncorrectPair(null);
        setSelectedWord(null);
        setSelectedMeaning(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [incorrectPair]);

  const checkMatch = (wordId: number, meaningId: number) => {
    if (wordId === meaningId) {
      setScore(prev => prev + 1);
      setWords(prev => prev.map(w => w.id === wordId ? { ...w, matched: true } : w));
      setMeanings(prev => prev.map(m => m.id === meaningId ? { ...m, matched: true } : m));
      setSelectedWord(null);
      setSelectedMeaning(null);
    } else {
      setIncorrectPair({ wordId, meaningId });
    }
  };

  const handleWordClick = (word: GameItem) => {
    if (word.matched || selectedWord?.id === word.id || incorrectPair) return;

    setSelectedWord(word);
    if (selectedMeaning) {
      checkMatch(word.id, selectedMeaning.id);
    }
  };

  const handleMeaningClick = (meaning: GameItem) => {
    if (meaning.matched || selectedMeaning?.id === meaning.id || incorrectPair) return;

    setSelectedMeaning(meaning);
    if (selectedWord) {
      checkMatch(selectedWord.id, meaning.id);
    }
  };

  return {
    words,
    meanings,
    selectedWord,
    selectedMeaning,
    incorrectPair,
    score,
    total: vocabularyPairs.length,
    initializeGame,
    handleWordClick,
    handleMeaningClick,
  };
};
