import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LanguageToggle from './components/LanguageToggle';
import SEO from './components/SEO';
import Home from './pages/Home';
import Bazi from './pages/Bazi';
import Tarot from './pages/Tarot';
import AnswerBook from './pages/AnswerBook';
import FortuneDraw from './pages/FortuneDraw';
import PrivacyPolicy from './pages/PrivacyPolicy';

const pageTransition = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.97 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
};

const pageSEO: Record<string, { title: string; desc: string }> = {
  '/': { title: '', desc: '' },
  '/bazi': { title: '生辰八字 Bazi', desc: '输入出生时间，推算你的四柱八字与五行命理。' },
  '/tarot': { title: '塔罗占卜 Tarot', desc: '抽取塔罗牌，解读过去、现在与未来的命运指引。' },
  '/answer': { title: '答案之书 Book of Answers', desc: '心中默想一个问题，翻开答案之书寻找指引。' },
  '/draw': { title: '运势抽签 Fortune Draw', desc: '摇动签筒，抽取你的每日运势签文。' },
  '/privacy': { title: '隐私政策 Privacy Policy', desc: '赛博算命网站的隐私政策与数据使用说明。' },
};

function AnimatedRoutes() {
  const location = useLocation();
  const seo = pageSEO[location.pathname] || pageSEO['/'];

  return (
    <>
      <SEO title={seo.title} description={seo.desc} />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={pageTransition.initial}
          animate={pageTransition.animate}
          exit={pageTransition.exit}
          transition={pageTransition.transition}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/bazi" element={<Bazi />} />
            <Route path="/tarot" element={<Tarot />} />
            <Route path="/answer" element={<AnswerBook />} />
            <Route path="/draw" element={<FortuneDraw />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 py-2 text-center text-white/20 text-xs bg-gradient-to-t from-black/60 to-transparent">
        <a href="#/privacy" className="hover:text-white/50 transition-colors underline mr-2">Privacy Policy</a>
        <span>|</span>
        <span className="ml-2">Cyber Divination 2025</span>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-[100dvh] overflow-x-hidden">
        <LanguageToggle />
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}
