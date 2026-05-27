import React, { useContext } from "react";
import Rating from "@mui/material/Rating";
import { Link, useNavigate } from "react-router-dom";
import "./Productcard.css";
import { DataContext } from "../DataProvider/DataProvider";

function Productcard({ product, flex, renderDesc, renderAdd, hideAddToCart = false }) {
  const navigate = useNavigate();
  
  if (!product) {
    console.warn("Productcard received undefined product");
    return null;
  }

  const {
    title = "Product",
    id,
    price = 0,
    rating = { rate: 0, count: 0 },
    description = "No description available",
    category = "Uncategorized"
  } = product;

  const getImageUrl = () => {
    if (product?.image) return product.image;
    if (product?.thumbnail) return product.thumbnail;
    if (product?.images && product.images.length > 0) return product.images[0];
    return "https://via.placeholder.com/300x300?text=No+Image";
  };

  const imageUrl = getImageUrl();
  const [state, dispatch] = useContext(DataContext);

  // Add to Cart - NO ALERT
  const addToCart = () => {
    if (!id) {
      console.error("Cannot add to cart: Missing product ID", product);
      return;
    }

    const cartItem = {
      id: Number(id) || id,
      title: title || "Product",
      price: Number(price) || 0,
      image: imageUrl || "",
      rating: {
        rate: Number(rating?.rate) || 0,
        count: Number(rating?.count) || 0
      },
      description: description || "",
      category: category || "",
      amount: 1
    };

    // No alert here - silent add to cart
    dispatch({
      type: "ADD_TO_BASKET",
      item: cartItem
    });
  };

  const discount = Math.floor(Math.random() * 30) + 10;
  const originalPrice = (Number(price) / (1 - discount / 100)).toFixed(2);
  const isPrime = id && id % 2 === 0;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 5) + 2);
  const formattedDate = deliveryDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/300x300?text=Image+Not+Found";
  };

  const formattedPrice = Number(price).toFixed(2);
  const formattedOriginalPrice = parseFloat(originalPrice).toFixed(2);
  const ratingValue = Number(rating?.rate) || 0;
  const ratingCount = Number(rating?.count) || 0;

  return (
    <div className={`product-card ${flex ? "product-card-flex" : ""}`}>
      <Link to={`/products/${id}`} className="product-link">
        <img
          src={imageUrl}
          alt={title}
          className="product-card-image"
          loading="lazy"
          onError={handleImageError}
        />
      </Link>

      <div className="product-card-info">
        {id && id <= 3 && (
          <div className="amazon-choice">
            <span>Amazon's Choice</span>
          </div>
        )}

        <Link to={`/products/${id}`} className="product-link">
          <h3 className="product-card-title">
            {title.length > 60 ? title.substring(0, 60) + "..." : title}
          </h3>
        </Link>

        <div className="product-card-rating">
          <Rating
            value={ratingValue}
            precision={0.1}
            readOnly
            size="small"
          />
          <span className="rating-count">
            {ratingCount.toLocaleString()} ratings
          </span>
        </div>

        <div className="product-card-price">
          <span className="current-price">${formattedPrice}</span>
          {discount && (
            <>
              <span className="original-price">${formattedOriginalPrice}</span>
              <span className="discount-badge">-{discount}%</span>
            </>
          )}
        </div>

        {renderDesc && (
          <div className="product-description">
            <p>
              {description.length > 120
                ? description.substring(0, 120) + "..."
                : description}
            </p>
            {description.length > 120 && (
              <Link to={`/products/${id}`} className="read-more">
                Read more
              </Link>
            )}
          </div>
        )}

        <div className="delivery-info">
          Get it <span className="delivery-date">by {formattedDate}</span>
        </div>

        <div className="stock-status in-stock">
          <span>✓ In Stock</span>
        </div>

        {isPrime && (
          <div className="prime-badge">
            <span className="prime-icon">Prime</span>
            <span className="prime-text">FREE delivery</span>
          </div>
        )}

        {!isPrime && Number(price) > 25 && (
          <div className="free-delivery">
            <span>FREE delivery on orders over $25</span>
          </div>
        )}

        {/* Only show Add to Cart button if hideAddToCart is false */}
        {!hideAddToCart && (
          <button className="add-to-cart-btn" onClick={addToCart}>
            🛒 Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default Productcard;