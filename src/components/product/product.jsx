import React, { useEffect, useState } from "react";
import Productcard from "./productcard";
import axios from "axios";
import "./Product.css";

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get("https://fakestoreapi.com/products");

        console.log("Products received:", res.data);

        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          setProducts([]);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Loading UI
  if (loading) {
    return (
      <div className="loading-container">
        <h3>Loading products...</h3>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="error-container">
        <h3>Error: {error}</h3>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // Empty state
  if (!products.length) {
    return (
      <div className="no-products-container">
        <h3>No products found</h3>
      </div>
    );
  }

  return (
    <div className="product-container">
      <h2 className="product-title">Our Products ({products.length})</h2>

      <section className="product-grid">
        {products.map((product) => (
          <Productcard
            key={product.id}
            product={product}
            renderAdd={true} // IMPORTANT: enables Add to Cart button
          />
        ))}
      </section>
    </div>
  );
}

export default Product;
