import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BackButton() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      onClick={() => navigate('/')}
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm text-sm hover:border-white/50 hover:bg-white/10 transition-all duration-300"
    >
      <ArrowLeft size={16} />
      <span>{t('common.back')}</span>
    </motion.button>
  );
}
