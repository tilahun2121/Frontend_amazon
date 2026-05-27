import React, { useContext } from "react";
import { DataContext } from "../../DataProvider/DataProvider";
import LayOut from "../LayOut/LayOut";
import { Link, useNavigate } from "react-router-dom";
import { type } from "../../Utility/action.type";
import Currencyformat from "../../product/format";
import "./cart.css";

function Cart() {
  const [{ basket = [] }, dispatch] = useContext(DataContext);
  const navigate = useNavigate();

  // Calculate total price
  const totalPrice = basket.reduce((acc, item) => {
    const price = Number(item?.price) || 0;
    const qty = Number(item?.amount) || 1;
    return acc + price * qty;
  }, 0);

  // Calculate total items count
  const totalItems = basket.reduce((acc, item) => {
    return acc + (Number(item?.amount) || 1);
  }, 0);

  // Increment quantity
  const increment = (item) => {
    if (!item?.id) return;
    dispatch({
      type: type.ADD_TO_BASKET,
      item: { ...item, amount: 1 }
    });
  };

  // Decrement quantity
  const decrement = (id) => {
    if (!id) return;
    dispatch({
      type: type.REMOVE_FROM_BASKET,
      id,
    });
  };

  // Remove item completely
  const removeItem = (id) => {
    dispatch({
      type: type.REMOVE_ALL_FROM_BASKET,
      id,
    });
  };

  // Empty entire cart
  const emptyCart = () => {
    if (window.confirm("Are you sure you want to empty your cart?")) {
      dispatch({
        type: type.EMPTY_BASKET,
      });
    }
  };

  // Proceed to Payment - FIXED
  const proceedToPayment = () => {
    if (basket.length === 0) {
      alert("Your cart is empty! Please add items to proceed.");
      return;
    }
    // Navigate directly to payment page
    navigate("/payment");
  };

  // Empty Cart UI
  if (!basket.length) {
    return (
      <LayOut>
        <div className="cart-empty">
          <h2>Your Cart is Empty</h2>
          <Link to="/" className="shop-btn">
            Go Shopping
          </Link>
        </div>
      </LayOut>
    );
  }

  return (
    <LayOut>
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart ({totalItems} {totalItems === 1 ? "item" : "items"})</h1>
          <button className="empty-btn" onClick={emptyCart}>
            Empty Cart
          </button>
        </div>

        <div className="cart-body">
          {/* LEFT SIDE - Cart Items */}
          <div className="cart-items">
            {basket.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.title}
                  className="cart-img"
                />

                <div className="cart-info">
                  <h3>{item.title}</h3>
                  <p className="cart-price">${item.price}</p>

                  <div className="qty-box">
                    <button onClick={() => decrement(item.id)}>-</button>
                    <span>{item.amount || 1}</span>
                    <button onClick={() => increment(item)}>+</button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>

                <div className="cart-item-total">
                  <p>Total: ${((item.price || 0) * (item.amount || 1)).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE - Order Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Total Items:</span>
              <span>{totalItems}</span>
            </div>

            <div className="summary-row">
              <span>Subtotal:</span>
              <Currencyformat amount={totalPrice} />
            </div>

            <div className="summary-row">
              <span>Shipping:</span>
              <span>$5.00</span>
            </div>

            <div className="summary-row total">
              <span>Total:</span>
              <Currencyformat amount={totalPrice + 5} />
            </div>

            <button className="checkout-btn" onClick={proceedToPayment}>
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </LayOut>
  );
}

export default Cart;