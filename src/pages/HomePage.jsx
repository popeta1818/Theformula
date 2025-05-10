import { useEffect, useState } from 'react';
import TopBanner from '../components/TopBanner';
import Header from '../components/Header';
import PromoBanner from '../components/PromoBanner';
import FlashDeals from '../components/FlashDeals';
import ProductCard from '../components/ProductCard';
import CategoryList from '../components/CategoryList';

import './HomePage.css';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([
    {
      id: 1,
      name: "C4 Ripped Pre-entrenador",
      price: 120.00,
      rating: 4.5,
      image: "/images/c4.jpg"
    },
    {
      id: 2,
      name: "Creatina Monohidrato 300g",
      price: 450.00,
      rating: 4.8,
      image: "/images/creatina.jpg"
    },
    {
      id: 3,
      name: "Gold Standard 100% Whey Protein",
      price: 960.00,
      rating: 4.9,
      image: "/images/whey-protein.jpg"
    }
  ]);
  const [flashDeals, setFlashDeals] = useState([
    {
      id: 1,
      name: "C4 Ripped Pre-entrenador",
      price: 120.00,
      originalPrice: 150.00,
      rating: 4.5,
      image: "/images/c4.jpg",
      discount: 20
    },
    {
      id: 2,
      name: "Creatina Monohidrato 300g",
      price: 450.00,
      originalPrice: 500.00,
      rating: 4.8,
      image: "/images/creatina.jpg",
      discount: 10
    }
  ]);
  const [categories, setCategories] = useState([
    { id: 1, name: "Proteínas", image: "/images/proteinas.jpg" },
    { id: 2, name: "Pre-entrenos", image: "/images/preworkout.jpg" },
    { id: 3, name: "Creatinas", image: "/images/creatinas.jpg" },
    { id: 4, name: "Vitaminas", image: "/images/vitaminas.jpg" }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay - now;
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="home-page">
      {/* Top Banner */}
      <TopBanner 
        text="Regístrate y obtén 20% de descuento en tu primera compra   "
        buttonText="Comprar Ahora"
      />

      {/* Header */}
      <Header />

      {/* Promo Banner */}
      <PromoBanner text="25% OFF EN PRODUCTOS MARCA MUTANT - Hoy" />

      {/* Flash Deals Section */}
      <section className="flash-deals">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Ofertas fugaces</h2>
            <div className="countdown-timer">
              <div className="time-block">
                <span className="time-value">{timeLeft.days}</span>
                <span className="time-label">Días</span>
              </div>
              <span className="time-separator">:</span>
              <div className="time-block">
                <span className="time-value">{timeLeft.hours}</span>
                <span className="time-label">Horas</span>
              </div>
              <span className="time-separator">:</span>
              <div className="time-block">
                <span className="time-value">{timeLeft.minutes}</span>
                <span className="time-label">Minutos</span>
              </div>
              <span className="time-separator">:</span>
              <div className="time-block">
                <span className="time-value">{timeLeft.seconds}</span>
                <span className="time-label">Segundos</span>
              </div>
            </div>
          </div>

          <div className="products-grid">
            {flashDeals.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                isDeal={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Productos Destacados</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
              />
            ))}
          </div>
          <button className="view-all-btn">Ver Todos Los Productos</button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Buscar por categorías</h2>
          <CategoryList categories={categories} />
        </div>
      </section>
    </div>
  );
};

export default HomePage;