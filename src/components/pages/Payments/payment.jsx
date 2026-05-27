import React, { useContext, useState } from 'react';
import { DataContext } from '../../DataProvider/DataProvider';
import Productcard from "../../product/productcard";
import LayOut from '../LayOut/LayOut';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Currencyformat from "../../product/format";
import { axiosInstance } from "../../../API/axios";
import { db } from "../../Utility/firebase/firebase";
import { doc, setDoc, collection } from "firebase/firestore";  
import "./payment.css";

function Payment() {
  const [{ user, basket }, dispatch] = useContext(DataContext);
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  
  console.log(user);
  const stripe = useStripe();
  const elements = useElements();

  // Calculate total items
  const totalItems = basket?.reduce((amount, item) => {
    return item.amount + amount;
  }, 0);

  // Calculate total price
  const total = basket?.reduce((amount, item) => {
    return (item.price * item.amount) + amount;
  }, 0);

  const handleChange = (e) => {
    console.log(e);
    e?.error?.message ? setCardError(e.error.message) : setCardError("");
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!total || total <= 0) {
      setCardError(`Invalid total amount: $${total}. Please check your cart.`);
      return;
    }

    setProcessing(true);
    setCardError(null);

    try {
      const response = await axiosInstance({
        method: 'post',
        url: '/payment/create',
        data: { total: total }
      });

      console.log("Backend response:", response.data);
      const clientSecret = response.data?.clientSecret;
      
      if (!clientSecret) {
        throw new Error("No client secret received from server");
      }

      if (!stripe || !elements) {
        setCardError("Stripe not loaded yet. Please refresh the page.");
        setProcessing(false);
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              email: user?.email,
            },
          },
        }
      );

      if (confirmError) {
        console.error("Confirmation error:", confirmError);
        setCardError(confirmError.message);
        setProcessing(false);
      } else {
        console.log("Payment successful!", paymentIntent);
        
        // FIXED: Firebase v9+ syntax
        if (user && user.uid) {
          try {
            // Create references using v9+ syntax
            const orderRef = doc(db, "users", user.uid, "orders", paymentIntent.id);
            
            await setDoc(orderRef, {
              basket: basket,
              amount: paymentIntent.amount,
              created: new Date(),
              status: "completed",
              paymentIntentId: paymentIntent.id
            });
            dispatch({ type: 'EMPTY_BASKET' });
            console.log("Order saved to Firebase successfully");
          } catch (firebaseError) {
            console.error("Firebase save error:", firebaseError);
          }
        }
        
        setSucceeded(true);
        setProcessing(false);
      }
      
    } catch (error) {
      console.error("Payment error:", error);
      
      if (error.code === 'ERR_NETWORK') {
        setCardError("Cannot connect to server. Please make sure backend is running on port 5001");
      } else if (error.response) {
        setCardError(error.response.data?.error || error.response.data?.Message || "Payment failed. Please try again.");
      } else if (error.request) {
        setCardError("No response from server. Please check your connection.");
      } else {
        setCardError(error.message || "Payment failed. Please try again.");
      }
      
      setProcessing(false);
    }
  };

  return (
    <LayOut>
      <div className="payment-container">
        <div className="payment-header">
          <h2>Checkout ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h2>
        </div>

        <section className="payment-section">
          <div className="payment-section__content">
            <h3>Delivery Address</h3>
            <div className="address-card">
              <p><strong>Email:</strong> {user?.email || 'Guest User'}</p>
              <p><strong>City:</strong> Addis Ababa, Ethiopia</p>
              <p><strong>Delivery:</strong> 3-5 business days</p>
            </div>
          </div>
        </section>

        <section className="payment-section">
          <div className="payment-section__content">
            <h3>Review Items and Delivery</h3>
            <div className="products-list">
              {basket?.map((item, index) => (
                <Productcard key={index} 
                product={item}
               hideAddToCart={true}  // This hides the Add to Cart button
                 />
              ))}
            </div>
          </div>
        </section>

        <section className="payment-section">
          <div className="payment-section__content">
            <h3>Payment Method</h3>
            <form onSubmit={handlePayment} className="payment-form">
              <div className="card-element-wrapper">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                  onChange={handleChange}
                />
              </div>
              
              {cardError && <div className="payment-error">{cardError}</div>}
              
              <div className="price-section">
                <div className="total-order">
                  <span>Total Order Value:</span>
                  <Currencyformat
                    amount={total}
                    displayType={"text"}
                    prefix={"$"}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="pay-button"
                  disabled={!stripe || processing || succeeded || !total || total <= 0}
                >
                  {processing ? 'Processing...' : succeeded ? 'Paid ✓' : `Pay $${total?.toFixed(2)}`}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </LayOut>
  );
}

export default Payment;
