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
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    // Fallback resources nếu load file thất bại
    resources: fallbackTranslations,
    backend: {
      loadPath: '/locales/{{lng}}.json',
      crossDomain: true,
      withCredentials: false,
      requestOptions: {
        cache: 'no-cache'
      },
      // Fallback khi load thất bại
      allowMultiLoading: false,
      parse: (data, url) => {
        try {
          return JSON.parse(data);
        } catch (e) {
          console.warn('Failed to parse translation file:', url);
          return {};
        }
      }
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

export default i18n; 