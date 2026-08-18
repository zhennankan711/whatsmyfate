import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export default function SEO({
  title,
  description,
  keywords,
  ogImage = '/og-image.png',
}: SEOProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  useEffect(() => {
    const baseTitle = lang === 'zh' ? '赛博算命 - Cyber Divination' : 'Cyber Divination - 赛博算命';
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const setProperty = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description || (lang === 'zh'
      ? '赛博算命 - 在线生辰八字、塔罗占卜、答案之书、运势抽签。融合东方命理与西方塔罗，为你指引命运之路。'
      : 'Cyber Divination - Online Bazi, Tarot, Book of Answers, and Fortune Sticks. A fusion of Eastern mysticism and Western tarot.'
    ));

    setMeta('keywords', keywords || '算命,生辰八字,塔罗牌,占卜,运势,divination,tarot,bazi,fortune');

    setProperty('og:title', document.title);
    setProperty('og:description', description || '');
    setProperty('og:image', ogImage);
    setProperty('og:type', 'website');

    document.documentElement.setAttribute('lang', lang);
  }, [title, description, keywords, ogImage, lang]);

  return null;
}
