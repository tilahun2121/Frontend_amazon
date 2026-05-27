// import React from 'react';
import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom"; // Import Link and NavLink
import Logo from "../../assets/images/logoo.png";
import { DataContext } from "../DataProvider/DataProvider";
import {
  FaSearch,
  FaShoppingCart,
  FaGlobe,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./header.css"; // Import the CSS file

function Header() {
  const [{ basket }, dispatch] = useContext(DataContext);
  console.log(basket);
  const totalitem = basket?.reduce((amount, item) => {
    return item.amount + amount;
  }, 0);

  //     console.log("Header rendering, basket:", state?.basket);
  //     console.log("Basket count:", basketCount);
  return (
    <>
      <header className="header">
        {/* Left Section */}
        <div className="header__left">
          <Link to="/">
            {" "}
            {/* Changed from a href to Link */}
            <img
              src={Logo} // Make sure to add your actual logo path
              alt="logo"
              className="header__logo"
            />
          </Link>

          <div className="header__location">
            <FaMapMarkerAlt className="header__location-icon" />
            <div className="header__location-info">
              <p>deliver to</p>
              <span>Ethiopia</span>
            </div>
          </div>
        </div>
        {/* <div>
   <p>Basket items: {state.basket.length}</p>
      <button onClick={() => addToBasket({ id: 1, name: "Item 1" })}>
        Add to Basket
      </button>
    </div> */}
        {/* Search Section */}
        <div className="header__search">
          <select name="search" className="header__search-select">
            <option value="all">All</option>
            <option value="electronics">Electronics</option>
            <option value="books">Books</option>
            <option value="clothing">Clothing</option>
          </select>

          <input
            type="text"
            placeholder="Search Amazon"
            className="header__search-input"
          />

          <button className="header__search-button">
            <FaSearch className="header__search-icon" />
          </button>
        </div>

        {/* Right Section */}
        <div className="header__right">
          {/* Language selector */}
          <div className="header__language">
            <FaGlobe className="header__language-icon" />
            <select name="language" className="header__language-select">
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
            </select>
          </div>

          {/* Account - Link to auth page */}
          <Link
            to="/auth"
            className="header__account-link"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="header__account">
              <p>Hello, sign in</p>
              <span>Account & Lists</span>
            </div>
          </Link>

          {/* Orders - Link to orders page */}
          <Link
            to="/order"
            className="header__orders-link"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="header__orders">
              <p>Returns</p>
              <span>& Orders</span>
            </div>
          </Link>

          {/* Cart - Link to cart page */}
          <Link
            to="/Cart"
            className="header__cart-link"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="header__cart">
              <FaShoppingCart className="header__cart-icon" />
              <span className="header__cart-count">{totalitem}</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Bottom Navigation (for mobile) - Using NavLink for active state */}
      <nav className="header__bottom-nav">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "header__nav-link active" : "header__nav-link"
          }
          end // This ensures it only matches exact "/"
        >
          Today's Deals
        </NavLink>

        <NavLink
          to="/customer-service"
          className={({ isActive }) =>
            isActive ? "header__nav-link active" : "header__nav-link"
          }
        >
          Customer Service
        </NavLink>

        <NavLink
          to="/registry"
          className={({ isActive }) =>
            isActive ? "header__nav-link active" : "header__nav-link"
          }
        >
          Registry
        </NavLink>

        <NavLink
          to="/gift-cards"
          className={({ isActive }) =>
            isActive ? "header__nav-link active" : "header__nav-link"
          }
        >
          Gift Cards
        </NavLink>

        <NavLink
          to="/sell"
          className={({ isActive }) =>
            isActive ? "header__nav-link active" : "header__nav-link"
          }
        >
          Sell
        </NavLink>
      </nav>
    </>
  );
}

export default Header;
