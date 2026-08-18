import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import CyberBackground from '../components/CyberBackground';
import NeonButton from '../components/NeonButton';
import BackButton from '../components/BackButton';
import type { BaziResult } from '../types';
import { solarToLunar } from '../data/lunarCalendar';
import { generateDetailedReading } from '../data/baziReadings';

const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const WUXING_MAP: Record<string, string> = {
  '甲': 'wood', '乙': 'wood', '丙': 'fire', '丁': 'fire', '戊': 'earth', '己': 'earth',
  '庚': 'metal', '辛': 'metal', '壬': 'water', '癸': 'water',
  '寅': 'wood', '卯': 'wood', '巳': 'fire', '午': 'fire', '辰': 'earth', '戌': 'earth',
  '丑': 'earth', '未': 'earth', '申': 'metal', '酉': 'metal', '子': 'water', '亥': 'water',
};

const WUXING_COLORS = {
  metal: { bg: 'bg-gray-400/20', text: 'text-gray-300', bar: 'bg-gray-400', label: '金' },
  wood: { bg: 'bg-green-500/20', text: 'text-green-400', bar: 'bg-green-500', label: '木' },
  water: { bg: 'bg-blue-500/20', text: 'text-blue-400', bar: 'bg-blue-500', label: '水' },
  fire: { bg: 'bg-red-500/20', text: 'text-red-400', bar: 'bg-red-500', label: '火' },
  earth: { bg: 'bg-yellow-600/20', text: 'text-yellow-500', bar: 'bg-yellow-600', label: '土' },
};

// Traditional Chinese corner ornament SVG
function CornerOrnament({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const rotations = { tl: 0, tr: 90, bl: -90, br: 180 };
  return (
    <svg
      className={`absolute w-12 h-12 ${position}-0 text-bazi-gold/40`}
      style={{ transform: `rotate(${rotations[position]}deg)` }}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M4 4 L4 20 M4 4 L20 4" />
      <path d="M8 8 L8 16 M8 8 L16 8" />
      <circle cx="4" cy="4" r="2" fill="currentColor" />
    </svg>
  );
}

// Vertical pillar display component
function PillarColumn({ label, value, delay }: { label: string; value: string; delay: number }) {
  const gan = value[0];
  const zhi = value[1];
  const ganWuxing = WUXING_MAP[gan] || 'unknown';
  const zhiWuxing = WUXING_MAP[zhi] || 'unknown';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col items-center"
    >
      {/* Label */}
      <div className="text-bazi-gold/60 text-xs mb-3 tracking-[0.2em] font-display writing-mode-vertical"
        style={{ writingMode: 'vertical-rl' }}
      >
        {label}
      </div>
      {/* Pillar frame */}
      <div className="relative border border-bazi-gold/30 bg-black/50 rounded-lg p-3 min-w-[60px]">
        <div className="absolute -top-px left-2 right-2 h-px bg-gradient-to-r from-transparent via-bazi-gold/50 to-transparent" />
        <div className="absolute -bottom-px left-2 right-2 h-px bg-gradient-to-r from-transparent via-bazi-gold/50 to-transparent" />
        <div className="flex flex-col items-center gap-2">
          <span className={`text-2xl font-display font-bold ${WUXING_COLORS[ganWuxing]?.text || 'text-white'}`}>
            {gan}
          </span>
          <div className="w-4 h-px bg-bazi-gold/30" />
          <span className={`text-2xl font-display font-bold ${WUXING_COLORS[zhiWuxing]?.text || 'text-white'}`}>
            {zhi}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Circular wuxing indicator
function WuxingCircle({ type, count, total, delay }: { type: string; count: number; total: number; delay: number }) {
  const config = WUXING_COLORS[type as keyof typeof WUXING_COLORS] || WUXING_COLORS.metal;
  const percentage = total > 0 ? (count / total) * 100 : 0;
  const circumference = 2 * Math.PI * 22;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 100 }}
      className="flex flex-col items-center"
    >
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 48 48">
          {/* Background circle */}
          <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/5" />
          {/* Progress circle */}
          <motion.circle
            cx="24"
            cy="24"
            r="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ delay: delay + 0.2, duration: 1, ease: 'easeOut' }}
            className={config.text}
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center text-lg font-display font-bold ${config.text}`}>
          {config.label}
        </div>
      </div>
      <div className={`mt-2 text-sm font-display ${config.text}`}>
        {count}
      </div>
    </motion.div>
  );
}

// Scroll unroll animation wrapper
function ScrollReveal({ children, isVisible }: { children: React.ReactNode; isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {/* Scroll top roller */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="h-4 bg-gradient-to-r from-bazi-gold/60 via-bazi-gold to-bazi-gold/60 rounded-full mb-0 shadow-[0_0_15px_rgba(201,168,76,0.3)]"
          />
          {/* Scroll body */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-x border-bazi-gold/20 bg-gradient-to-b from-black/60 via-black/40 to-black/60 backdrop-blur-sm px-4 pb-4 pt-2">
              {children}
            </div>
          </motion.div>
          {/* Scroll bottom roller */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="h-4 bg-gradient-to-r from-bazi-gold/60 via-bazi-gold to-bazi-gold/60 rounded-full mt-0 shadow-[0_0_15px_rgba(201,168,76,0.3)]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function calculateBazi(dateStr: string, hour: number, lunarPrefix: string): BaziResult {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Convert solar to lunar for authentic bazi calculation
  const lunar = solarToLunar(year, month, day);
  const lunarYear = lunar.year;
  const lunarMonth = lunar.month;

  // Year pillar: based on lunar year
  const yearGan = TIANGAN[(lunarYear - 4) % 10];
  const yearZhi = DIZHI[(lunarYear - 4) % 12];

  // Month pillar: simplified by lunar month with year stem offset
  const monthGan = TIANGAN[((lunarYear - 4) % 5) * 2 + (lunarMonth - 1) % 2];
  const monthZhi = DIZHI[(lunarMonth + 1) % 12];

  // Day pillar: based on solar date (standard formula)
  const dayGan = TIANGAN[Math.floor(date.getTime() / 86400000) % 10];
  const dayZhi = DIZHI[Math.floor(date.getTime() / 86400000) % 12];

  // Hour pillar: based on day stem and hour
  const hourGan = TIANGAN[((TIANGAN.indexOf(dayGan) % 5) * 2 + Math.floor(hour / 2)) % 10];
  const hourZhi = DIZHI[Math.floor(hour / 2) % 12];

  const chars = [yearGan, yearZhi, monthGan, monthZhi, dayGan, dayZhi, hourGan, hourZhi];
  const wuxing = chars.map(c => WUXING_MAP[c] || 'unknown');
  const yinyang = chars.map((c) => (TIANGAN.indexOf(c) % 2 === 0 || DIZHI.indexOf(c) % 2 === 0) ? 'yang' : 'yin');

  const wuxingCounts = {
    wood: wuxing.filter(w => w === 'wood').length,
    fire: wuxing.filter(w => w === 'fire').length,
    earth: wuxing.filter(w => w === 'earth').length,
    metal: wuxing.filter(w => w === 'metal').length,
    water: wuxing.filter(w => w === 'water').length,
  };

  const reading = generateDetailedReading(dayGan, wuxingCounts);
  const lunarDateStr = `${lunarPrefix}${lunarYear}年${lunarMonth}月${lunar.day}日`;

  const explanationZh = `此命局五行分布：木${wuxingCounts.wood}、火${wuxingCounts.fire}、土${wuxingCounts.earth}、金${wuxingCounts.metal}、水${wuxingCounts.water}。日柱${dayGan}${dayZhi}为主，${dayGan}属${WUXING_MAP[dayGan] === 'wood' ? '木' : WUXING_MAP[dayGan] === 'fire' ? '火' : WUXING_MAP[dayGan] === 'earth' ? '土' : WUXING_MAP[dayGan] === 'metal' ? '金' : '水'}，性格${WUXING_MAP[dayGan] === 'wood' ? '仁慈正直' : WUXING_MAP[dayGan] === 'fire' ? '热情开朗' : WUXING_MAP[dayGan] === 'earth' ? '稳重踏实' : WUXING_MAP[dayGan] === 'metal' ? '果断坚毅' : '聪慧灵活'}。`;

  const elementNameEn: Record<string, string> = { wood: 'Wood', fire: 'Fire', earth: 'Earth', metal: 'Metal', water: 'Water' };
  const dayGanElementEn = elementNameEn[WUXING_MAP[dayGan]] || 'Wood';
  const personalityTraitEn: Record<string, string> = {
    wood: 'benevolent and upright',
    fire: 'passionate and cheerful',
    earth: 'steady and dependable',
    metal: 'decisive and resolute',
    water: 'intelligent and adaptable',
  };
  const explanationEn = `This chart shows a Five Elements distribution of Wood ${wuxingCounts.wood}, Fire ${wuxingCounts.fire}, Earth ${wuxingCounts.earth}, Metal ${wuxingCounts.metal}, Water ${wuxingCounts.water}. The Day Pillar ${dayGan}${dayZhi} is central, with ${dayGan} belonging to ${dayGanElementEn}, giving a personality that is ${personalityTraitEn[WUXING_MAP[dayGan]] || 'balanced'}.`;

  return {
    year: `${yearGan}${yearZhi}`,
    month: `${monthGan}${monthZhi}`,
    day: `${dayGan}${dayZhi}`,
    hour: `${hourGan}${hourZhi}`,
    wuxing,
    yinyang,
    explanation: explanationZh,
    explanationEn,
    lunarDate: lunarDateStr,
    reading,
  };
}

export default function Bazi() {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language === 'zh';
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthHour, setBirthHour] = useState('12');
  const [result, setResult] = useState<BaziResult | null>(null);
  const [loading, setLoading] = useState(false);

  const birthDate = birthYear && birthMonth && birthDay
    ? `${birthYear.padStart(4, '0')}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`
    : '';

  const handleCalculate = () => {
    if (!birthDate) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(calculateBazi(birthDate, parseInt(birthHour), t('bazi.lunarPrefix')));
      setLoading(false);
    }, 1500);
  };

  const wuxingTotal = result?.wuxing.length || 0;

  return (
    <div className="min-h-[100dvh] relative">
      <CyberBackground color="#0f0505" particleColor="#c9a84c" />

      <div className="relative z-10 flex flex-col items-center px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-bazi-gold/50" />
            <span className="text-bazi-gold/50 text-xs tracking-[0.5em] font-display">{t('bazi.subtitle')}</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-bazi-gold/50" />
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold neon-glow-gold text-bazi-gold tracking-wider">
            {t('bazi.title')}
          </h1>
        </motion.div>

        {/* Input Form - Classical Scroll Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg mb-8"
        >
          <div className="relative bg-gradient-to-b from-black/50 via-[#1a0a0a]/80 to-black/50 backdrop-blur-sm border border-bazi-gold/20 rounded-lg p-1">
            <CornerOrnament position="tl" />
            <CornerOrnament position="tr" />
            <CornerOrnament position="bl" />
            <CornerOrnament position="br" />

            {/* Scroll texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] rounded-lg"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(201,168,76,0.3) 2px,
                  rgba(201,168,76,0.3) 4px
                )`,
              }}
            />

            <div className="relative p-6 md:p-8 space-y-5">
              {/* Title on scroll */}
              <div className="text-center mb-6">
                <span className="text-bazi-gold/70 text-sm tracking-[0.3em] font-display">{t('bazi.title')}</span>
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-bazi-gold/40 to-transparent mx-auto mt-2" />
              </div>

              <div>
                <label className="flex items-center gap-2 text-bazi-gold text-sm mb-2 font-display tracking-wider">
                  <span className="w-1 h-1 rounded-full bg-bazi-gold" />
                  {t('bazi.birthDate')}
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      min="1900"
                      max="2030"
                      placeholder={t('bazi.yearPlaceholder')}
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      className="w-full px-3 py-3 rounded-lg bg-black/60 border border-bazi-gold/20 text-bazi-text focus:border-bazi-gold/60 focus:outline-none transition-colors font-display tracking-wider text-center placeholder:text-white/30"
                    />
                  </div>
                  <span className="text-bazi-gold/40 flex items-center font-display">/</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      min="1"
                      max="12"
                      placeholder={t('bazi.monthPlaceholder')}
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      className="w-full px-3 py-3 rounded-lg bg-black/60 border border-bazi-gold/20 text-bazi-text focus:border-bazi-gold/60 focus:outline-none transition-colors font-display tracking-wider text-center placeholder:text-white/30"
                    />
                  </div>
                  <span className="text-bazi-gold/40 flex items-center font-display">/</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      min="1"
                      max="31"
                      placeholder={t('bazi.dayPlaceholder')}
                      value={birthDay}
                      onChange={(e) => setBirthDay(e.target.value)}
                      className="w-full px-3 py-3 rounded-lg bg-black/60 border border-bazi-gold/20 text-bazi-text focus:border-bazi-gold/60 focus:outline-none transition-colors font-display tracking-wider text-center placeholder:text-white/30"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-bazi-gold text-sm mb-2 font-display tracking-wider">
                  <span className="w-1 h-1 rounded-full bg-bazi-gold" />
                  {t('bazi.birthTime')}
                </label>
                <select
                  value={birthHour}
                  onChange={(e) => setBirthHour(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-black/60 border border-bazi-gold/20 text-bazi-text focus:border-bazi-gold/60 focus:outline-none transition-colors font-display tracking-wider"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
                  ))}
                </select>
              </div>
              <NeonButton onClick={handleCalculate} color="gold" className="w-full" disabled={!birthDate || loading}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-bazi-gold/30 border-t-bazi-gold rounded-full"
                    />
                    {t('common.loading')}
                  </span>
                ) : t('bazi.calculate')}
              </NeonButton>
            </div>
          </div>
        </motion.div>

        {/* Result - Scroll Unroll Animation */}
        <div className="w-full max-w-2xl">
          <ScrollReveal isVisible={!!result}>
            {result && (
              <div className="py-4">
                {/* Lunar Date Display */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mb-4"
                >
                  <span className="text-bazi-gold/60 text-xs tracking-[0.3em]">{result.lunarDate}</span>
                </motion.div>

                {/* Four Pillars */}
                <div className="mb-8">
                  <div className="text-center mb-4">
                    <span className="text-bazi-gold/70 text-xs tracking-[0.5em] font-display">{t('bazi.fourPillars')}</span>
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-bazi-gold/30 to-transparent mx-auto mt-2" />
                  </div>
                  <div className="flex justify-center gap-6 md:gap-10">
                    <PillarColumn label={t('bazi.yearPillar')} value={result.year} delay={0.5} />
                    <PillarColumn label={t('bazi.monthPillar')} value={result.month} delay={0.65} />
                    <PillarColumn label={t('bazi.dayPillar')} value={result.day} delay={0.8} />
                    <PillarColumn label={t('bazi.hourPillar')} value={result.hour} delay={0.95} />
                  </div>
                </div>

                {/* Wuxing Section */}
                <div className="mb-6">
                  <div className="text-center mb-4">
                    <span className="text-bazi-gold/70 text-xs tracking-[0.5em] font-display">{t('bazi.wuxing')}</span>
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-bazi-gold/30 to-transparent mx-auto mt-2" />
                  </div>
                  <div className="flex justify-center gap-4 md:gap-6">
                    {(['metal', 'wood', 'water', 'fire', 'earth'] as const).map((w, i) => (
                      <WuxingCircle
                        key={w}
                        type={w}
                        count={result.wuxing.filter(x => x === w).length}
                        total={wuxingTotal}
                        delay={1.2 + i * 0.1}
                      />
                    ))}
                  </div>
                </div>

                {/* Detailed Reading Sections */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                  className="space-y-5 border-t border-bazi-gold/10 pt-5"
                >
                  {/* Personality */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-px bg-bazi-gold/40" />
                      <span className="text-bazi-gold text-xs tracking-[0.3em] font-display">{t('bazi.personality')}</span>
                    </div>
                    <p className="text-bazi-text/80 text-sm leading-relaxed">{isZh ? result.reading.personality : result.reading.personalityEn}</p>
                  </div>

                  {/* Career */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-px bg-bazi-gold/40" />
                      <span className="text-bazi-gold text-xs tracking-[0.3em] font-display">{t('bazi.career')}</span>
                    </div>
                    <p className="text-bazi-text/80 text-sm leading-relaxed">{isZh ? result.reading.career : result.reading.careerEn}</p>
                  </div>

                  {/* Love */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-px bg-bazi-gold/40" />
                      <span className="text-bazi-gold text-xs tracking-[0.3em] font-display">{t('bazi.love')}</span>
                    </div>
                    <p className="text-bazi-text/80 text-sm leading-relaxed">{isZh ? result.reading.love : result.reading.loveEn}</p>
                  </div>

                  {/* Health */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-px bg-bazi-gold/40" />
                      <span className="text-bazi-gold text-xs tracking-[0.3em] font-display">{t('bazi.health')}</span>
                    </div>
                    <p className="text-bazi-text/80 text-sm leading-relaxed">{isZh ? result.reading.health : result.reading.healthEn}</p>
                  </div>

                  {/* Advice */}
                  <div className="bg-bazi-gold/5 rounded-lg p-4 border border-bazi-gold/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-px bg-bazi-gold/40" />
                      <span className="text-bazi-gold text-xs tracking-[0.3em] font-display">{t('bazi.advice')}</span>
                    </div>
                    <p className="text-bazi-text/80 text-sm leading-relaxed">{isZh ? result.reading.advice : result.reading.adviceEn}</p>
                  </div>
                </motion.div>
              </div>
            )}
          </ScrollReveal>
        </div>
      </div>

      <BackButton />
    </div>
  );
}
