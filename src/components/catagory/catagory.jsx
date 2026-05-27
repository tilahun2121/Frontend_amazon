import React from 'react';
import Catagorycard from './catagorycard';
import amazonData from '../carousel/amazon-data.json'; // Adjust path as needed
import "./catagory.css";

const Catagory = () => {
  return (
    <section>
      
      
      {/* Display all categories */}
      {amazonData.categories.map((category) => (
        <div key={category.id} className="category-section">
          <h2>{category.name}</h2>
          <p>{category.description}</p>
          
          {/* Display products in each category */}
          <div className="products-grid">
            {category.products.map((product) => (
              <Catagorycard key={product.id} data={product} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Catagory;




