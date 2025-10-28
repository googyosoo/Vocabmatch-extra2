
export interface VocabularyPair {
  id: number;
  word: string;
  meaning: string;
}

export interface GameItem {
  id: number;
  text: string;
  matched: boolean;
}

export interface IncorrectPair {
  wordId: number;
  meaningId: number;
}
