import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import CyberBackground from '../components/CyberBackground';
import BackButton from '../components/BackButton';
import SEO from '../components/SEO';

export default function PrivacyPolicy() {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'zh';

  return (
    <div className="min-h-[100dvh] relative">
      <SEO title={isZh ? '隐私政策' : 'Privacy Policy'} />
      <CyberBackground color="#0a0a0f" particleColor="#00f0ff" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold neon-glow-cyan text-cyber-cyan mb-2">
            {isZh ? '隐私政策' : 'Privacy Policy'}
          </h1>
          <p className="text-white/40 text-sm">Last updated: 2025-01-01</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8 text-white/80 text-sm md:text-base leading-relaxed"
        >
          <section>
            <h2 className="text-cyber-cyan font-display text-lg mb-3">
              {isZh ? '1. 信息收集' : '1. Information We Collect'}
            </h2>
            <p>
              {isZh
                ? '本网站使用 Google AdSense 展示广告。Google 可能会通过 Cookie 和 Web Beacon 收集您的访问信息，包括但不限于 IP 地址、浏览器类型、访问页面等，以提供个性化广告。'
                : 'This website uses Google AdSense to display ads. Google may collect your visit information through cookies and web beacons, including but not limited to IP address, browser type, visited pages, etc., to provide personalized ads.'}
            </p>
          </section>

          <section>
            <h2 className="text-cyber-cyan font-display text-lg mb-3">
              {isZh ? '2. Cookie 使用' : '2. Use of Cookies'}
            </h2>
            <p>
              {isZh
                ? '我们使用 Cookie 来改善用户体验和分析网站流量。您可以随时在浏览器设置中禁用 Cookie，但这可能影响网站的部分功能。'
                : 'We use cookies to improve user experience and analyze website traffic. You can disable cookies in your browser settings at any time, but this may affect some features of the website.'}
            </p>
          </section>

          <section>
            <h2 className="text-cyber-cyan font-display text-lg mb-3">
              {isZh ? '3. 数据安全' : '3. Data Security'}
            </h2>
            <p>
              {isZh
                ? '您输入的生辰八字、问题等信息仅在您的浏览器本地处理，我们不会收集、存储或传输任何个人信息到服务器。'
                : 'The birth date, questions, and other information you enter are processed only in your browser locally. We do not collect, store, or transmit any personal information to servers.'}
            </p>
          </section>

          <section>
            <h2 className="text-cyber-cyan font-display text-lg mb-3">
              {isZh ? '4. 第三方服务' : '4. Third-Party Services'}
            </h2>
            <p>
              {isZh
                ? '本网站使用 Google AdSense 和 Google Analytics。这些服务有自己的隐私政策，请访问 Google 隐私政策页面了解更多信息。'
                : 'This website uses Google AdSense and Google Analytics. These services have their own privacy policies. Please visit the Google Privacy Policy page for more information.'}
            </p>
          </section>

          <section>
            <h2 className="text-cyber-cyan font-display text-lg mb-3">
              {isZh ? '5. 联系我们' : '5. Contact Us'}
            </h2>
            <p>
              {isZh
                ? '如果您对本隐私政策有任何疑问，请通过以下方式联系我们。'
                : 'If you have any questions about this privacy policy, please contact us.'}
            </p>
          </section>
        </motion.div>
      </div>

      <BackButton />
    </div>
  );
}
