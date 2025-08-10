import React, { useEffect, useState, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { HeaderProvider } from './contexts/HeaderContext';
import Home from './pages/Home';
import About from './pages/About';
import OurStory from './pages/OurStory';
import OurSolutions from './pages/OurSolutions';
import Careers from './pages/Careers';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Services from './pages/Services';
import Partners from './pages/Partners';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import QuoteModal from './components/QuoteModal';
import PromoPopup from './components/PromoPopup';
import TranslationTest from './components/TranslationTest';
import { Toaster } from 'react-hot-toast';

function App() {
  const { t, i18n } = useTranslation();
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [rerenderKey, setRerenderKey] = useState(0);
  const [showPromoPopup, setShowPromoPopup] = useState(false);

  // Check if promo popup should be shown
  const shouldShowPromoPopup = () => {
    try {
      const stored = localStorage.getItem('promoPopupShown');
      if (!stored) return true;
      
      const data = JSON.parse(stored);
      const now = new Date();
      const expiry = new Date(data.expiry);
      
      // Show again if expired
      return now > expiry;
    } catch (error) {
      return true;
    }
  };

  useEffect(() => {
    // Show promo popup after 10 seconds if it should be shown
    if (shouldShowPromoPopup()) {
      const timer = setTimeout(() => {
        setShowPromoPopup(true);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      setRerenderKey(prev => prev + 1);
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // Handle promo popup form submission
  const handlePromoSubmit = async (data) => {
    try {
      // Send quote request to server
      const response = await fetch('/api/quote-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          source: 'promo_popup',
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quote request');
      }

      return true;
    } catch (error) {
      console.error('Error submitting promo popup:', error);
      throw error;
    }
  };

  return (
    <HeaderProvider>
      <div key={rerenderKey} className="min-h-screen bg-white">
        <ScrollToTop />
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/about/our-story" element={<OurStory />} />
              <Route path="/about/our-solutions" element={<OurSolutions />} />
              <Route path="/about/careers" element={<Careers />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/services" element={<Services />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            </Routes>
          </main>
          <Footer />
        {/* Promo Popup */}
        <PromoPopup
          isOpen={showPromoPopup}
          onClose={() => setShowPromoPopup(false)}
          onSubmit={handlePromoSubmit}
        />

        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        
        {/* Debug Component - Temporarily disabled */}
        {/* {process.env.NODE_ENV === 'development' && <TranslationTest />} */}
      </div>
    </HeaderProvider>
  );
}

export default App; 