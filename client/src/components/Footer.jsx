import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Globe, Send, ArrowUp } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin, FaPinterest, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    try {
      // TODO: Implement newsletter subscription API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSubscribeMessage(t('footer.newsletter.success'));
      setEmail('');
    } catch (error) {
      setSubscribeMessage(t('footer.newsletter.error'));
    } finally {
      setIsSubscribing(false);
      setTimeout(() => setSubscribeMessage(''), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 text-white relative">
      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="absolute -top-6 right-8 bg-primary-600 hover:bg-primary-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors group"
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} className="group-hover:scale-110 transition-transform" />
      </button>

      <div className="container-custom py-16">
        {/* Newsletter Section */}
        <div className="text-center mb-12 bg-primary-900/30 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">{t('footer.newsletter.title')}</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            {t('footer.newsletter.description')}
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('footer.newsletter.placeholder')}
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              disabled={isSubscribing}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubscribing ? (
                <span>{t('footer.newsletter.subscribing')}</span>
              ) : (
                <>
                  <Send size={16} />
                  <span>{t('footer.newsletter.subscribe')}</span>
                </>
              )}
            </button>
          </form>
          {subscribeMessage && (
            <p className={`mt-4 text-sm ${subscribeMessage.includes(t('footer.newsletter.success').substring(0, 10)) ? 'text-green-400' : 'text-red-400'}`}>
              {subscribeMessage}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <Globe size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Simple Decor</h3>
                <p className="text-primary-400 text-sm">The Green Path Forward</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Chuyên cung cấp sản phẩm trang trí nội thất từ vật liệu tự nhiên, thân thiện với môi trường. 
              Chúng tôi cam kết mang đến những sản phẩm chất lượng cao với giá cả hợp lý.
            </p>
            
            {/* Social Media */}
            <div>
              <h5 className="font-semibold mb-3">{t('footer.connectWithUs')}</h5>
              <div className="flex space-x-3">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors group"
                  aria-label="Facebook"
                >
                  <FaFacebookF size={16} className="group-hover:scale-110 transition-transform" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors group"
                  aria-label="Instagram"
                >
                  <FaInstagram size={16} className="group-hover:scale-110 transition-transform" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors group"
                  aria-label="Twitter"
                >
                  <FaTwitter size={16} className="group-hover:scale-110 transition-transform" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors group"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={16} className="group-hover:scale-110 transition-transform" />
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors group"
                  aria-label="YouTube"
                >
                  <FaYoutube size={16} className="group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-400">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">{t('nav.home')}</span>
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">{t('nav.products')}</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">{t('nav.services')}</span>
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">{t('footer.partners')}</span>
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Blog</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">{t('nav.contact')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-400">{t('footer.aboutUs')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">{t('nav.about')}</span>
                </Link>
              </li>
              <li>
                <Link to="/about/our-story" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">{t('footer.ourStory')}</span>
                </Link>
              </li>
              <li>
                <Link to="/about/our-solutions" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">{t('footer.ourSolutions')}</span>
                </Link>
              </li>
              <li>
                <Link to="/about/careers" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">{t('footer.careers')}</span>
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-gray-300 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">{t('footer.wishlist')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-400">{t('contact.title')}</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone size={18} className="text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-medium">{t('footer.hotline')}</p>
                  <p className="text-white">+84-989809313</p>
                  <p className="text-gray-400 text-sm">{t('footer.support247')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail size={18} className="text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-medium">Email</p>
                  <p className="text-white">CS@SIMPLEDECOR.VN</p>
                  <p className="text-gray-400 text-sm">{t('footer.customerService')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-medium">{t('footer.address')}</p>
                  <p className="text-white text-sm leading-relaxed">
                    Van Boi Village, Nhat Tuu Commune<br />
                    Kim Bang District, Ha Nam Province<br />
                    Vietnam
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 bg-gray-800 rounded-2xl overflow-hidden">
          <div className="p-6">
            <h4 className="text-lg font-semibold mb-4 text-primary-400">{t('footer.ourLocation')}</h4>
            <div className="bg-gray-700 rounded-lg p-8 h-64 flex items-center justify-center">
              <div className="text-center">
                <Globe size={48} className="text-primary-400 mx-auto mb-4" />
                <p className="text-gray-300 text-lg font-medium">{t('footer.mapPlaceholder')}</p>
                <p className="text-gray-400 mt-2">
                  Van Boi Village, Nhat Tuu Commune, Kim Bang District, Ha Nam Province
                </p>
                <button className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm transition-colors">
                  {t('footer.getDirections')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <p className="text-gray-400 text-sm">
                © 2024 Simple Decor. All rights reserved.
              </p>
              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                <span>{t('footer.madeWithLove')}</span>
                <span className="text-red-500">❤️</span>
                <span>{t('footer.inVietnam')}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <Link to="/privacy" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                {t('footer.privacyPolicy')}
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                {t('footer.termsOfService')}
              </Link>
              <Link to="/shipping" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                {t('footer.shippingPolicy')}
              </Link>
              <Link to="/returns" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
                {t('footer.returnPolicy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 