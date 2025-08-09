import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, ShoppingCart, Info, User, LogOut, Heart, ChevronDown, Search, Mail, Phone } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin, FaPinterest, FaYoutube } from 'react-icons/fa';
import useAuthStore from '../stores/authStore';
import useCartStore from '../stores/cartStore';
import useWishlistStore from '../stores/wishlistStore';
import LoginModal from './LoginModal';
import CartModal from './CartModal';
import CurrencySelector from './CurrencySelector';
import SearchModal from './SearchModal';

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const { getWishlistCount } = useWishlistStore();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ];

  // Phát hiện ngôn ngữ trình duyệt
  useEffect(() => {
    const browserLang = navigator.language || navigator.userLanguage;
    setDetectedLanguage(browserLang);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        setIsSearchModalOpen(false);
        setIsCartModalOpen(false);
        setIsLoginModalOpen(false);
        setIsLangOpen(false);
        setIsAboutDropdownOpen(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/products', label: t('nav.products') },
    { path: '/services', label: t('nav.services') },
    { 
      path: '/about', 
      label: t('nav.about'),
      hasDropdown: true,
      dropdownItems: [
        { path: '/about', label: 'About Us' },
        { path: '/about/our-story', label: 'Our Story' },
        { path: '/about/our-solutions', label: 'Our Solutions' },
        { path: '/about/careers', label: 'Careers' }
      ]
    },
    { path: '/partners', label: t('nav.partners') },
    { path: '/contact', label: t('nav.contact') },
    { path: '/blog', label: t('nav.blog') },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  const getCurrentLanguageInfo = () => {
    const currentLang = languages.find(lang => lang.code === i18n.language);
    const isAutoDetected = detectedLanguage && detectedLanguage.startsWith(i18n.language);
    
    return {
      current: currentLang,
      isAutoDetected,
      browserLang: detectedLanguage
    };
  };

  const langInfo = getCurrentLanguageInfo();

  const isAboutActive = location.pathname.startsWith('/about');

  return (
    <div className=''>
      <header className="bg-primary-500 text-white fixed top-0 left-0 right-0 z-10 shadow-lg">
        {/* Top bar */}
        <div className="bg-primary-500 mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <Link to="/contact" className="text-white hover:text-primary-300">
                CONTACT US
              </Link>
              <span className="flex items-center">
                <Mail size={14} className="mr-2" />
                CS@SIMPLEDECOR.VN
              </span>
              <span className="flex items-center">
                <Phone size={14} className="mr-2" />
                +84-989809313
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <CurrencySelector className="text-primary-500" />
              <span>{t('footer.followUs')}</span>
              <div className="flex space-x-3">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-300 transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebookF size={16} />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-300 transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram size={16} />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-300 transition-colors"
                  aria-label="Twitter"
                >
                  <FaTwitter size={16} />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-300 transition-colors"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={16} />
                </a>
                <a 
                  href="https://pinterest.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-300 transition-colors"
                  aria-label="Pinterest"
                >
                  <FaPinterest size={16} />
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-300 transition-colors"
                  aria-label="YouTube"
                >
                  <FaYoutube size={16} />
                </a>
              </div>
              <button 
                onClick={() => setIsSearchModalOpen(true)}
                className="hover:text-primary-300 transition-colors relative group" 
                aria-label="Search (Ctrl+K)"
                title="Search (Ctrl+K)"
              >
                <Search size={16} />
                <span className="hidden sm:block absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Ctrl+K
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="bg-white mx-auto px-4 py-4">
          <div className="flex text-primary-500 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="w-[150px] h-[70px]">
             <img src="https://www.simpledecor.vn/wp-content/uploads/2022/05/simple-decor-logo-466x277-2022-SVG-01.svg" alt="" className='w-full h-full object-cover' />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <div key={item.path} className="relative">
                  {item.hasDropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => setIsAboutDropdownOpen(true)}
                      onMouseLeave={() => setIsAboutDropdownOpen(false)}
                    >
                      <button
                        className={`flex items-center space-x-1 hover:text-primary-700 transition-colors ${
                          isAboutActive ? 'text-primary-500 font-bold' : ''
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {isAboutDropdownOpen && (
                        <div className="absolute top-full left-0 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                          {item.dropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.path}
                              to={dropdownItem.path}
                              className={`block px-4 py-2 text-sm hover:bg-primary-50 transition-colors ${
                                location.pathname === dropdownItem.path ? 'text-primary-600 font-semibold bg-primary-50' : 'text-gray-700'
                              }`}
                              onClick={() => setIsAboutDropdownOpen(false)}
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`hover:text-primary-700 transition-colors ${
                        location.pathname === item.path ? 'text-primary-500 font-bold' : ''
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Language selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center space-x-2 hover:text-primary-500 transition-colors"
                >
                  <Globe size={20} />
                  <span className="hidden sm:inline">
                    {langInfo.current?.flag}
                  </span>
                </button>
                {isLangOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                          i18n.language === lang.code ? 'text-primary-600 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        {lang.flag} {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

             

             

              {/* Cart */}
              <button
                onClick={() => setIsCartModalOpen(true)}
                className="flex items-center space-x-2 hover:text-primary-300 transition-colors relative"
              >
                <ShoppingCart size={20} />
                <span className="hidden sm:inline">{t('cart.title')}</span>
                                 {getTotalItems() > 0 && (
                   <span className="absolute -top-2 -right-2 bg-primary-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                     {getTotalItems()}
                   </span>
                 )}
              </button>

              {/* User Authentication */}
              {isAuthenticated ? (
                <Link to="/profile" className="relative group">
                  <button className="flex items-center space-x-2 hover:text-primary-300 transition-colors">
                    <User size={20} />
                    <span className="hidden sm:inline">{user?.name || 'User'}</span>
                  </button>
                </Link>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center space-x-2 hover:text-primary-300 transition-colors"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">{t('auth.login')}</span>
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <div key={item.path}>
                    {item.hasDropdown ? (
                      <div>
                        <button
                          onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
                          className={`w-full text-left py-2 px-4 rounded hover:bg-primary-700 transition-colors flex items-center justify-between ${
                            isAboutActive ? 'bg-primary-700' : ''
                          }`}
                        >
                          <span>{item.label}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${isAboutDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isAboutDropdownOpen && (
                          <div className="ml-4 space-y-1">
                            {item.dropdownItems.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.path}
                                to={dropdownItem.path}
                                onClick={() => {
                                  setIsMenuOpen(false);
                                  setIsAboutDropdownOpen(false);
                                }}
                                className={`block py-2 px-4 rounded hover:bg-primary-700 transition-colors ${
                                  location.pathname === dropdownItem.path ? 'bg-primary-700' : ''
                                }`}
                              >
                                {dropdownItem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`py-2 px-4 rounded hover:bg-primary-700 transition-colors ${
                          location.pathname === item.path ? 'bg-primary-700' : ''
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
                {/* Mobile cart, wishlist and login */}
                <div className="border-t pt-4 mt-4 space-y-2">
                                     <button
                     onClick={() => {
                       setIsCartModalOpen(true);
                       setIsMenuOpen(false);
                     }}
                     className="w-full text-left py-2 px-4 rounded hover:bg-primary-700 transition-colors flex items-center space-x-2"
                   >
                    <ShoppingCart size={20} />
                    <span>{t('cart.title')} ({getTotalItems()})</span>
                  </button>
                  
                  {!isAuthenticated && (
                                         <button
                       onClick={() => {
                         setIsLoginModalOpen(true);
                         setIsMenuOpen(false);
                       }}
                       className="w-full text-left py-2 px-4 rounded hover:bg-primary-700 transition-colors flex items-center space-x-2"
                     >
                      <User size={20} />
                      <span>{t('auth.login')}</span>
                    </button>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
      />
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </div>
  );
};

export default Header; 