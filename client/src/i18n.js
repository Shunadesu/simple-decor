import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Fallback translations để tránh lỗi load file
const fallbackTranslations = {
  en: {
    'nav.home': 'Home',
    'nav.products': 'Products', 
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.partners': 'Partners',
    'nav.contact': 'Contact',
    'nav.blog': 'Blog',
    'cart.title': 'Cart',
    'auth.login': 'Login'
  },
  vi: {
    'nav.home': 'Trang chủ',
    'nav.products': 'Sản phẩm',
    'nav.services': 'Dịch vụ', 
    'nav.about': 'Giới thiệu',
    'nav.partners': 'Đối tác',
    'nav.contact': 'Liên hệ',
    'nav.blog': 'Blog',
    'cart.title': 'Giỏ hàng',
    'auth.login': 'Đăng nhập'
  },
  ko: {
    'nav.home': '홈',
    'nav.products': '제품', 
    'nav.services': '서비스',
    'nav.about': '소개',
    'nav.partners': '파트너',
    'nav.contact': '연락처',
    'nav.blog': '블로그',
    'cart.title': '장바구니',
    'auth.login': '로그인'
  },
  zh: {
    'nav.home': '首页',
    'nav.products': '产品', 
    'nav.services': '服务',
    'nav.about': '关于',
    'nav.partners': '合作伙伴',
    'nav.contact': '联系',
    'nav.blog': '博客',
    'cart.title': '购物车',
    'auth.login': '登录'
  },
  ja: {
    'nav.home': 'ホーム',
    'nav.products': '製品', 
    'nav.services': 'サービス',
    'nav.about': '概要',
    'nav.partners': 'パートナー',
    'nav.contact': 'お問い合わせ',
    'nav.blog': 'ブログ',
    'cart.title': 'カート',
    'auth.login': 'ログイン'
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Đảm bảo i18n được khởi tạo đúng cách
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development', // Chỉ debug trong development
    
    // Cấu hình namespace cho flat structure
    ns: ['translation'],
    defaultNS: 'translation',
    
    interpolation: {
      escapeValue: false,
    },
    
    // Backend config for loading translation files
    backend: {
      loadPath: '/locales/{{lng}}.json?v=' + Date.now(),
      crossDomain: true,
      withCredentials: false,
      requestOptions: {
        cache: 'default',
        mode: 'cors',
        credentials: 'omit'
      },
      allowMultiLoading: false,
      parse: (data, url) => {
        try {
          console.log('Loading translation file:', url);
          const parsed = JSON.parse(data);
          console.log('Translation data loaded successfully for:', url);
          console.log('Sample keys:', Object.keys(parsed).slice(0, 5));
          console.log('Has customerSatisfaction?', !!parsed.customerSatisfaction);
          console.log('Has cart.title?', !!parsed.cart?.title);
          // Wrap in translation namespace for i18next
          return { translation: parsed };
        } catch (e) {
          console.error('Failed to parse translation file:', url, e);
          // Return fallback for current language
          const lng = url.match(/\/([a-z]{2})\.json/)?.[1] || 'en';
          return { translation: fallbackTranslations[lng] || fallbackTranslations.en || {} };
        }
      }
    },

    // Fallback resources if files fail to load
    resources: {
      en: { translation: fallbackTranslations.en },
      vi: { translation: fallbackTranslations.vi },
      ko: { translation: fallbackTranslations.ko },
      zh: { translation: fallbackTranslations.zh },
      ja: { translation: fallbackTranslations.ja }
    },

    detection: {
      // Thứ tự ưu tiên phát hiện ngôn ngữ
      order: [
        'localStorage',     // Lưu lựa chọn trước đó
        'sessionStorage',   // Lưu trong phiên làm việc
        'navigator',        // Cài đặt trình duyệt
        'htmlTag',          // Thẻ HTML lang
        'subdomain',        // Subdomain (nếu có)
        'path',             // Đường dẫn URL
        'querystring'       // Tham số URL
      ],
      // Lưu trữ lựa chọn
      caches: ['localStorage', 'sessionStorage'],
      // Thời gian cache (ms)
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
      // Danh sách ngôn ngữ được hỗ trợ
      whitelist: ['en', 'vi', 'ko', 'zh', 'ja'],
      // Tự động phát hiện khi thay đổi
      checkWhitelist: true,
      // Chuyển đổi ngôn ngữ tự động
      convertDetectedLanguage: (lng) => {
        // Map các ngôn ngữ tương tự
        const languageMap = {
          'vi-VN': 'vi',
          'vi': 'vi',
          'ko-KR': 'ko',
          'ko': 'ko',
          'zh-CN': 'zh',
          'zh-TW': 'zh',
          'zh': 'zh',
          'ja-JP': 'ja',
          'ja': 'ja',
          'en-US': 'en',
          'en-GB': 'en',
          'en': 'en'
        };
        return languageMap[lng] || 'en';
      }
    },
  });

// Log language changes
i18n.on('languageChanged', (lng) => {
  console.log('Language changed to:', lng);
  console.log('Available resources:', Object.keys(i18n.options.resources || {}));
});

// Log initialization
i18n.on('initialized', () => {
  console.log('i18n initialized successfully');
  console.log('Current language:', i18n.language);
  console.log('Available languages:', Object.keys(i18n.options.resources || {}));
  console.log('Translation store:', i18n.store.data);
});

i18n.on('loaded', (loaded) => {
  console.log('Translations loaded:', loaded);
});

i18n.on('failedLoading', (lng, ns, msg) => {
  console.error('Failed to load translations:', lng, ns, msg);
});

export default i18n; 