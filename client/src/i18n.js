import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

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
    debug: false, // Tắt debug để tránh spam
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      crossDomain: true,
      withCredentials: false,
      requestOptions: {
        cache: 'no-cache'
      }
    },
    ns: ['common'],
    defaultNS: 'common',
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