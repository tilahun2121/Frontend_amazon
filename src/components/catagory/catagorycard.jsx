import React from 'react';
import "./catagorycard.css";
function Catagorycard  ({ data })  {
  return (
    <div className="product-card">
      {/* <link to={`cateegory/${data.name}`}> */}
      {/* Add error handling for images */}
      <img 
        src={data.image} 
        alt={data.title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/300x300/cccccc/000000?text=Image+Not+Found';
        }}
        style={{ width: '200px', height: '200px', objectFit: 'cover' }}
      />
      <h3>{data.title}</h3>
      <p>{data.description.substring(0, 100)}...</p>
      <div className="price">
        <span className="current-price">${data.price}</span>
        {data.original_price && (
          <span className="original-price" style={{ textDecoration: 'line-through', marginLeft: '10px', color: '#999' }}>
            ${data.original_price}
          </span>
        )}
      </div>
      <div className="rating">Rating: {data.rating} ⭐</div>
      <div className="brand">Brand: {data.brand}</div>
      <div className="stock">{data.stock > 0 ? `In Stock: ${data.stock}` : 'Out of Stock'}</div>
      {/* </link> */}
    </div>
  );
};

export default Catagorycard;



 