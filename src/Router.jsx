// import React from 'react'
// import { BrowserRouter, Routes, Route } from 'react-router-dom';  
// import Landing from './components/pages/Landing/Landing';
// import Payment from "./components/pages/Payments/payment";
// import Auth from "./components/pages/Auth/Auth";
// import Orders from "./components/pages/Orders/Order";
// import Cart from "./components/pages/Cart/Cart";
// import Results from './components/pages/Result/Results';
// import ProductDetail from './components/pages/ProductDetail/ProductDetail';
// import {CheckoutElementsProvider} from '@stripe/react-stripe-js/checkout';
// import {loadStripe} from '@stripe/stripe-js';
// const stripePromise = loadStripe('pk_test_51TPJ3q2LYeytDrCdtUcpBLRQ18o1KraS3vgEHzVx8m4bl8oMdFf2pcWEhvXmU8xIJdGxcelWQjAygd9qFACllLza00rR8V0Wjl');

// const Routing = () => {
//   return (
//     <div>
//       <BrowserRouter>  
//         <Routes>
//           <Route path="/" element={<Landing/>}/>
//           <Route path="/auth" element={<Auth/>}/>
//           <Route path="/payment" element={<Payment/>}/>
//           <Route path="/order" element={<Orders/>}/>
//           <Route path="/Cart" element={<Cart/>}/>
//           <Route path="/products/:productId" element={<ProductDetail/>}/>
//           <Route path="/category:/categoryName" element={<Results/>}/>

//         </Routes>
//       </BrowserRouter>
//     </div>
//   )
// }

// export default Routing

import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';  
import { Elements } from '@stripe/react-stripe-js'; // ✅ Changed this import
import { loadStripe } from '@stripe/stripe-js';
import Landing from './components/pages/Landing/Landing';
import Payment from "./components/pages/Payments/payment";
import Auth from "./components/pages/Auth/Auth";
import Orders from "./components/pages/Orders/Order";
import Cart from "./components/pages/Cart/Cart";
import Results from './components/pages/Result/Results';
import ProductDetail from './components/pages/ProductDetail/ProductDetail';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
const stripePromise = loadStripe('pk_test_51TPJ3q2LYeytDrCdtUcpBLRQ18o1KraS3vgEHzVx8m4bl8oMdFf2pcWEhvXmU8xIJdGxcelWQjAygd9qFACllLza00rR8V0Wjl');

const Routing = () => {
  return (
    <div>
      <BrowserRouter>  
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/auth" element={<Auth/>}/>
          <Route path="/payment" element={
            <ProtectedRoute msg={"You must login to pay"} redirect={"/payment"}>
            <Elements stripe={stripePromise}> 
              <Payment/>
            </Elements>
            </ProtectedRoute>
           
          }/>
          <Route path="/order" element={
         <ProtectedRoute 
           msg={"You must login to access your orders"}
          redirect={"/order"}>
               <Orders/>
            
            </ProtectedRoute>

           }/>
          <Route path="/Cart" element={<Cart/>}/>
          <Route path="/products/:productId" element={<ProductDetail/>}/>
          <Route path="/category/:categoryName" element={<Results/>}/> {/* ✅ Fixed typo: category:/ to category/: */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default Routing