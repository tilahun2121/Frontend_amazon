import React, { useContext, useEffect, useState } from 'react'
import LayOut from '../LayOut/LayOut'
import { db } from "../../Utility/firebase/firebase"
import { DataContext } from '../../DataProvider/DataProvider'
import Productcard from '../../product/productcard'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'

function Order() {
  const [{ user }, dispatch] = useContext(DataContext);
  const [order, setOrder] = useState([]);
  
  useEffect(() => {
    if (user) {
      const ordersRef = collection(db, "users", user.uid, "orders");
      const q = query(ordersRef, orderBy("created", "desc"));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log(snapshot);
        setOrder(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data()
          }))
        )
      });
      
      return () => unsubscribe();
    } else {
      setOrder([]);
    }
  }, [user])

  return (
    <LayOut>
      <section>
        <div>
          <h1>Your orders</h1>
          <div>
            {
              order.map((eachOrder, i) => {
                return (
                  <div key={i}>
                    <hr />
                    <p>order id:{eachOrder?.id}</p>
                    {eachOrder?.data?.basket.map(order => {
                      return (
                        <Productcard
                          flex={true}
                          product={order}
                          key={order.id}
                          hideAddToCart={true}  // This hides the Add to Cart button
                        />
                      )
                    })}
                    <hr />
                  </div>
                )
              })
            }
          </div>
        </div>
      </section>
    </LayOut>
  )
}

export default Order;