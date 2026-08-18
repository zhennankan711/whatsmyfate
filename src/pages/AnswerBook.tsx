import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import CyberBackground from '../components/CyberBackground';
import NeonButton from '../components/NeonButton';
import BackButton from '../components/BackButton';

const ANSWERS = [
  { zh: '是的，毫无疑问', en: 'Yes, without a doubt' },
  { zh: '现在还不是时候', en: 'Not the right time' },
  { zh: '相信你的直觉', en: 'Trust your intuition' },
  { zh: '结果会超出你的预期', en: 'It will exceed your expectations' },
  { zh: '你需要更多的耐心', en: 'You need more patience' },
  { zh: '放手让它自然发生', en: 'Let it happen naturally' },
  { zh: '答案就在你心中', en: 'The answer is within you' },
  { zh: '这是一个新的开始', en: 'This is a new beginning' },
  { zh: '不要被表象迷惑', en: "Don't be fooled by appearances" },
  { zh: '一切都会好起来的', en: 'Everything will be fine' },
  { zh: '重新审视你的选择', en: 'Re-examine your choices' },
  { zh: '等待更好的时机', en: 'Wait for a better time' },
  { zh: '大胆去做吧', en: 'Go for it boldly' },
  { zh: '这将会是一段旅程', en: 'This will be a journey' },
  { zh: '保持开放的心态', en: 'Keep an open mind' },
  { zh: '你需要休息一下', en: 'You need to take a break' },
  { zh: '命运站在你这边', en: 'Fate is on your side' },
  { zh: '不要急于求成', en: "Don't rush it" },
  { zh: '跟随内心的声音', en: 'Follow your inner voice' },
  { zh: '改变即将到来', en: 'Change is coming' },
];

/* ---------- sparkle particles ---------- */
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

function useParticles(count: number, active: boolean) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }
    const next: Particle[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 0.8,
      duration: 1 + Math.random() * 1.5,
    }));
    setParticles(next);
  }, [count, active]);

  return particles;
}

/* ---------- typewriter hook ---------- */
function useTypewriter(text: string, active: boolean, speed = 45) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    if (!active) {
      setDisplay('');
      return;
    }
    let i = 0;
    setDisplay('');
    const timer = setInterval(() => {
      i += 1;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, active, speed]);

  return display;
}

export default function AnswerBook() {
  const { t, i18n } = useTranslation();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isZh = i18n.language === 'zh';

  const handleAsk = () => {
    setIsOpening(true);
    setAnswer(null);
    setIsOpen(false);
    setTimeout(() => {
      const random = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
      setAnswer(isZh ? random.zh : random.en);
      setIsOpen(true);
      setIsOpening(false);
    }, 2200);
  };

  const handleAgain = () => {
    setAnswer(null);
    setIsOpen(false);
    setQuestion('');
  };

  const typedAnswer = useTypewriter(answer ?? '', isOpen, 55);
  const sparkles = useParticles(28, isOpen);

  return (
    <div className="min-h-[100dvh] relative">
      <CyberBackground color="#050a1a" particleColor="#7eb8ff" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-4 py-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-3xl md:text-5xl font-bold neon-glow-blue text-book-blue mb-2">
            {t('answerBook.title')}
          </h1>
          <p className="text-book-text/60 text-sm tracking-widest">{t('answerBook.subtitle')}</p>
        </motion.div>

        {/* ---------- 3D Book ---------- */}
        <div className="w-full max-w-xl flex flex-col items-center">
          <div
            className="relative mb-8"
            style={{ perspective: 1400 }}
          >
            {/* Floating shadow beneath the book */}
            <motion.div
              animate={{ opacity: isOpen ? 0.25 : 0.4, scale: isOpen ? 1.05 : 1 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-64 h-6 rounded-[100%] bg-black blur-md"
            />

            {/* Entire book group */}
            <motion.div
              animate={{
                rotateY: isOpen ? 0 : isOpening ? [0, -4, 4, -3, 3, 0] : 0,
                rotateX: 0,
                x: isOpen ? '25%' : 0,
              }}
              transition={{
                duration: isOpen ? 1.4 : 0.6,
                ease: isOpen ? 'easeInOut' : 'easeOut',
              }}
              className="relative w-72 h-[28rem] md:w-80 md:h-[32rem] mx-auto"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* ---- BOOK SPINE (left edge) ---- */}
              <div
                className="absolute left-0 top-1 bottom-1 w-6 rounded-l-md"
                style={{
                  background:
                    'linear-gradient(90deg, #3a1c0a 0%, #5c2e0e 30%, #3a1c0a 70%, #1f0d04 100%)',
                  transform: 'rotateY(-90deg) translateX(-3px)',
                  transformOrigin: 'left center',
                }}
              >
                {/* Spine ridges */}
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 h-px bg-amber-900/60"
                    style={{ top: `${18 + i * 22}%` }}
                  />
                ))}
              </div>

              {/* ---- BACK COVER ---- */}
              <div
                className="absolute inset-0 rounded-r-xl rounded-l-sm"
                style={{
                  background:
                    'linear-gradient(135deg, #2a1408 0%, #3d1f0b 50%, #2a1408 100%)',
                  transform: 'translateZ(-12px)',
                }}
              />

              {/* ---- PAGES (thick block) ---- */}
              <div
                className="absolute top-1 right-1 bottom-1 rounded-r-lg"
                style={{
                  left: 6,
                  background:
                    'repeating-linear-gradient(90deg, #e8dcc8 0px, #f2ead8 1px, #dccfb5 2px)',
                  transform: 'translateZ(-6px)',
                }}
              >
                {/* Gold page edges */}
                <div className="absolute inset-y-0 right-0 w-1.5 bg-gradient-to-l from-amber-300/60 to-transparent rounded-r-lg" />
                <div className="absolute inset-y-0 left-0 w-px bg-amber-700/30" />
              </div>

              {/* ---- FRONT COVER ---- */}
              <motion.div
                animate={{ rotateY: isOpen ? -180 : isOpening ? [0, -8, 0, -5, 0] : 0 }}
                transition={{
                  duration: isOpen ? 1.6 : 0.5,
                  ease: isOpen ? [0.25, 1, 0.5, 1] : 'easeOut',
                }}
                className="absolute inset-0 rounded-r-xl rounded-l-sm origin-left"
                style={{
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* Cover front face */}
                <div
                  className="absolute inset-0 rounded-r-xl rounded-l-sm overflow-hidden"
                  style={{
                    background:
                      'linear-gradient(135deg, #3d1f0b 0%, #5a2d0e 25%, #3d1f0b 50%, #2a1408 75%, #1f0d04 100%)',
                    boxShadow:
                      'inset 2px 0 8px rgba(0,0,0,0.6), inset -1px 0 4px rgba(255,215,150,0.08)',
                  }}
                >
                  {/* Leather texture overlay */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        'radial-gradient(ellipse at 30% 20%, rgba(255,200,120,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(0,0,0,0.3) 0%, transparent 50%)',
                    }}
                  />

                  {/* Gold border frame */}
                  <div className="absolute inset-3 md:inset-4 border border-amber-600/40 rounded-lg pointer-events-none" />
                  <div className="absolute inset-4 md:inset-5 border border-amber-500/20 rounded-md pointer-events-none" />

                  {/* Corner ornaments */}
                  {[
                    { t: 'top-3', l: 'left-3', bt: 'border-t', bl: 'border-l' },
                    { t: 'top-3', l: 'right-3', bt: 'border-t', bl: 'border-r' },
                    { t: 'bottom-3', l: 'left-3', bt: 'border-b', bl: 'border-l' },
                    { t: 'bottom-3', l: 'right-3', bt: 'border-b', bl: 'border-r' },
                  ].map((c, i) => (
                    <div
                      key={i}
                      className={`absolute ${c.t} ${c.l} w-5 h-5 ${c.bt} ${c.bl} border-amber-500/50`}
                    />
                  ))}

                  {/* Center medallion */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                    <motion.div
                      animate={{ opacity: isOpening ? [1, 0.4, 1] : 1 }}
                      transition={{ duration: 1.2, repeat: isOpening ? Infinity : 0 }}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-amber-500/50 flex items-center justify-center mb-6"
                      style={{
                        boxShadow:
                          '0 0 20px rgba(201,168,76,0.2), inset 0 0 20px rgba(201,168,76,0.1)',
                      }}
                    >
                      <span className="text-4xl md:text-5xl text-amber-400/80">?</span>
                    </motion.div>
                    <h2 className="font-display text-amber-400/90 text-lg md:text-xl tracking-[0.3em] mb-3">
                      {t('answerBook.title')}
                    </h2>
                    <div className="w-12 h-px bg-amber-500/40 mb-3" />
                    <p className="text-amber-300/50 text-xs text-center tracking-wider leading-relaxed">
                      {t('answerBook.thinking')}
                    </p>
                  </div>
                </div>

                {/* Cover back face (inside cover) */}
                <div
                  className="absolute inset-0 rounded-r-xl rounded-l-sm"
                  style={{
                    background:
                      'linear-gradient(90deg, #e8dcc8 0%, #f2ead8 50%, #e8dcc8 100%)',
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  {/* Inside cover marbled pattern */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        'radial-gradient(ellipse at 20% 30%, rgba(139,90,43,0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(139,90,43,0.2) 0%, transparent 40%)',
                    }}
                  />
                </div>
              </motion.div>

              {/* ---- PAGE CONTENT (visible when open) ---- */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="absolute inset-0 rounded-r-lg rounded-l-sm overflow-hidden"
                    style={{
                      background:
                        'linear-gradient(90deg, #dccfb5 0%, #f2ead8 8%, #f7f1e3 50%, #f2ead8 92%, #dccfb5 100%)',
                      transform: 'translateZ(0.5px)',
                    }}
                  >
                    {/* Paper texture */}
                    <div
                      className="absolute inset-0 opacity-30 pointer-events-none"
                      style={{
                        backgroundImage:
                          'radial-gradient(ellipse at 25% 25%, rgba(139,90,43,0.08) 0%, transparent 50%), radial-gradient(ellipse at 75% 75%, rgba(160,130,80,0.06) 0%, transparent 50%)',
                      }}
                    />

                    {/* Page lines (ruled paper look) */}
                    <div className="absolute inset-x-8 md:inset-x-10 top-16 md:top-20 bottom-16 md:bottom-20 pointer-events-none">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="w-full h-px bg-amber-900/8"
                          style={{ marginTop: i === 0 ? 0 : '1.6rem' }}
                        />
                      ))}
                    </div>

                    {/* Decorative page corners */}
                    <div className="absolute top-3 left-4 w-5 h-5 border-t-2 border-l-2 border-amber-800/25 rounded-tl-sm" />
                    <div className="absolute top-3 right-4 w-5 h-5 border-t-2 border-r-2 border-amber-800/25 rounded-tr-sm" />
                    <div className="absolute bottom-3 left-4 w-5 h-5 border-b-2 border-l-2 border-amber-800/25 rounded-bl-sm" />
                    <div className="absolute bottom-3 right-4 w-5 h-5 border-b-2 border-r-2 border-amber-800/25 rounded-br-sm" />

                    {/* Gold edge on right */}
                    <div className="absolute inset-y-0 right-0 w-2 bg-gradient-to-l from-amber-300/40 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-8 md:px-12 py-10">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="text-center w-full"
                      >
                        {/* Header label */}
                        <div className="text-amber-800/50 text-[10px] md:text-xs font-display tracking-[0.4em] mb-6 uppercase">
                          — The Answer —
                        </div>

                        {/* Decorative divider top */}
                        <div className="flex items-center justify-center gap-2 mb-6">
                          <div className="w-8 h-px bg-amber-800/25" />
                          <div className="w-1.5 h-1.5 rotate-45 border border-amber-800/30" />
                          <div className="w-8 h-px bg-amber-800/25" />
                        </div>

                        {/* Answer text with typewriter */}
                        <div className="min-h-[4rem] flex items-center justify-center">
                          <p className="text-amber-900 text-lg md:text-xl leading-relaxed font-serif text-center">
                            「{typedAnswer}」
                            {typedAnswer.length < (answer?.length ?? 0) && (
                              <span className="inline-block w-0.5 h-5 bg-amber-800/60 ml-0.5 animate-pulse" />
                            )}
                          </p>
                        </div>

                        {/* Decorative divider bottom */}
                        <div className="flex items-center justify-center gap-2 mt-6">
                          <div className="w-8 h-px bg-amber-800/25" />
                          <div className="w-1.5 h-1.5 rotate-45 border border-amber-800/30" />
                          <div className="w-8 h-px bg-amber-800/25" />
                        </div>

                        {/* Page number */}
                        <div className="mt-6 text-amber-800/30 text-xs font-serif">
                          — {Math.floor(Math.random() * 100) + 1} —
                        </div>
                      </motion.div>
                    </div>

                    {/* Sparkle particles */}
                    {sparkles.map((p) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                        transition={{
                          delay: 0.8 + p.delay,
                          duration: p.duration,
                          ease: 'easeOut',
                        }}
                        className="absolute rounded-full bg-amber-300"
                        style={{
                          left: `${p.x}%`,
                          top: `${p.y}%`,
                          width: p.size,
                          height: p.size,
                          boxShadow: `0 0 ${p.size * 2}px rgba(255,215,120,0.8)`,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ---------- Input & Controls ---------- */}
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                className="w-full space-y-4"
              >
                <div className="relative">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={t('answerBook.placeholder')}
                    className="w-full px-4 py-3.5 rounded-lg bg-black/40 border border-book-blue/25 text-book-text placeholder-book-text/25 focus:border-book-blue/60 focus:outline-none transition-colors text-center backdrop-blur-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                    disabled={isOpening}
                  />
                  {/* Input glow effect */}
                  <div className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300 opacity-0 focus-within:opacity-100"
                    style={{
                      boxShadow: 'inset 0 0 12px rgba(126,184,255,0.1)',
                    }}
                  />
                </div>

                <NeonButton
                  onClick={handleAsk}
                  color="blue"
                  disabled={isOpening}
                  className="w-full"
                >
                  {isOpening
                    ? t('answerBook.thinking')
                    : t('answerBook.ask')}
                </NeonButton>
              </motion.div>
            ) : (
              <motion.div
                key="again"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <NeonButton onClick={handleAgain} color="blue">
                  {t('answerBook.askAgain')}
                </NeonButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <BackButton />
    </div>
  );
}
