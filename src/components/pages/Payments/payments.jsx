import React, { useContext, useState } from 'react';
import { DataContext } from '../../DataProvider/DataProvider';
import Productcard from "../../product/productcard";
import LayOut from '../LayOut/LayOut';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Currencyformat from "../../product/format";
import { axiosInstance } from "../../../API/axios";
import {db} from "../../Utility/firebase"

function Payment() {
  const [{ user, basket }, dispatch] = useContext(DataContext);
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState(null);
  // const [succeeded, setSucceeded] = useState(false);
  
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
    
    try {
        setProcessing(true);

      const response = await axiosInstance({
        method: 'post',
        url: `/payment/create/?total=${total*100}`,
      });
     
      // console.log(response.data);
      const clientSecret = response.data?.clientSecret;
      const {PaymentIntent} = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)
          }
        }
      );
      // console.log(confirmation);

      await db
      .collection("user")
      .doc(user.uid)
      .collection("orders")
      .doc(PaymentIntent.id)
      .set({basket:basket,
        amount:PaymentIntent.amount,
        created:PaymentIntent.created,
      });
      
    //   if (confirmation.error) {
    //     setCardError(confirmation.error.message);
    //     setProcessing(false);
    //   } else {
    //     setSucceeded(true);
        setProcessing(false);
      }
    catch (error){
      console.log(error);
      setProcessing(false);

    }
    
    //   setCardError("Payment failed. Please try again.");
    //   setProcessing(false);
    // }
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
                <Productcard key={index} product={item} />
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
                  disabled={!stripe || processing || succeeded}
                >
                  {processing ? 'Processing...' : succeeded ? 'Paid ✓' : 'Pay Now'}
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