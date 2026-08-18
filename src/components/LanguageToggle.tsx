import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggle = () => {
    const next = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(next);
  };

  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm text-xs tracking-wider hover:border-cyber-cyan hover:text-cyber-cyan transition-all duration-300 font-display"
    >
      {i18n.language === 'zh' ? '中 / EN' : 'EN / 中'}
    </button>
  );
}
