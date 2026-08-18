import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import CyberBackground from '../components/CyberBackground';
import NeonButton from '../components/NeonButton';
import BackButton from '../components/BackButton';
import type { FortuneResult } from '../types';

const FORTUNES: FortuneResult[] = [
  {
    level: 'supreme',
    title: '上上签', titleEn: 'Supreme Fortune',
    poem: '春风得意马蹄疾，一日看尽长安花。', poemEn: 'Riding swiftly with the spring breeze, seeing all the flowers of Chang\'an in one day.',
    interpretation: '时运亨通，万事如意。此刻正是你大展宏图的最佳时机，放心前行，必有收获。', interpretationEn: 'Great fortune is upon you. This is the perfect time to pursue your goals with confidence.',
  },
  {
    level: 'great',
    title: '大吉', titleEn: 'Great Luck',
    poem: '大鹏一日同风起，扶摇直上九万里。', poemEn: 'The roc soars with the wind, rising ninety thousand li into the sky.',
    interpretation: '鸿运当头，诸事顺遂。你的努力即将得到回报，继续保持，成功在望。', interpretationEn: 'Good fortune is shining upon you. Your efforts will be rewarded; keep going.',
  },
  {
    level: 'good',
    title: '中吉', titleEn: 'Good Luck',
    poem: '山重水复疑无路，柳暗花明又一村。', poemEn: 'After endless mountains and rivers, doubt no road; then willows dark, flowers bright, another village.',
    interpretation: '困境将过，转机已现。坚持下去，前方有新的机遇等待着你。', interpretationEn: 'Difficulties are passing. New opportunities await if you persist.',
  },
  {
    level: 'neutral',
    title: '平签', titleEn: 'Neutral',
    poem: '行到水穷处，坐看云起时。', poemEn: 'Walk to where the water ends, sit and watch the clouds rise.',
    interpretation: '运势平稳，无大起大落。此时宜静观其变，等待时机。', interpretationEn: 'Fortune is stable. It is a good time to observe and wait for the right moment.',
  },
  {
    level: 'bad',
    title: '凶', titleEn: 'Bad Luck',
    poem: '欲渡黄河冰塞川，将登太行雪满山。', poemEn: 'Want to cross the Yellow River but ice blocks the way; want to climb Mount Taihang but snow fills the mountain.',
    interpretation: '运势低迷，行事需谨慎。此时不宜冒进，宜韬光养晦，等待时机好转。', interpretationEn: 'Fortune is low. Proceed with caution and wait for better times.',
  },
  {
    level: 'terrible',
    title: '大凶', titleEn: 'Terrible Luck',
    poem: '黑云压城城欲摧，甲光向日金鳞开。', poemEn: 'Dark clouds press upon the city, but armor glints like golden scales in the sun.',
    interpretation: '逆境之中，唯有坚韧方能破局。黑暗之后必有光明，保持信念。', interpretationEn: 'In adversity, only perseverance can break through. Light follows darkness; keep faith.',
  },
];

const LEVEL_COLORS: Record<string, { bg: string; border: string; text: string; glow: string; accent: string }> = {
  supreme: { bg: 'from-amber-900/50 to-yellow-900/50', border: 'border-amber-400/60', text: 'text-amber-300', glow: 'neon-glow-gold', accent: '#fbbf24' },
  great:   { bg: 'from-red-900/50 to-orange-900/50',   border: 'border-red-400/60',   text: 'text-red-300',   glow: 'text-red-300',   accent: '#f87171' },
  good:    { bg: 'from-orange-900/50 to-yellow-900/50', border: 'border-orange-400/60', text: 'text-orange-300', glow: 'text-orange-300', accent: '#fb923c' },
  neutral: { bg: 'from-gray-800/50 to-slate-800/50',    border: 'border-gray-400/50',  text: 'text-gray-300',  glow: 'text-gray-300',  accent: '#9ca3af' },
  bad:     { bg: 'from-blue-900/50 to-gray-900/50',     border: 'border-blue-400/50',  text: 'text-blue-300',  glow: 'text-blue-300',  accent: '#60a5fa' },
  terrible:{ bg: 'from-purple-900/50 to-indigo-900/50',  border: 'border-purple-400/50', text: 'text-purple-300', glow: 'text-purple-300', accent: '#a78bfa' },
};

/* ---------- confetti / sparkle system ---------- */
interface Sparkle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotSpeed: number;
  life: number;
  maxLife: number;
  shape: 'circle' | 'star' | 'diamond';
}

function createConfetti(count: number, centerX: number, centerY: number): Sparkle[] {
  const colors = ['#fbbf24', '#f59e0b', '#ef4444', '#f97316', '#fde047', '#ffffff'];
  return Array.from({ length: count }).map((_, i) => {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
    const speed = 2 + Math.random() * 6;
    const shapes: Sparkle['shape'][] = ['circle', 'star', 'diamond'];
    return {
      id: i,
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: 3 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      life: 0,
      maxLife: 40 + Math.random() * 50,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    };
  });
}

function ConfettiCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Sparkle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;
    canvas.width = rect.width;
    canvas.height = rect.height;

    particlesRef.current = createConfetti(80, canvas.width / 2, canvas.height / 2);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particlesRef.current.forEach((p) => {
        if (p.life >= p.maxLife) return;
        alive = true;
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.vx *= 0.98;
        p.rotation += p.rotSpeed;

        const progress = p.life / p.maxLife;
        const alpha = 1 - progress;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * (1 - progress * 0.3), 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'star') {
          const spikes = 4;
          const outer = p.size;
          const inner = p.size * 0.4;
          ctx.beginPath();
          for (let s = 0; s < spikes * 2; s++) {
            const r = s % 2 === 0 ? outer : inner;
            const a = (s * Math.PI) / spikes;
            if (s === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
            else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }

        ctx.restore();
      });

      if (alive) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-30"
    />
  );
}

export default function FortuneDraw() {
  const { t, i18n } = useTranslation();
  const [isShaking, setIsShaking] = useState(false);
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [stickVisible, setStickVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const isZh = i18n.language === 'zh';

  const handleShake = () => {
    setIsShaking(true);
    setResult(null);
    setStickVisible(false);
    setShowConfetti(false);
    setTimeout(() => {
      setIsShaking(false);
      setStickVisible(true);
    }, 1800);
  };

  const handleDraw = () => {
    const random = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    setResult(random);
    if (['supreme', 'great', 'good'].includes(random.level)) {
      setShowConfetti(true);
    }
  };

  const handleAgain = () => {
    setResult(null);
    setStickVisible(false);
    setShowConfetti(false);
  };

  const colors = result ? LEVEL_COLORS[result.level] : null;
  const isGoodFortune = result ? ['supreme', 'great', 'good'].includes(result.level) : false;

  return (
    <div className="min-h-[100dvh] relative">
      <CyberBackground color="#1a0a00" particleColor="#daa520" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-4 py-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-3xl md:text-5xl font-bold neon-glow-gold text-draw-gold mb-2">
            {t('fortuneDraw.title')}
          </h1>
          <p className="text-draw-text/60 text-sm tracking-widest">{t('fortuneDraw.subtitle')}</p>
        </motion.div>

        <div className="w-full max-w-lg flex flex-col items-center">
          {/* ---------- Fortune Tube & Stick Scene ---------- */}
          <div
            className="relative mb-10 h-72 flex items-center justify-center w-full"
            style={{ perspective: 900 }}
          >
            {/* Tube shadow */}
            <motion.div
              animate={{ opacity: isShaking ? 0.3 : 0.5, scaleX: isShaking ? 1.1 : 1 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-24 h-4 rounded-[100%] bg-black blur-md"
            />

            {/* The ornate tube (签筒) */}
            <motion.div
              animate={
                isShaking
                  ? {
                      rotateZ: [0, -18, 16, -14, 12, -10, 8, -6, 4, -2, 0],
                      x: [0, -14, 12, -10, 8, -6, 4, -2, 1, 0],
                      y: [0, -4, -6, -4, -2, 0],
                    }
                  : stickVisible && !result
                    ? { rotateZ: [-8, -6, -8], x: [6, 4, 6] }
                    : result
                      ? { rotateZ: 0, x: 0, y: 0 }
                      : {}
              }
              transition={
                isShaking
                  ? { duration: 1.6, ease: 'easeInOut' }
                  : stickVisible && !result
                    ? { duration: 1.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
                    : { duration: 0.5 }
              }
              className="relative w-24 h-52 md:w-28 md:h-60"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Tube body - cylindrical look */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-amber-600/50"
                style={{
                  background:
                    'linear-gradient(180deg, #4a0f0f 0%, #7a1a1a 15%, #9a2222 30%, #7a1a1a 50%, #5a1212 70%, #3a0a0a 100%)',
                  boxShadow:
                    'inset -8px 0 16px rgba(0,0,0,0.5), inset 4px 0 8px rgba(255,180,100,0.15), 0 8px 24px rgba(0,0,0,0.5)',
                }}
              >
                {/* Gold Chinese pattern bands */}
                <div className="absolute top-3 left-0 right-0 h-5 border-y border-amber-500/40"
                  style={{
                    background:
                      'repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(251,191,36,0.25) 6px, rgba(251,191,36,0.25) 8px, transparent 8px, transparent 14px)',
                  }}
                />
                <div className="absolute bottom-3 left-0 right-0 h-5 border-y border-amber-500/40"
                  style={{
                    background:
                      'repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(251,191,36,0.25) 6px, rgba(251,191,36,0.25) 8px, transparent 8px, transparent 14px)',
                  }}
                />

                {/* Middle decorative emblem */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 border-amber-500/30 flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(circle, rgba(90,15,15,0.8) 0%, transparent 70%)',
                  }}
                >
                  <span className="text-amber-400/80 text-lg font-serif">签</span>
                </div>

                {/* Vertical gold line highlights */}
                <div className="absolute top-0 bottom-0 left-3 w-px bg-gradient-to-b from-transparent via-amber-400/20 to-transparent" />
                <div className="absolute top-0 bottom-0 right-3 w-px bg-gradient-to-b from-transparent via-amber-400/20 to-transparent" />
              </div>

              {/* Tube rim (top opening) */}
              <div
                className="absolute -top-1.5 left-0 right-0 h-5 rounded-t-full border-2 border-amber-500/50"
                style={{
                  background:
                    'linear-gradient(180deg, #b8860b 0%, #daa520 30%, #8b6914 100%)',
                  boxShadow: '0 -2px 8px rgba(218,165,32,0.3)',
                }}
              >
                {/* Inner hollow */}
                <div
                  className="absolute top-1 left-2 right-2 h-2.5 rounded-t-full"
                  style={{ background: 'linear-gradient(180deg, #1a0500 0%, #3a0a0a 100%)' }}
                />
              </div>

              {/* Tube bottom base */}
              <div
                className="absolute -bottom-1.5 left-1 right-1 h-4 rounded-b-xl border-x border-b border-amber-600/40"
                style={{
                  background:
                    'linear-gradient(180deg, #5a1212 0%, #3a0a0a 100%)',
                }}
              />

              {/* Sticks visible inside tube */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex justify-center gap-[2px] w-16 overflow-hidden"
                style={{ height: '3.5rem' }}
              >
                {[...Array(14)].map((_, i) => (
                  <div
                    key={i}
                    className="w-[5px] rounded-t-sm"
                    style={{
                      height: `${18 + Math.random() * 14}px`,
                      background:
                        'linear-gradient(180deg, #d4a855 0%, #c49a45 50%, #8b6914 100%)',
                      marginTop: `${Math.random() * 8}px`,
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* ---------- The drawn bamboo stick ---------- */}
            <AnimatePresence>
              {stickVisible && !result && (
                <motion.div
                  initial={{ y: 60, opacity: 0, rotateZ: -15 }}
                  animate={{ y: -110, opacity: 1, rotateZ: -5 }}
                  exit={{ y: -180, opacity: 0, rotateZ: 0 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.1 }}
                  className="absolute left-1/2 -translate-x-1/2 top-1/2"
                >
                  {/* Bamboo stick body */}
                  <div
                    className="relative w-4 h-44 md:h-52 rounded-t-lg rounded-b-sm border border-amber-600/40 overflow-hidden"
                    style={{
                      background:
                        'linear-gradient(90deg, #c49a45 0%, #e8c86a 20%, #f0d880 40%, #e8c86a 60%, #c49a45 80%, #a07830 100%)',
                      boxShadow:
                        '2px 2px 8px rgba(0,0,0,0.4), inset -1px 0 2px rgba(255,255,255,0.3)',
                    }}
                  >
                    {/* Bamboo joint lines */}
                    <div className="absolute top-6 left-0 right-0 h-px bg-amber-800/30" />
                    <div className="absolute top-14 left-0 right-0 h-px bg-amber-800/30" />
                    <div className="absolute top-22 left-0 right-0 h-px bg-amber-800/30" />
                    <div className="absolute top-30 left-0 right-0 h-px bg-amber-800/30" />

                    {/* Calligraphy text on stick */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                      <span className="text-amber-900/70 text-xs font-serif writing-vertical"
                        style={{ writingMode: 'vertical-rl' }}
                      >
                        运
                      </span>
                    </div>

                    {/* Top red seal */}
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-sm border border-red-700/50 bg-red-800/20 flex items-center justify-center">
                      <span className="text-[6px] text-red-800/60">吉</span>
                    </div>
                  </div>

                  {/* Stick tip highlight */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-200/60" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ---------- Result Card (replaces the stick) ---------- */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ y: -80, opacity: 0, scale: 0.6, rotateZ: -8 }}
                  animate={{ y: -100, opacity: 1, scale: 1, rotateZ: -3 }}
                  exit={{ y: -200, opacity: 0, scale: 0.5 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="absolute left-1/2 -translate-x-1/2 top-1/2 z-20"
                >
                  <div
                    className="relative w-16 h-48 md:h-56 rounded-t-lg rounded-b-sm border-2 overflow-hidden"
                    style={{
                      background:
                        'linear-gradient(90deg, #c49a45 0%, #e8c86a 25%, #f0d880 50%, #e8c86a 75%, #a07830 100%)',
                      borderColor: 'rgba(180,130,40,0.6)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                    }}
                  >
                    {/* Fortune level stamp */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 ${colors?.border ?? ''}`}
                        style={{
                          background: 'rgba(255,255,255,0.15)',
                          borderColor: colors?.accent ?? '#ccc',
                        }}
                      >
                        <span className={`text-sm font-bold ${colors?.text ?? ''}`}>
                          {isZh ? result.title.charAt(0) : '吉'}
                        </span>
                      </div>
                      <span
                        className="text-amber-900/60 text-[10px] font-serif"
                        style={{ writingMode: 'vertical-rl' }}
                      >
                        {isZh ? result.title : result.titleEn}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ---------- Controls ---------- */}
          <div className="flex gap-4 mb-8">
            {!stickVisible && !result && (
              <NeonButton onClick={handleShake} color="gold" disabled={isShaking}>
                {isShaking ? '...' : t('fortuneDraw.shake')}
              </NeonButton>
            )}
            {stickVisible && !result && (
              <NeonButton onClick={handleDraw} color="gold">
                {t('fortuneDraw.draw')}
              </NeonButton>
            )}
            {result && (
              <NeonButton onClick={handleAgain} color="gold">
                {t('fortuneDraw.drawAgain')}
              </NeonButton>
            )}
          </div>

          {/* ---------- Fortune Result Display ---------- */}
          <div className="w-full relative">
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  className="w-full relative"
                >
                  {/* Confetti overlay */}
                  <ConfettiCanvas active={showConfetti} />

                  {/* Traditional fortune paper */}
                  <div
                    className={`relative bg-gradient-to-br ${colors?.bg ?? ''} backdrop-blur-md rounded-2xl overflow-hidden`}
                    style={{
                      border: '2px solid',
                      borderColor: colors?.accent ? `${colors.accent}60` : 'rgba(255,255,255,0.2)',
                      boxShadow: isGoodFortune
                        ? `0 0 40px ${colors?.accent ?? '#fff'}30, inset 0 0 60px rgba(0,0,0,0.3)`
                        : '0 8px 32px rgba(0,0,0,0.4), inset 0 0 60px rgba(0,0,0,0.3)',
                    }}
                  >
                    {/* Top ornamental border */}
                    <div className="absolute top-0 left-0 right-0 h-2"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${colors?.accent ?? '#fff'}40, transparent)`,
                      }}
                    />

                    {/* Corner ornaments */}
                    {[
                      { t: 'top-3', l: 'left-3', bt: 'border-t', bl: 'border-l' },
                      { t: 'top-3', l: 'right-3', bt: 'border-t', bl: 'border-r' },
                      { t: 'bottom-3', l: 'left-3', bt: 'border-b', bl: 'border-l' },
                      { t: 'bottom-3', l: 'right-3', bt: 'border-b', bl: 'border-r' },
                    ].map((c, i) => (
                      <div
                        key={i}
                        className={`absolute ${c.t} ${c.l} w-5 h-5 ${c.bt} ${c.bl}`}
                        style={{ borderColor: colors?.accent ? `${colors.accent}50` : 'rgba(255,255,255,0.2)' }}
                      />
                    ))}

                    <div className="p-6 md:p-8 text-center relative">
                      {/* Fortune level badge */}
                      <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 250, damping: 15 }}
                        className="inline-block px-8 py-2.5 rounded-full border-2 mb-5"
                        style={{
                          background: 'rgba(0,0,0,0.35)',
                          borderColor: colors?.accent ? `${colors.accent}60` : 'rgba(255,255,255,0.2)',
                          boxShadow: isGoodFortune
                            ? `0 0 20px ${colors?.accent ?? '#fff'}25`
                            : 'none',
                        }}
                      >
                        <span className={`font-display text-2xl md:text-3xl font-bold ${colors?.text ?? ''} ${colors?.glow ?? ''}`}>
                          {isZh ? result.title : result.titleEn}
                        </span>
                      </motion.div>

                      {/* Poem section */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="mb-5"
                      >
                        <div className="flex items-center justify-center gap-3 mb-3">
                          <div className="w-10 h-px opacity-30" style={{ background: colors?.accent }} />
                          <span className="text-xs tracking-[0.3em] uppercase opacity-50" style={{ color: colors?.accent }}>
                            Poem
                          </span>
                          <div className="w-10 h-px opacity-30" style={{ background: colors?.accent }} />
                        </div>
                        <p className={`font-serif text-lg md:text-xl leading-relaxed ${colors?.text ?? ''}`}>
                          {isZh ? result.poem : result.poemEn}
                        </p>
                      </motion.div>

                      {/* Divider */}
                      <div className="flex items-center justify-center gap-2 mb-5">
                        <div className="w-12 h-px bg-white/15" />
                        <div className="w-1.5 h-1.5 rotate-45 border border-white/20" />
                        <div className="w-12 h-px bg-white/15" />
                      </div>

                      {/* Interpretation */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                      >
                        <div className="flex items-center justify-center gap-3 mb-3">
                          <div className="w-10 h-px opacity-30" style={{ background: colors?.accent }} />
                          <span className="text-xs tracking-[0.3em] uppercase opacity-50" style={{ color: colors?.accent }}>
                            Interpretation
                          </span>
                          <div className="w-10 h-px opacity-30" style={{ background: colors?.accent }} />
                        </div>
                        <p className="text-white/75 text-sm md:text-base leading-relaxed">
                          {isZh ? result.interpretation : result.interpretationEn}
                        </p>
                      </motion.div>
                    </div>

                    {/* Bottom ornamental border */}
                    <div className="absolute bottom-0 left-0 right-0 h-2"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${colors?.accent ?? '#fff'}40, transparent)`,
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <BackButton />
    </div>
  );
}
