import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CalendarDays, Sparkles, BookOpen, Scroll } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const cards = [
  {
    id: 'bazi',
    icon: CalendarDays,
    color: 'bazi-gold',
    textColor: 'text-bazi-gold',
    gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    borderGradient: 'group-hover:shadow-[0_0_40px_rgba(201,168,76,0.5),inset_0_0_40px_rgba(201,168,76,0.1)]',
    iconAnim: 'group-hover:rotate-12 group-hover:scale-110',
  },
  {
    id: 'tarot',
    icon: Sparkles,
    color: 'tarot-violet',
    textColor: 'text-tarot-violet',
    gradient: 'from-purple-500/20 via-violet-500/10 to-transparent',
    borderGradient: 'group-hover:shadow-[0_0_40px_rgba(178,75,255,0.5),inset_0_0_40px_rgba(178,75,255,0.1)]',
    iconAnim: 'group-hover:rotate-180 group-hover:scale-110',
  },
  {
    id: 'answerBook',
    icon: BookOpen,
    color: 'book-blue',
    textColor: 'text-book-blue',
    gradient: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    borderGradient: 'group-hover:shadow-[0_0_40px_rgba(126,184,255,0.5),inset_0_0_40px_rgba(126,184,255,0.1)]',
    iconAnim: 'group-hover:-translate-y-1 group-hover:scale-110',
  },
  {
    id: 'fortuneDraw',
    icon: Scroll,
    color: 'draw-gold',
    textColor: 'text-draw-gold',
    gradient: 'from-amber-600/20 via-orange-500/10 to-transparent',
    borderGradient: 'group-hover:shadow-[0_0_40px_rgba(218,165,32,0.5),inset_0_0_40px_rgba(218,165,32,0.1)]',
    iconAnim: 'group-hover:translate-y-1 group-hover:scale-110',
  },
];

// CSS keyframe style as a component
function FloatingParticles() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? '#c9a84c' : i % 3 === 1 ? '#00f0ff' : '#b24bff',
            boxShadow: `0 0 ${Math.random() * 6 + 2}px ${i % 3 === 0 ? '#c9a84c' : i % 3 === 1 ? '#00f0ff' : '#b24bff'}`,
          }}
          animate={{
            y: [0, -Math.random() * 100 - 50, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: Math.random() * 6 + 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'easeInOut',
          }}
        />
      ))}
      {/* Floating orbs */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full blur-3xl opacity-10"
          style={{
            width: 200 + i * 50,
            height: 200 + i * 50,
            left: `${20 + i * 20}%`,
            top: `${10 + i * 15}%`,
            background: i % 2 === 0 ? 'radial-gradient(circle, #00f0ff, transparent)' : 'radial-gradient(circle, #b24bff, transparent)',
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.6 }
  }
};

const item = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  }
};

const titleVariants = {
  hidden: { opacity: 0, y: -60, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    }
  }
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.4,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    }
  }
};

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      <FloatingParticles />

      {/* Background grid pattern */}
      <div
        className="fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        variants={titleVariants}
        initial="hidden"
        animate="show"
        className="text-center mb-16 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, type: 'spring', stiffness: 100 }}
          className="mb-4"
        >
          <Sparkles className="inline-block text-cyber-cyan/50 w-8 h-8 mb-2" />
        </motion.div>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-3 tracking-wider">
          <span className="neon-glow-cyan text-cyber-cyan inline-block">
            {t('appTitle')}
          </span>
        </h1>
        <motion.p
          variants={subtitleVariants}
          initial="hidden"
          animate="show"
          className="font-display text-lg md:text-xl text-white/50 tracking-[0.3em]"
        >
          {t('appSubtitle')}
        </motion.p>
        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-32 h-px bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent mx-auto mt-6"
        />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl relative z-10"
      >
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.button
              key={card.id}
              variants={item}
              whileHover={{ scale: 1.04, y: -8 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/' + (card.id === 'answerBook' ? 'answer' : card.id === 'fortuneDraw' ? 'draw' : card.id))}
              className={`group relative flex flex-col items-center p-8 rounded-2xl cursor-pointer text-left
                bg-black/40 backdrop-blur-md
                border border-white/10
                transition-all duration-500
                ${card.borderGradient}
                hover:border-${card.color}/50
              `}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Animated border glow */}
              <div className={`absolute inset-0 rounded-2xl border border-${card.color}/0 group-hover:border-${card.color}/40 transition-all duration-500`} />

              {/* Icon container */}
              <div className={`relative mb-5 p-5 rounded-2xl border border-${card.color}/30 bg-black/60 transition-all duration-500 group-hover:border-${card.color}/60 group-hover:bg-black/80`}>
                <Icon
                  size={36}
                  className={`${card.textColor} transition-transform duration-500 ${card.iconAnim}`}
                  strokeWidth={1.5}
                />
                {/* Icon glow */}
                <div className={`absolute inset-0 rounded-2xl ${card.textColor} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
              </div>

              {/* Title */}
              <h3 className={`relative font-display text-xl md:text-2xl font-semibold ${card.textColor} mb-3 transition-all duration-300 group-hover:tracking-wider`}>
                {t(`home.cards.${card.id === 'answerBook' ? 'answer' : card.id === 'fortuneDraw' ? 'draw' : card.id}.title`)}
              </h3>

              {/* Description */}
              <p className="relative text-white/50 text-sm md:text-base text-center leading-relaxed max-w-[280px]">
                {t(`home.cards.${card.id === 'answerBook' ? 'answer' : card.id === 'fortuneDraw' ? 'draw' : card.id}.desc`)}
              </p>

              {/* Enter indicator */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className={`relative mt-4 flex items-center gap-2 ${card.textColor} opacity-0 group-hover:opacity-100 transition-all duration-300`}
              >
                <span className="text-xs tracking-[0.2em] font-display">ENTER</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-sm"
                >
                  →
                </motion.span>
              </motion.div>

              {/* Corner decorations */}
              <div className={`absolute top-3 left-3 w-6 h-6 border-t border-l border-${card.color}/0 group-hover:border-${card.color}/40 transition-all duration-500 rounded-tl-lg`} />
              <div className={`absolute top-3 right-3 w-6 h-6 border-t border-r border-${card.color}/0 group-hover:border-${card.color}/40 transition-all duration-500 rounded-tr-lg`} />
              <div className={`absolute bottom-3 left-3 w-6 h-6 border-b border-l border-${card.color}/0 group-hover:border-${card.color}/40 transition-all duration-500 rounded-bl-lg`} />
              <div className={`absolute bottom-3 right-3 w-6 h-6 border-b border-r border-${card.color}/0 group-hover:border-${card.color}/40 transition-all duration-500 rounded-br-lg`} />
            </motion.button>
          );
        })}
      </motion.div>

      {/* Bottom decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-16 relative z-10 text-center"
      >
        <div className="flex items-center justify-center gap-4 text-white/20">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-white/20" />
          <span className="text-xs tracking-[0.4em] font-display">CYBER DIVINATION v1.0</span>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-white/20" />
        </div>
      </motion.div>
    </div>
  );
}
