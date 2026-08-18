import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import CyberBackground from '../components/CyberBackground';
import NeonButton from '../components/NeonButton';
import BackButton from '../components/BackButton';
import TarotCardFace, { TarotCardBack } from '../components/TarotCardFace';
import { TAROT_DECK } from '../data/tarotDeck';
import type { TarotCard } from '../types';

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Tarot() {
  const { t, i18n } = useTranslation();
  const [deck, setDeck] = useState<TarotCard[]>(() => shuffleArray(TAROT_DECK));
  const [drawnCards, setDrawnCards] = useState<(TarotCard | null)[]>([null, null, null]);
  const [currentSlot, setCurrentSlot] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'shuffling' | 'selecting' | 'revealed'>('idle');
  // Each slot independently tracks if it has been flipped face-up
  const [flippedSlots, setFlippedSlots] = useState<boolean[]>([false, false, false]);
  const [slotFlipping, setSlotFlipping] = useState<boolean[]>([false, false, false]);
  const isZh = i18n.language === 'zh';

  const shuffleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-shuffle on first mount
  useEffect(() => {
    handleShuffle();
    return () => {
      if (shuffleTimeoutRef.current) {
        clearTimeout(shuffleTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShuffle = useCallback(() => {
    // 清除之前的 timeout，防止竞态
    if (shuffleTimeoutRef.current) {
      clearTimeout(shuffleTimeoutRef.current);
      shuffleTimeoutRef.current = null;
    }
    setGameState('shuffling');
    setDrawnCards([null, null, null]);
    setCurrentSlot(0);
    setFlippedSlots([false, false, false]);
    setSlotFlipping([false, false, false]);
    shuffleTimeoutRef.current = setTimeout(() => {
      setDeck(shuffleArray(TAROT_DECK));
      setGameState('selecting');
      shuffleTimeoutRef.current = null;
    }, 1500);
  }, []);

  const handlePickCard = useCallback((deckIndex: number) => {
    if (gameState !== 'selecting' || currentSlot >= 3) return;
    if (deckIndex < 0 || deckIndex >= deck.length) return;
    // Prevent picking next card while previous flip animation is running
    if (slotFlipping.some(f => f)) return;

    const newDeck = [...deck];
    const removed = newDeck.splice(deckIndex, 1);
    if (removed.length === 0) return;
    const card = removed[0];
    card.isReversed = Math.random() < 0.3;

    const newDrawn = [...drawnCards];
    newDrawn[currentSlot] = card;
    setDeck(newDeck);
    setDrawnCards(newDrawn);

    // Start flipping this slot independently
    const newFlipping = [...slotFlipping];
    newFlipping[currentSlot] = true;
    setSlotFlipping(newFlipping);

    const nextSlot = currentSlot + 1;
    setCurrentSlot(nextSlot);

    // After flip animation completes, mark as permanently flipped
    setTimeout(() => {
      const newFlipped = [...flippedSlots];
      newFlipped[currentSlot] = true;
      setFlippedSlots(newFlipped);

      const newFlipping2 = [...slotFlipping];
      newFlipping2[currentSlot] = false;
      setSlotFlipping(newFlipping2);

      if (nextSlot >= 3) {
        setGameState('revealed');
      }
    }, 1000);
  }, [gameState, currentSlot, deck, drawnCards, flippedSlots, slotFlipping]);


  // Generate half-circle (semicircle) fan positions
  const getFanStyle = (index: number, total: number) => {
    // Distribute cards evenly across a 160-degree arc (almost semicircle)
    const angleRange = 160;
    const angle = -angleRange / 2 + (angleRange / Math.max(total - 1, 1)) * index;
    // Spread them out more horizontally
    const spreadX = Math.sin((angle * Math.PI) / 180) * 140;
    const spreadY = Math.abs(Math.cos((angle * Math.PI) / 180) - 1) * 40;
    return {
      left: `calc(50% + ${spreadX}px - 28px)`,
      bottom: `${10 + spreadY}px`,
      transform: `rotate(${angle}deg)`,
      transformOrigin: 'bottom center',
      zIndex: index,
    };
  };

  const positionLabels = [t('tarot.past'), t('tarot.present'), t('tarot.future')];
  const hintText = [
    t('tarot.hintPast'),
    t('tarot.hintPresent'),
    t('tarot.hintFuture'),
  ];

  return (
    <div className="min-h-[100dvh] relative">
      <CyberBackground color="#0d001a" particleColor="#b24bff" />

      <div className="relative z-10 flex flex-col items-center px-4 py-6 md:py-10">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4">
          <h1 className="font-display text-3xl md:text-5xl font-bold neon-glow-violet text-tarot-violet mb-1">
            {t('tarot.title')}
          </h1>
          <p className="text-tarot-text/50 text-xs tracking-[0.3em]">{t('tarot.subtitle')}</p>
        </motion.div>

        {/* Controls */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex gap-3 mb-4">
          {gameState === 'idle' && (
            <NeonButton onClick={handleShuffle} color="violet">{t('tarot.shuffle')}</NeonButton>
          )}
          {gameState === 'shuffling' && (
            <NeonButton color="violet" disabled>
              <span className="animate-pulse">{t('tarot.shuffle')}...</span>
            </NeonButton>
          )}
          {(gameState === 'selecting' || gameState === 'revealed') && (
            <NeonButton onClick={handleShuffle} color="violet">{t('tarot.shuffle')}</NeonButton>
          )}
        </motion.div>

        {/* Hint text */}
        <AnimatePresence>
          {gameState === 'selecting' && currentSlot < 3 && (
            <motion.p
              key={`hint-${currentSlot}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-tarot-violet text-sm md:text-base text-center mb-3 font-display tracking-wider"
            >
              {hintText[currentSlot]}
            </motion.p>
          )}
        </AnimatePresence>

        {/* ====== DECK AREA - Half Circle ====== */}
        <div className="relative w-full max-w-2xl h-52 md:h-64 mb-6 flex items-end justify-center">
          <AnimatePresence>
            {deck.length > 0 && gameState !== 'revealed' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full"
              >
                {gameState === 'shuffling' ? (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-28 h-40">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={`shuffle-${i}`}
                        className="absolute top-0 left-0 w-24 h-36"
                        animate={{
                          x: [0, (i % 2 === 0 ? 1 : -1) * 40, 0],
                          y: [0, -30, 0],
                          rotate: [0, (i % 2 === 0 ? 1 : -1) * 20, 0],
                          rotateY: [0, 360, 720],
                        }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.08, ease: 'easeInOut' }}
                        style={{ left: 8, top: 8 }}
                      >
                        <TarotCardBack />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <>
                    {deck.map((card, i) => {
                      const style = getFanStyle(i, deck.length);
                      return (
                        <div
                          key={`deck-${card.id}`}
                          className={`absolute w-14 h-20 md:w-16 md:h-24 ${gameState === 'selecting' ? 'cursor-pointer' : ''}`}
                          style={style}
                          onClick={() => gameState === 'selecting' && handlePickCard(i)}
                        >
                          <div className="relative w-full h-full group transition-transform duration-200 hover:-translate-y-3 hover:scale-105">
                            <TarotCardBack />
                            {gameState === 'selecting' && (
                              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-tarot-violet/60 group-hover:shadow-[0_0_20px_rgba(178,75,255,0.4)] transition-all duration-200 pointer-events-none" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-black/60 px-2 py-0.5 rounded-full text-[10px] text-tarot-violet/60 border border-tarot-violet/20">
                      {deck.length}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ====== DRAWN CARDS AREA ====== */}
        <div className="w-full max-w-3xl">
          {/* 3 card slots */}
          <div className="flex justify-center gap-4 md:gap-10 mb-4">
            {[0, 1, 2].map((slotIndex) => {
              const card = drawnCards[slotIndex];
              const isFlipping = slotFlipping[slotIndex];
              const isFlipped = flippedSlots[slotIndex];

              return (
                <div key={slotIndex} className="flex flex-col items-center">
                  {/* Label */}
                  <div className="text-tarot-text/40 text-xs mb-2 font-display tracking-widest h-4">
                    {positionLabels[slotIndex]}
                  </div>

                  {/* Card slot */}
                  <div className="relative w-24 h-36 md:w-32 md:h-48" style={{ perspective: 800 }}>
                    <AnimatePresence mode="wait">
                      {!card ? (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="w-full h-full rounded-xl border-2 border-dashed border-tarot-violet/20 flex items-center justify-center"
                        >
                          <span className="text-tarot-violet/20 text-2xl font-display">?</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key={`card-${slotIndex}`}
                          initial={{ opacity: 0, scale: 0.5, y: -80 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                          className="relative w-full h-full"
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          {/* 3D Flip Container */}
                          <motion.div
                            className="relative w-full h-full"
                            style={{ transformStyle: 'preserve-3d' }}
                            animate={{
                              rotateY: isFlipped ? 180 : (isFlipping ? 180 : 0),
                            }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                          >
                            {/* BACK FACE (visible when rotateY=0) */}
                            <div
                              className="absolute inset-0"
                              style={{
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                              }}
                            >
                              <TarotCardBack />
                            </div>

                            {/* FRONT FACE (visible when rotateY=180) */}
                            <div
                              className="absolute inset-0"
                              style={{
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)',
                              }}
                            >
                              <div className={`w-full h-full ${card.isReversed ? 'rotate-180' : ''}`}>
                                <TarotCardFace
                                  cardId={card.id}
                                  name={isZh ? card.name : card.nameEn}
                                  nameEn={isZh ? card.nameEn : card.name}
                                />
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Card name below */}
                  <AnimatePresence>
                    {card && !isFlipping && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-2 text-center h-10"
                      >
                        <div className="text-tarot-violet text-xs md:text-sm font-display">
                          {isZh ? card.name : card.nameEn}
                        </div>
                        {card.isReversed && (
                          <div className="text-cyber-magenta text-[10px] mt-0.5">
                            ↑ {t('tarot.reversed')} ↑
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* INTERPRETATION */}
          <AnimatePresence>
            {gameState === 'revealed' && drawnCards.every(c => c !== null) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="bg-black/40 backdrop-blur-sm border border-tarot-violet/30 rounded-2xl p-5 md:p-6 mt-4"
              >
                <h3 className="text-tarot-violet font-display text-base md:text-lg tracking-wider mb-4 text-center flex items-center justify-center gap-3">
                  <span className="w-8 h-px bg-tarot-violet/30" />
                  {t('tarot.meaning')}
                  <span className="w-8 h-px bg-tarot-violet/30" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {drawnCards.map((card, i) => card && (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.2 }}
                      className="border-l-2 border-tarot-violet/30 pl-3 py-1"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-tarot-text font-semibold text-sm">
                          {isZh ? card.name : card.nameEn}
                        </span>
                        {card.isReversed && (
                          <span className="text-cyber-magenta text-[10px] px-1.5 py-0.5 border border-cyber-magenta/30 rounded">
                            {t('tarot.reversed')}
                          </span>
                        )}
                      </div>
                      <p className="text-tarot-text/60 text-xs leading-relaxed">
                        {card.isReversed
                          ? (isZh ? card.meaningReversed : card.meaningReversedEn)
                          : (isZh ? card.meaning : card.meaningEn)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <BackButton />
    </div>
  );
}
