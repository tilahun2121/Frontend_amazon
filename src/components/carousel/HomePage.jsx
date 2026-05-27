// HomePage.js
import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import './HomePage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 641px) and (max-width: 1024px)' });

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch from multiple APIs to get more products
      const [fakestoreRes, dummyjsonRes, platziRes] = await Promise.allSettled([
        fetch('https://fakestoreapi.com/products'),
        fetch('https://dummyjson.com/products?limit=30'),
        fetch('https://api.escuelajs.co/api/v1/products?limit=20&offset=0')
      ]);

      let allProducts = [];

      // Process Fake Store API
      if (fakestoreRes.status === 'fulfilled') {
        const data = await fakestoreRes.value.json();
        const transformed = data.map(product => ({
          id: `fs-${product.id}`,
          name: product.title,
          price: product.price.toFixed(2),
          image: product.image,
          rating: product.rating?.rate || 4.5,
          ratingCount: product.rating?.count || Math.floor(Math.random() * 1000) + 100,
          category: product.category,
          description: product.description,
          prime: Math.random() > 0.5,
          badge: Math.random() > 0.7 ? 'Best Seller' : null
        }));
        allProducts = [...allProducts, ...transformed];
      }

      // Process DummyJSON API (more products with better images)
      if (dummyjsonRes.status === 'fulfilled') {
        const data = await dummyjsonRes.value.json();
        const transformed = data.products.map(product => ({
          id: `dj-${product.id}`,
          name: product.title,
          price: product.price.toFixed(2),
          image: product.thumbnail,
          images: product.images,
          rating: product.rating,
          ratingCount: product.stock || Math.floor(Math.random() * 500) + 50,
          category: product.category,
          description: product.description,
          brand: product.brand,
          discount: product.discountPercentage ? `${Math.round(product.discountPercentage)}% off` : null,
          prime: Math.random() > 0.6,
          badge: product.discountPercentage > 15 ? 'Limited Time Deal' : null
        }));
        allProducts = [...allProducts, ...transformed];
      }

      // Process Platzi API (another source)
      if (platziRes.status === 'fulfilled') {
        const data = await platziRes.value.json();
        const transformed = data.map(product => ({
          id: `pz-${product.id}`,
          name: product.title,
          price: product.price,
          image: product.images[0],
          images: product.images,
          rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
          ratingCount: Math.floor(Math.random() * 800) + 50,
          category: product.category?.name || 'others',
          description: product.description,
          prime: Math.random() > 0.5,
          badge: Math.random() > 0.8 ? 'Amazon Choice' : null
        }));
        allProducts = [...allProducts, ...transformed];
      }

      // Shuffle products for variety
      setProducts(shuffleArray(allProducts));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('Error fetching products:', err);
    }
  };

  // Helper function to shuffle array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Categorize products with more Amazon-like sections
  const getSections = () => {
    return {
      deals: products.slice(0, 12).map(p => ({...p, badge: 'Deal of the Day'})),
      electronics: products.filter(p => 
        p.category?.toLowerCase().includes('electronics') || 
        p.category?.toLowerCase().includes('gadgets') ||
        p.name?.toLowerCase().includes('laptop') ||
        p.name?.toLowerCase().includes('phone') ||
        p.name?.toLowerCase().includes('computer')
      ).slice(0, 15),
      fashion: products.filter(p => 
        p.category?.toLowerCase().includes('clothing') || 
        p.category?.toLowerCase().includes('fashion') ||
        p.category?.toLowerCase().includes('mens') ||
        p.category?.toLowerCase().includes('womens')
      ).slice(0, 15),
      home: products.filter(p => 
        p.category?.toLowerCase().includes('home') || 
        p.category?.toLowerCase().includes('kitchen') ||
        p.category?.toLowerCase().includes('furniture') ||
        p.name?.toLowerCase().includes('bed') ||
        p.name?.toLowerCase().includes('sofa')
      ).slice(0, 15),
      beauty: products.filter(p => 
        p.category?.toLowerCase().includes('beauty') || 
        p.category?.toLowerCase().includes('skincare') ||
        p.category?.toLowerCase().includes('cosmetics')
      ).slice(0, 15),
      recommended: products.slice(20, 35),
      inspired: shuffleArray([...products]).slice(0, 12)
    };
  };

  const ProductCard = ({ product }) => {
    return (
      <div className="amazon-product-card">
        <div className="product-image-wrapper">
          <img 
            src={product.image} 
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/200x200?text=Product';
            }}
          />
          {product.badge && (
            <span className="product-badge">{product.badge}</span>
          )}
          {product.prime && (
            <span className="prime-badge">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Amazon_Prime_icon.svg" alt="Prime" />
            </span>
          )}
        </div>
        
        <div className="product-details">
          <h3 className="product-name">{product.name}</h3>
          
          <div className="rating-section">
            <div className="stars">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="rating-count">{product.ratingCount?.toLocaleString()}</span>
          </div>

          <div className="price-section">
            <span className="currency">$</span>
            <span className="price">{product.price}</span>
            {product.discount && (
              <span className="discount-badge">{product.discount}</span>
            )}
          </div>

          <button className="amazon-add-to-cart">
            Add to Cart
          </button>
        </div>
      </div>
    );
  };

  const ProductSection = ({ title, products, linkText = "See more", backgroundColor = '#fff' }) => {
    const slidesToShow = isMobile ? 2 : isTablet ? 3 : 5;

    if (!products || products.length === 0) return null;

    return (
      <section className="amazon-section" style={{ backgroundColor }}>
        <div className="section-header">
          <h2>{title}</h2>
          <a href="#" className="see-more-link">{linkText} ›</a>
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
        >
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Carousel>
      </section>
    );
  };

  const GridSection = ({ title, products, columns = 4 }) => {
    return (
      <section className="amazon-grid-section">
        <div className="section-header">
          <h2>{title}</h2>
          <a href="#" className="see-more-link">Shop now ›</a>
        </div>
        <div className={`products-grid grid-${columns}`}>
          {products.slice(0, columns).map(product => (
            <div key={product.id} className="grid-item">
              <img src={product.image} alt={product.name} />
              <p>{product.name.substring(0, 30)}...</p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  if (loading) {
    return (
      <div className="amazon-loading">
        <div className="amazon-spinner"></div>
        <p>Loading your Amazon experience...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="amazon-error">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={fetchAllProducts}>Try Again</button>
      </div>
    );
  }

  const sections = getSections();

  return (
    <div className="amazon-homepage">
      {/* Hero Banner with multiple offers */}
      <div className="hero-banner">
        <img 
          src="https://images-eu.ssl-images-amazon.com/images/G/31/prime/Events/PayMonsoon/PC_hero_3000x1200._CB664336633_.jpg" 
          alt="Amazon Deals"
        />
        <div className="hero-overlay-content">
          <h1>Welcome to Amazon Clone</h1>
          <p>Millions of products at your fingertips</p>
        </div>
      </div>

      {/* Multiple product sections for rich Amazon feel */}
      <div className="content-wrapper">
        {/* Today's Deals - Most prominent */}
        {sections.deals.length > 0 && (
          <ProductSection 
            title="Today's Deals" 
            products={sections.deals}
            backgroundColor="#eaeded"
          />
        )}

        {/* Grid sections for variety */}
        <div className="grid-sections-row">
          {sections.electronics.length > 0 && (
            <GridSection 
              title="Electronics" 
              products={sections.electronics} 
              columns={4}
            />
          )}
          {sections.fashion.length > 0 && (
            <GridSection 
              title="Fashion & Style" 
              products={sections.fashion} 
              columns={4}
            />
          )}
        </div>

        {/* Carousel sections */}
        {sections.home.length > 0 && (
          <ProductSection 
            title="Home & Kitchen Essentials" 
            products={sections.home}
          />
        )}

        <div className="banner-ad">
          <img 
            src="https://images-eu.ssl-images-amazon.com/images/G/31/img18/HomeImprovement/2024/GW/PC_Hero_1x._CB583534737_.jpg" 
            alt="Special Offer"
          />
        </div>

        {sections.beauty.length > 0 && (
          <ProductSection 
            title="Beauty & Personal Care" 
            products={sections.beauty}
            backgroundColor="#eaeded"
          />
        )}

        {sections.recommended.length > 0 && (
          <ProductSection 
            title="Recommended for You" 
            products={sections.recommended}
          />
        )}

        {sections.inspired.length > 0 && (
          <ProductSection 
            title="Inspired by Your Browsing History" 
            products={sections.inspired}
            backgroundColor="#eaeded"
          />
        )}

        {/* Footer banner */}
        <div className="back-to-top" onClick={() => window.scrollTo(0, 0)}>
          Back to top
        </div>
      </div>
    </div>
  );
};

export default HomePage;