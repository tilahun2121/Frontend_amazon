import React, { useEffect, useState, useContext } from 'react';
import LayOut from '../LayOut/LayOut';
import Rating from '@mui/material/Rating';
import Loader from '../../Loader/Loader';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DataContext } from '../../DataProvider/DataProvider';
import { type } from '../../Utility/action.type';
import './ProductDetail.css';
import Productcard from '../../product/productcard';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [{ basket }, dispatch] = useContext(DataContext);

  useEffect(() => {
    setIsLoading(true);
    axios.get(`https://fakestoreapi.com/products/${productId}`)
      .then((res) => {
        setProduct(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [productId]);

  // Add to Cart function
  const addToCart = () => {
    dispatch({
      type: type.ADD_TO_BASKET,
      item: {
        ...product,
        amount: 1
      }
    });
    alert(`${product.title.substring(0, 30)}... added to cart!`);
  };

  // Buy Now function - adds to cart and navigates to cart page
  const buyNow = () => {
    dispatch({
      type: type.ADD_TO_BASKET,
      item: {
        ...product,
        amount: 1
      }
    });
    navigate('/cart');
  };

  if (isLoading) {
    return (
      <LayOut>
        <div className="loader-wrapper">
          <Loader />
        </div>
      </LayOut>
    );
  }

  return (
    <LayOut>
      <div className="product-detail-container">
        <div className="product-image-section">
          <img 
            src={product.image} 
            alt={product.title} 
            className="product-image"
          />
        </div>

        <div className="product-info-section">
          <h1 className="product-title">{product.title}</h1>

          <div className="product-rating">
            <Rating 
              value={product.rating?.rate || 0} 
              precision={0.1} 
              readOnly 
              size="large"
            />
            <span className="review-count">
              ({product.rating?.count || 0} reviews)
            </span>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-price">
            ${product.price?.toFixed(2)}
          </div>

          <div className="product-actions">
            <button className="btn-add-to-cart" onClick={addToCart}>
              Add to Cart
            </button>
            <button className="btn-buy-now" onClick={buyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </LayOut>
  );
};

export default ProductDetail;


// import React, { useEffect, useState } from 'react';
// import LayOut from '../LayOut/LayOut';
// import Rating from '@mui/material/Rating';
// import Loader from '../../Loader/Loader';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import './ProductDetail.css'; // Import the CSS file
// import Productcard from '../../product/productcard';

// const ProductDetail = () => {
//   const { productId } = useParams();  //??????
//       // console.log(productId); // { productId: "5" }
//   const [product, setProduct] = useState({});
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     setIsLoading(true);
//     axios.get(`https://fakestoreapi.com/products/${productId}`)
//       .then((res) => {
//         setProduct(res.data);
//         setIsLoading(false);
//       })
//       .catch((error) => {
//         console.log(error);
//         setIsLoading(false);
//       });
//   }, [productId]);

//   if (isLoading) {
//     return (
//       <LayOut>
//         <div className="loader-wrapper">
//           <Loader />
//           <Productcard
//           product={product}
//           flex={true}
//            renderDesc={true}
//         renderAdd={true}
//           />
//         </div>
//       </LayOut>
//     );
//   }

//   return (
//     <LayOut>
//       <div className="product-detail-container">
//         {/* Left side - Image */}
//         <div className="product-image-section">
//           <img 
//             src={product.image} 
//             alt={product.title} 
//             className="product-image"
//           />
//         </div>

//         {/* Right side - Product Info */}
//         <div className="product-info-section">
//           <h1 className="product-title">
//             {product.title}
//           </h1>

//           <div className="product-rating">
//             <Rating 
//               value={product.rating?.rate || 0} 
//               precision={0.1} 
//               readOnly 
//               size="large"
//             />
//             <span className="review-count">
//               ({product.rating?.count || 0} reviews)
//             </span>
//           </div>

//           <p className="product-description">
//             {product.description}
//           </p>

//           <div className="product-price">
//             ${product.price?.toFixed(2)}
//           </div>

//           <div className="product-actions">
//             <button className="btn-add-to-cart">
//               Add to Cart
//             </button>
//             <button className="btn-buy-now">
//               Buy Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </LayOut>
//   );
// };

// export default ProductDetail;