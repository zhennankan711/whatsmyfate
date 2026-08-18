export type PageName = 'home' | 'bazi' | 'tarot' | 'answerBook' | 'fortuneDraw';

export interface BaziResult {
  year: string;
  month: string;
  day: string;
  hour: string;
  wuxing: string[];
  yinyang: string[];
  explanation: string;
  explanationEn: string;
  lunarDate: string;
  reading: {
    personality: string;
    personalityEn: string;
    career: string;
    careerEn: string;
    love: string;
    loveEn: string;
    health: string;
    healthEn: string;
    advice: string;
    adviceEn: string;
  };
}

export interface TarotCard {
  id: number;
  name: string;
  nameEn: string;
  suit: 'major' | 'cups' | 'swords' | 'wands' | 'pentacles';
  meaning: string;
  meaningEn: string;
  meaningReversed: string;
  meaningReversedEn: string;
  isReversed: boolean;
}

export interface FortuneResult {
  level: 'supreme' | 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  title: string;
  titleEn: string;
  poem: string;
  poemEn: string;
  interpretation: string;
  interpretationEn: string;
}
