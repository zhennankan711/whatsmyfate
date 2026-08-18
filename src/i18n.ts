import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  zh: {
    translation: {
      appTitle: '赛博算命',
      appSubtitle: 'Cyber Divination',
      home: {
        title: '选择你的命运之路',
        subtitle: 'Choose Your Path',
        cards: {
          bazi: { title: '生辰八字', desc: '输入出生时间，解读你的天命' },
          tarot: { title: '塔罗占卜', desc: '抽取塔罗牌，揭示命运的指引' },
          answer: { title: '答案之书', desc: '心中有疑？翻开书页寻找答案' },
          draw: { title: '运势抽签', desc: '摇动签筒，抽取今日运势' },
        }
      },
      bazi: {
        title: '生辰八字',
        subtitle: 'Bazi - Eight Characters',
        birthDate: '出生日期',
        birthTime: '出生时辰',
        calculate: '推算八字',
        yearPillar: '年柱',
        monthPillar: '月柱',
        dayPillar: '日柱',
        hourPillar: '时柱',
        wuxing: '五行分析',
        explanation: '命理解读',
        fourPillars: '四柱八字',
        personality: '性格命格',
        career: '事业财运',
        love: '感情姻缘',
        health: '健康养生',
        advice: '开运建议',
        lunarPrefix: '农历',
        yearPlaceholder: '年',
        monthPlaceholder: '月',
        dayPlaceholder: '日',
        wuxingList: { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' },
      },
      tarot: {
        title: '塔罗占卜',
        subtitle: 'Tarot Reading',
        shuffle: '洗牌',
        draw: '抽牌',
        draw3: '抽三张牌',
        past: '过去',
        present: '现在',
        future: '未来',
        meaning: '牌意解读',
        reversed: '逆位',
        upright: '正位',
        hintPast: '✦ 请点击牌组，选择「过去」之牌 ✦',
        hintPresent: '✦ 请点击牌组，选择「现在」之牌 ✦',
        hintFuture: '✦ 请点击牌组，选择「未来」之牌 ✦',
      },
      answerBook: {
        title: '答案之书',
        subtitle: 'The Book of Answers',
        placeholder: '在心中默想一个问题...',
        ask: '翻开答案',
        thinking: '书中自有答案...',
        askAgain: '再问一次',
      },
      fortuneDraw: {
        title: '运势抽签',
        subtitle: 'Fortune Stick Draw',
        shake: '摇动签筒',
        draw: '抽取一签',
        result: '签文',
        drawAgain: '再抽一签',
      },
      common: {
        back: '返回',
        switchLang: '中 / EN',
        loading: '测算中...',
        reveal: '揭晓',
      }
    }
  },
  en: {
    translation: {
      appTitle: 'Cyber Divination',
      appSubtitle: 'Ancient Wisdom, Digital Age',
      home: {
        title: 'Choose Your Path',
        subtitle: 'Select a divination method below',
        cards: {
          bazi: { title: 'Bazi', desc: 'Enter birth time to decode your destiny' },
          tarot: { title: 'Tarot', desc: 'Draw tarot cards to reveal fate\'s guidance' },
          answer: { title: 'Answer Book', desc: 'Have a question? Open the book for answers' },
          draw: { title: 'Fortune Draw', desc: 'Shake and draw your daily fortune' },
        }
      },
      bazi: {
        title: 'Bazi - Eight Characters',
        subtitle: 'Birth Chart Analysis',
        birthDate: 'Birth Date',
        birthTime: 'Birth Hour',
        calculate: 'Calculate Bazi',
        yearPillar: 'Year Pillar',
        monthPillar: 'Month Pillar',
        dayPillar: 'Day Pillar',
        hourPillar: 'Hour Pillar',
        wuxing: 'Five Elements',
        explanation: 'Interpretation',
        fourPillars: 'Four Pillars',
        personality: 'Personality',
        career: 'Career & Wealth',
        love: 'Love & Marriage',
        health: 'Health',
        advice: 'Advice',
        lunarPrefix: 'Lunar',
        yearPlaceholder: 'Year',
        monthPlaceholder: 'Month',
        dayPlaceholder: 'Day',
        wuxingList: { metal: 'Metal', wood: 'Wood', water: 'Water', fire: 'Fire', earth: 'Earth' },
      },
      tarot: {
        title: 'Tarot Reading',
        subtitle: 'Cyber Divination',
        shuffle: 'Shuffle',
        draw: 'Draw',
        draw3: 'Draw 3 Cards',
        past: 'Past',
        present: 'Present',
        future: 'Future',
        meaning: 'Meaning',
        reversed: 'Reversed',
        upright: 'Upright',
        hintPast: '✦ Click a card for the PAST ✦',
        hintPresent: '✦ Click a card for the PRESENT ✦',
        hintFuture: '✦ Click a card for the FUTURE ✦',
      },
      answerBook: {
        title: 'The Book of Answers',
        subtitle: 'Cyber Divination',
        placeholder: 'Think of a question in your mind...',
        ask: 'Open the Book',
        thinking: 'The book holds your answer...',
        askAgain: 'Ask Again',
      },
      fortuneDraw: {
        title: 'Fortune Stick Draw',
        subtitle: 'Cyber Divination',
        shake: 'Shake the Tube',
        draw: 'Draw a Stick',
        result: 'Fortune',
        drawAgain: 'Draw Again',
      },
      common: {
        back: 'Back',
        switchLang: 'EN / 中',
        loading: 'Divining...',
        reveal: 'Reveal',
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
