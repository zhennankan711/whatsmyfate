// Tarot card face & back components
// Uses real tarot card images from /tarot/*.png

interface TarotCardFaceProps {
  cardId: number;   // 0-77
  name: string;     // Chinese name
  nameEn: string;   // English name
  className?: string;
}

// Roman numerals for Major Arcana (0-21)
const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];

// Card color themes for Major Arcana
const MAJOR_THEMES: Record<number, { bg1: string; bg2: string; accent: string; accent2: string }> = {
  0:  { bg1: '#f59e0b', bg2: '#92400e', accent: '#fcd34d', accent2: '#fbbf24' },
  1:  { bg1: '#7c3aed', bg2: '#4c1d95', accent: '#c4b5fd', accent2: '#a78bfa' },
  2:  { bg1: '#1e3a8a', bg2: '#0f172a', accent: '#93c5fd', accent2: '#60a5fa' },
  3:  { bg1: '#059669', bg2: '#064e3b', accent: '#6ee7b7', accent2: '#34d399' },
  4:  { bg1: '#b91c1c', bg2: '#7f1d1d', accent: '#fca5a5', accent2: '#f87171' },
  5:  { bg1: '#b45309', bg2: '#78350f', accent: '#fcd34d', accent2: '#fbbf24' },
  6:  { bg1: '#db2777', bg2: '#831843', accent: '#fbcfe8', accent2: '#f9a8d4' },
  7:  { bg1: '#475569', bg2: '#1e293b', accent: '#cbd5e1', accent2: '#94a3b8' },
  8:  { bg1: '#ea580c', bg2: '#9a3412', accent: '#fdba74', accent2: '#fb923c' },
  9:  { bg1: '#4338ca', bg2: '#1e1b4b', accent: '#a5b4fc', accent2: '#818cf8' },
  10: { bg1: '#0891b2', bg2: '#164e63', accent: '#67e8f9', accent2: '#22d3ee' },
  11: { bg1: '#a16207', bg2: '#713f12', accent: '#fde047', accent2: '#facc15' },
  12: { bg1: '#0d9488', bg2: '#134e4a', accent: '#5eead4', accent2: '#2dd4bf' },
  13: { bg1: '#581c87', bg2: '#2e1065', accent: '#d8b4fe', accent2: '#c084fc' },
  14: { bg1: '#0284c7', bg2: '#0c4a6e', accent: '#7dd3fc', accent2: '#38bdf8' },
  15: { bg1: '#7f1d1d', bg2: '#450a0a', accent: '#f87171', accent2: '#ef4444' },
  16: { bg1: '#c2410c', bg2: '#7c2d12', accent: '#fdba74', accent2: '#fb923c' },
  17: { bg1: '#0f766e', bg2: '#042f2e', accent: '#5eead4', accent2: '#2dd4bf' },
  18: { bg1: '#4c1d95', bg2: '#1e1b4b', accent: '#c4b5fd', accent2: '#a78bfa' },
  19: { bg1: '#eab308', bg2: '#a16207', accent: '#fef08a', accent2: '#fde047' },
  20: { bg1: '#2563eb', bg2: '#1e3a8a', accent: '#93c5fd', accent2: '#60a5fa' },
  21: { bg1: '#16a34a', bg2: '#14532d', accent: '#86efac', accent2: '#4ade80' },
};

// Suit themes for Minor Arcana
const SUIT_THEMES: Record<string, { bg1: string; bg2: string; accent: string; accent2: string }> = {
  wands:    { bg1: '#ea580c', bg2: '#9a3412', accent: '#fdba74', accent2: '#fb923c' },
  cups:     { bg1: '#0284c7', bg2: '#0c4a6e', accent: '#7dd3fc', accent2: '#38bdf8' },
  swords:   { bg1: '#475569', bg2: '#1e293b', accent: '#cbd5e1', accent2: '#94a3b8' },
  pentacles:{ bg1: '#059669', bg2: '#064e3b', accent: '#6ee7b7', accent2: '#34d399' },
};

function getTheme(cardId: number, suit?: string) {
  if (cardId <= 21) return MAJOR_THEMES[cardId];
  return SUIT_THEMES[suit || 'wands'];
}

function getSuitSymbol(suit?: string) {
  switch (suit) {
    case 'wands': return '🔥';
    case 'cups': return '💧';
    case 'swords': return '⚔️';
    case 'pentacles': return '💰';
    default: return '';
  }
}

// ─── Tarot Card Face with Real Image ───
export default function TarotCardFace({ cardId, name, nameEn, className = '' }: TarotCardFaceProps) {
  const isMajor = cardId <= 21;
  const suit = isMajor ? undefined : (cardId <= 35 ? 'wands' : cardId <= 49 ? 'cups' : cardId <= 63 ? 'swords' : 'pentacles');
  const theme = getTheme(cardId, suit);
  const suitSymbol = getSuitSymbol(suit);

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-xl ${className}`}
      style={{ backgroundColor: '#0f0f1a' }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{ background: `linear-gradient(160deg, ${theme.bg1}, ${theme.bg2})` }}
      />

      {/* Outer double border frame */}
      <div
        className="absolute inset-[3px] rounded-lg opacity-50"
        style={{ border: `2px solid ${theme.accent}` }}
      />
      <div
        className="absolute inset-[7px] rounded-md opacity-30"
        style={{ border: `1px solid ${theme.accent2}` }}
      />

      {/* Corner L-shaped ornaments */}
      <div className="absolute top-[7px] left-[7px] w-3 h-3">
        <div className="absolute top-0 left-0 w-full h-[2px] opacity-40" style={{ backgroundColor: theme.accent }} />
        <div className="absolute top-0 left-0 w-[2px] h-full opacity-40" style={{ backgroundColor: theme.accent }} />
      </div>
      <div className="absolute top-[7px] right-[7px] w-3 h-3">
        <div className="absolute top-0 right-0 w-full h-[2px] opacity-40" style={{ backgroundColor: theme.accent }} />
        <div className="absolute top-0 right-0 w-[2px] h-full opacity-40" style={{ backgroundColor: theme.accent }} />
      </div>
      <div className="absolute bottom-[7px] left-[7px] w-3 h-3">
        <div className="absolute bottom-0 left-0 w-full h-[2px] opacity-40" style={{ backgroundColor: theme.accent }} />
        <div className="absolute bottom-0 left-0 w-[2px] h-full opacity-40" style={{ backgroundColor: theme.accent }} />
      </div>
      <div className="absolute bottom-[7px] right-[7px] w-3 h-3">
        <div className="absolute bottom-0 right-0 w-full h-[2px] opacity-40" style={{ backgroundColor: theme.accent }} />
        <div className="absolute bottom-0 right-0 w-[2px] h-full opacity-40" style={{ backgroundColor: theme.accent }} />
      </div>

      {/* Top banner: Roman numeral (Major) or Suit symbol (Minor) */}
      <div className="absolute top-[5px] left-0 right-0 flex justify-center z-10">
        <div
          className="px-3 py-[2px] rounded-full border text-center backdrop-blur-sm"
          style={{
            borderColor: theme.accent + '50',
            backgroundColor: theme.bg1 + '18',
          }}
        >
          <span
            className="text-[9px] font-serif tracking-[0.25em] opacity-90 font-bold"
            style={{ color: theme.accent2 }}
          >
            {isMajor ? ROMAN[cardId] : suitSymbol}
          </span>
        </div>
      </div>

      {/* Artwork area - real image */}
      <div className="absolute top-7 bottom-7 left-[10px] right-[10px] rounded-md overflow-hidden">
        <img
          src={`/tarot/${cardId}.png`}
          alt={name}
          className="w-full h-full object-cover"
          draggable={false}
          loading="eager"
        />
      </div>

      {/* Bottom banner: card name */}
      <div className="absolute bottom-[5px] left-0 right-0 flex justify-center z-10">
        <div
          className="px-2 py-[1px] text-center"
          style={{ color: theme.accent2 }}
        >
          <span className="text-[8px] font-display tracking-widest opacity-70">
            {name}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Card Back ───
export function TarotCardBack({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full h-full rounded-xl overflow-hidden ${className}`} style={{ backgroundColor: '#0f0f1a' }}>
      {/* Deep purple base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#0d001a] to-[#1a0a2e]" />

      {/* Outer decorative frame */}
      <div className="absolute inset-[3px] rounded-lg border-2 border-[#4a2c6a]/50" />
      <div className="absolute inset-[7px] rounded-md border border-[#6b3fa0]/30" />

      {/* Corner ornaments */}
      <div className="absolute top-[7px] left-[7px] w-3 h-3">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#6b3fa0]/40" />
        <div className="absolute top-0 left-0 w-[2px] h-full bg-[#6b3fa0]/40" />
      </div>
      <div className="absolute top-[7px] right-[7px] w-3 h-3">
        <div className="absolute top-0 right-0 w-full h-[2px] bg-[#6b3fa0]/40" />
        <div className="absolute top-0 right-0 w-[2px] h-full bg-[#6b3fa0]/40" />
      </div>
      <div className="absolute bottom-[7px] left-[7px] w-3 h-3">
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6b3fa0]/40" />
        <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[#6b3fa0]/40" />
      </div>
      <div className="absolute bottom-[7px] right-[7px] w-3 h-3">
        <div className="absolute bottom-0 right-0 w-full h-[2px] bg-[#6b3fa0]/40" />
        <div className="absolute bottom-0 right-0 w-[2px] h-full bg-[#6b3fa0]/40" />
      </div>

      {/* Central mystical symbol */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="70%" height="70%" viewBox="0 0 100 100" className="opacity-40">
          {/* Outer circle */}
          <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="1" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="#a78bfa" strokeWidth="0.5" />
          {/* Inner pattern */}
          <circle cx="50" cy="50" r="20" fill="none" stroke="#c4b5fd" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="12" fill="none" stroke="#8b5cf6" strokeWidth="1" />
          {/* Cross lines */}
          <line x1="50" y1="10" x2="50" y2="90" stroke="#8b5cf6" strokeWidth="0.5" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="#8b5cf6" strokeWidth="0.5" />
          <line x1="22" y1="22" x2="78" y2="78" stroke="#8b5cf6" strokeWidth="0.5" />
          <line x1="78" y1="22" x2="22" y2="78" stroke="#8b5cf6" strokeWidth="0.5" />
          {/* Center dot */}
          <circle cx="50" cy="50" r="4" fill="#c4b5fd" />
          {/* Four corner stars */}
          {[ [15,15], [85,15], [15,85], [85,85] ].map(([x,y],i)=>(
            <g key={i}>
              <line x1={x-4} y1={y} x2={x+4} y2={y} stroke="#a78bfa" strokeWidth="1" />
              <line x1={x} y1={y-4} x2={x} y2={y+4} stroke="#a78bfa" strokeWidth="1" />
            </g>
          ))}
        </svg>
      </div>

      {/* Top / bottom decorative bars */}
      <div className="absolute top-[5px] left-0 right-0 flex justify-center">
        <div className="px-3 py-[2px] rounded-full border border-[#6b3fa0]/30 bg-[#1a0a2e]/50">
          <span className="text-[8px] font-serif tracking-[0.3em] text-[#a78bfa]/60 font-bold">✦ ✦ ✦</span>
        </div>
      </div>
      <div className="absolute bottom-[5px] left-0 right-0 flex justify-center">
        <div className="px-3 py-[2px] rounded-full border border-[#6b3fa0]/30 bg-[#1a0a2e]/50">
          <span className="text-[8px] font-serif tracking-[0.3em] text-[#a78bfa]/60 font-bold">✦ ✦ ✦</span>
        </div>
      </div>
    </div>
  );
}
