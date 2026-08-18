import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface NeonButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  color?: 'cyan' | 'gold' | 'violet' | 'blue' | 'magenta';
  disabled?: boolean;
}

export default function NeonButton({ children, onClick, className = '', color = 'cyan', disabled = false }: NeonButtonProps) {
  const colorMap = {
    cyan: 'border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/20 hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]',
    gold: 'border-bazi-gold text-bazi-gold hover:bg-bazi-gold/20 hover:shadow-[0_0_25px_rgba(201,168,76,0.5)]',
    violet: 'border-tarot-violet text-tarot-violet hover:bg-tarot-violet/20 hover:shadow-[0_0_25px_rgba(178,75,255,0.5)]',
    blue: 'border-book-blue text-book-blue hover:bg-book-blue/20 hover:shadow-[0_0_25px_rgba(126,184,255,0.5)]',
    magenta: 'border-cyber-magenta text-cyber-magenta hover:bg-cyber-magenta/20 hover:shadow-[0_0_25px_rgba(255,0,170,0.5)]',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`px-8 py-3 rounded-lg border bg-transparent backdrop-blur-sm font-display tracking-wider text-sm md:text-base transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${colorMap[color]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
