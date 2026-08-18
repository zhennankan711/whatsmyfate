export interface BaziReading {
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
}

const DAY_GAN_PERSONALITY: Record<string, { zh: string; en: string }> = {
  '甲': {
    zh: '甲木日主，如参天大树，正直向上，有领导气质。为人仁慈宽厚，做事有始有终，但有时过于固执，不善变通。',
    en: 'As a Jia Wood day master, you are like a towering tree—upright, ambitious, and naturally charismatic. You are kind-hearted and generous, seeing things through to the end, though you can sometimes be overly stubborn and resistant to change.',
  },
  '乙': {
    zh: '乙木日主，如花草藤蔓，柔韧灵活，善于适应。为人温和细腻，富有同情心，但容易优柔寡断，缺乏主见。',
    en: 'As a Yi Wood day master, you are like vines and flowers—flexible, adaptable, and graceful. You are gentle, empathetic, and detail-oriented, though you may struggle with indecisiveness and a lack of assertiveness.',
  },
  '丙': {
    zh: '丙火日主，如太阳之火，热情奔放，光芒万丈。为人开朗大方，善于表达，但有时过于急躁，容易冲动。',
    en: 'As a Bing Fire day master, you are like the sun—radiant, passionate, and full of energy. You are outgoing, expressive, and generous, though you can sometimes be impulsive and prone to rushing into things.',
  },
  '丁': {
    zh: '丁火日主，如灯烛之火，温柔内敛，智慧深沉。为人心思缜密，富有创造力，但容易多虑，缺乏安全感。',
    en: 'As a Ding Fire day master, you are like a candle flame—warm, introspective, and deeply intelligent. You are thoughtful, creative, and perceptive, though you may tend to overthink and wrestle with feelings of insecurity.',
  },
  '戊': {
    zh: '戊土日主，如大地之土，厚重踏实，包容万物。为人稳重守信，有责任感，但有时过于保守，不善变通。',
    en: 'As a Wu Earth day master, you are like the solid earth—steady, reliable, and all-embracing. You are responsible, trustworthy, and grounded, though you can sometimes be overly cautious and slow to adapt.',
  },
  '己': {
    zh: '己土日主，如田园之土，细腻柔和，滋养万物。为人谦逊低调，善于协调，但容易随波逐流，缺乏魄力。',
    en: 'As a Ji Earth day master, you are like garden soil—nurturing, gentle, and quietly supportive. You are humble, diplomatic, and good at harmonizing relationships, though you may sometimes go with the flow too easily and lack decisive force.',
  },
  '庚': {
    zh: '庚金日主，如刀剑之金，刚毅果断，锋芒毕露。为人正义感强，有决断力，但有时过于刚硬，容易得罪人。',
    en: 'As a Geng Metal day master, you are like a sharp blade—resolute, decisive, and unafraid to show your edge. You have a strong sense of justice and the courage to act, though your directness can sometimes come across as harsh or confrontational.',
  },
  '辛': {
    zh: '辛金日主，如珠玉之金，精致优雅，内敛含蓄。为人品味高雅，追求完美，但容易挑剔，过于敏感。',
    en: 'As a Xin Metal day master, you are like fine jewelry—elegant, refined, and subtly radiant. You have exquisite taste and pursue perfection in all you do, though you may sometimes be overly critical or sensitive to your surroundings.',
  },
  '壬': {
    zh: '壬水日主，如江河之水，奔流不息，智慧灵动。为人聪明机敏，善于应变，但容易三心二意，缺乏恒心。',
    en: 'As a Ren Water day master, you are like a great river—ever-flowing, wise, and endlessly adaptable. You are sharp-witted and resourceful, thriving in changing circumstances, though you may sometimes lack consistency and scatter your focus.',
  },
  '癸': {
    zh: '癸水日主，如雨露之水，温柔细腻，润物无声。为人直觉敏锐，富有想象力，但容易悲观，缺乏自信。',
    en: 'As a Gui Water day master, you are like gentle rain—soft, nurturing, and quietly transformative. You possess keen intuition and a rich imagination, though you may sometimes lean toward pessimism and struggle with self-confidence.',
  },
};

const WUXING_ADVICE: Record<string, { zh: string; en: string; love: string; loveEn: string; health: string; healthEn: string; advice: string; adviceEn: string }> = {
  '木旺': {
    zh: '木旺之人适合从事创意、教育、文化、设计等行业。事业上宜把握春季良机，多与东方合作。注意避免与金属性行业冲突，如金融、机械等。',
    en: 'Those with strong Wood energy excel in creative, educational, cultural, and design fields. Seize opportunities in spring and seek partnerships in the east. Avoid Metal-dominated industries such as finance and machinery.',
    love: '感情上宜找性格互补之人，金水属性为佳配。木旺者感情丰富，但容易情绪化，需学会控制情绪，避免感情用事。',
    loveEn: 'In relationships, seek a complementary partner—Metal or Water types are ideal matches. While emotionally rich, you must learn to manage your feelings and avoid making decisions purely on emotion.',
    health: '木旺对应肝胆，需注意肝火上炎、眼睛疲劳等问题。宜多食绿色蔬菜，保持规律作息，避免熬夜伤肝。',
    healthEn: 'Strong Wood relates to the liver and gallbladder. Watch for liver heat, eye strain, and irritability. Eat plenty of green vegetables, maintain regular sleep, and avoid staying up late.',
    advice: '木旺宜疏不宜堵。可适当佩戴金属饰品以金克木，或从事与金属性相关的活动来平衡。多接触白色、金色物品有助运势。',
    adviceEn: 'When Wood is strong, it must be channeled rather than suppressed. Wear metal accessories or engage in Metal-related activities to bring balance. Surround yourself with white and gold tones to harmonize your energy.',
  },
  '火旺': {
    zh: '火旺之人适合从事演艺、销售、餐饮、能源等行业。事业上把握夏季良机，多与南方合作。注意避免与水属性行业冲突。',
    en: 'Those with strong Fire energy thrive in performance, sales, hospitality, and energy sectors. Capitalize on summer opportunities and build connections in the south. Steer clear of Water-dominated industries.',
    love: '感情上热情洋溢，容易一见钟情。火旺者需注意控制脾气，避免因冲动而伤害感情。宜找性格温和之人为伴。',
    loveEn: 'Passionate and prone to love at first sight, you must watch your temper to avoid damaging relationships through impulsive words or actions. A gentle and steady partner will balance your intensity.',
    health: '火旺对应心脏小肠，需注意心火亢盛、失眠多梦等问题。宜多食苦味食物如苦瓜，保持心情平和。',
    healthEn: 'Strong Fire relates to the heart and small intestine. Guard against excessive heart fire, insomnia, and vivid dreams. Eat bitter foods like bitter melon and cultivate inner calm.',
    advice: '火旺宜泄不宜堵。可适当接触水属性事物以水平衡，如游泳、接近水源等。多穿黑色、蓝色衣物有助降温。',
    adviceEn: 'When Fire is strong, it must be released rather than contained. Balance yourself with Water elements—swimming, being near water, or wearing black and blue to cool your inner flame.',
  },
  '土旺': {
    zh: '土旺之人适合从事房地产、农业、建筑、管理等行业。事业上把握四季末月良机，多与中央或本地合作。',
    en: 'Those with strong Earth energy are well-suited to real estate, agriculture, construction, and management. Make the most of opportunities at the end of each season and focus on local or central partnerships.',
    love: '感情上稳重踏实，重视家庭。土旺者忠诚可靠，但有时会显得过于沉闷。宜找性格开朗之人为伴，增添生活情趣。',
    loveEn: 'Steady and family-oriented, you are loyal and dependable in love. However, you may sometimes come across as dull or overly serious. A cheerful, lively partner will bring joy and color to your life.',
    health: '土旺对应脾胃，需注意消化不良、湿气重等问题。宜多食黄色食物如小米、南瓜，避免过食生冷。',
    healthEn: 'Strong Earth relates to the spleen and stomach. Watch for digestive issues and dampness. Eat yellow foods like millet and pumpkin, and avoid excessive cold or raw foods.',
    advice: '土旺宜疏不宜壅。可适当从事木属性活动以木疏土，如园艺、徒步等。多接触绿色有助运势流通。',
    adviceEn: 'When Earth is strong, it must be loosened rather than packed tight. Engage in Wood-element activities like gardening or hiking to aerate your energy. Surround yourself with green to keep your fortune flowing.',
  },
  '金旺': {
    zh: '金旺之人适合从事金融、法律、机械、科技等行业。事业上把握秋季良机，多与西方合作。注意避免与火属性行业冲突。',
    en: 'Those with strong Metal energy excel in finance, law, machinery, and technology. Seize autumn opportunities and cultivate western connections. Avoid Fire-dominated industries that may clash with your nature.',
    love: '感情上理性冷静，重承诺守信用。金旺者有时会显得冷漠疏离，需学会表达情感。宜找热情开朗之人为伴。',
    loveEn: 'Rational and composed in love, you value commitment and integrity. Yet you may sometimes seem cold or distant—practice expressing your feelings openly. A warm, outgoing partner will melt your reserve.',
    health: '金旺对应肺大肠，需注意呼吸系统、皮肤干燥等问题。宜多食白色食物如百合、银耳，注意保暖防燥。',
    healthEn: 'Strong Metal relates to the lungs and large intestine. Protect your respiratory system and watch for dry skin. Eat white foods like lily bulbs and tremella, and keep warm to prevent dryness.',
    advice: '金旺宜柔不宜刚。可适当从事火属性活动以火炼金，如运动、社交等。多穿红色、紫色衣物有助柔和。',
    adviceEn: 'When Metal is strong, it must be softened rather than hardened further. Temper yourself with Fire-element activities like exercise and socializing. Wear red or purple to cultivate warmth and flexibility.',
  },
  '水旺': {
    zh: '水旺之人适合从事物流、旅游、咨询、传媒等行业。事业上把握冬季良机，多与北方合作。注意避免与土属性行业冲突。',
    en: 'Those with strong Water energy thrive in logistics, travel, consulting, and media. Capitalize on winter opportunities and build networks in the north. Avoid Earth-dominated industries that may dam your flow.',
    love: '感情上温柔多情，富有浪漫气质。水旺者情感丰富但容易患得患失，需增强安全感。宜找稳重踏实之人为伴。',
    loveEn: 'Gentle, romantic, and deeply feeling, you bring poetry to love. Yet your emotional richness can lead to anxiety and insecurity. A steady, grounded partner will provide the anchor you need.',
    health: '水旺对应肾膀胱，需注意肾脏保养、腰膝酸软等问题。宜多食黑色食物如黑芝麻、黑豆，避免过度劳累。',
    healthEn: 'Strong Water relates to the kidneys and bladder. Take care of your kidney health and watch for lower back or knee weakness. Eat black foods like black sesame and black beans, and avoid overexertion.',
    advice: '水旺宜导不宜塞。可适当从事土属性活动以土制水，如陶艺、登山等。多穿黄色、棕色衣物有助稳固。',
    adviceEn: 'When Water is strong, it must be guided rather than blocked. Engage in Earth-element activities like pottery or hiking to give your energy solid banks. Wear yellow or brown to cultivate stability.',
  },
};

export function generateDetailedReading(
  dayGan: string,
  wuxingCounts: Record<string, number>
): BaziReading {
  const p = DAY_GAN_PERSONALITY[dayGan] || DAY_GAN_PERSONALITY['甲'];

  // Determine dominant element
  let maxCount = 0;
  let dominant = '木';
  const elements: Record<string, string> = { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' };
  for (const [key, count] of Object.entries(wuxingCounts)) {
    if (count > maxCount) {
      maxCount = count;
      dominant = elements[key] || '木';
    }
  }

  const a = WUXING_ADVICE[`${dominant}旺`] || WUXING_ADVICE['木旺'];

  return {
    personality: p.zh,
    personalityEn: p.en,
    career: a.zh,
    careerEn: a.en,
    love: a.love,
    loveEn: a.loveEn,
    health: a.health,
    healthEn: a.healthEn,
    advice: a.advice,
    adviceEn: a.adviceEn,
  };
}
