// HomePage.js
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { homePageProducts } from "./products"
import './HomePage.css';

const HomePage = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 641px) and (max-width: 1024px)' });

  // Different product categories for Amazon-style sections
  const categories = {
    electronics: homePageProducts.filter(p => p.category === "Electronics"),
    home: homePageProducts.filter(p => p.category === "Home & Kitchen"),
    fashion: homePageProducts.filter(p => p.category === "Fashion"),
    deals: homePageProducts.slice(0, 8) // First 8 products as deals
  };

  // Responsive carousel settings
  const getSlidesToShow = () => {
    if (isMobile) return 2;
    if (isTablet) return 3;
    return 5;
  };

  const ProductCarousel = ({ title, products, backgroundColor = '#fff' }) => {
    const slidesToShow = getSlidesToShow();

    return (
      <section className="product-section" style={{ backgroundColor }}>
        <div className="section-header">
          <h2>{title}</h2>
          <a href="#" className="see-more">See more →</a>
        </div>
        
        <Carousel
          showArrows={true}
          showStatus={false}
          showIndicators={false}
          infiniteLoop={false}
          slidesToShow={slidesToShow}
          slidesToScroll={slidesToShow}
          swipeable={true}
          emulateTouch={true}
          responsive={{
            desktop: { breakpoint: 1024, slidesToShow: 5 },
            tablet: { breakpoint: 768, slidesToShow: 3 },
            mobile: { breakpoint: 480, slidesToShow: 2 }
          }}
        >
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img 
                  src={product.image} 
                  alt={product.name}
                  loading="lazy"
                />
                {product.rating && (
                  <div className="product-rating">
                    {'⭐'.repeat(Math.floor(product.rating))}
                    <span>({product.rating})</span>
                  </div>
                )}
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-price">
                  <span className="price-currency">$</span>
                  <span className="price-amount">{product.price}</span>
                </div>
                <button className="add-to-cart-btn">
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          ))}
        </Carousel>
      </section>
    );
  };

  return (
    <div className="amazon-home">
      {/* Hero Banner (you can add your main carousel here) */}
      
      {/* Today's Deals Section */}
      <ProductCarousel 
        title="Today's Deals" 
        products={categories.deals}
        backgroundColor="#eaeded"
      />

      {/* Electronics Section */}
      <ProductCarousel 
        title="Electronics" 
        products={categories.electronics}
      />

      {/* Home & Kitchen Section */}
      <ProductCarousel 
        title="Home & Kitchen Essentials" 
        products={categories.home}
        backgroundColor="#eaeded"
      />

      {/* Recommended for You Section */}
      <ProductCarousel 
        title="Recommended for You" 
        products={homePageProducts.slice(0, 10)}
      />
    </div>
  );
};

export default HomePage;