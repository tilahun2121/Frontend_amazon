import React, { useEffect, useState } from 'react'
import LayOut from '../LayOut/LayOut'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { productUrl } from '../../../API/endpoint'
import Productcard from '../../product/productcard'

function Results() {
  const { categoryName } = useParams()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)  // Optional: Add loading state
  
  useEffect(() => {
    // Add loading state
    // setLoading(true)
    
    axios.get(`${productUrl}/products/category/${categoryName}`)
      .then((res) => {
        setResults(res.data)
        // setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setResults([])  // Set empty array on error
        setLoading(false)
      })
  }, [categoryName])  // ← FIXED: Add categoryName to dependency array
  
  // Optional: Add loading display
  if (loading) {
    return (
      <LayOut>
        <div style={{ padding: '30px', textAlign: 'center' }}>
          Loading {categoryName} products...
        </div>
      </LayOut>
    )
  }
  
  return (
    <LayOut> 
      <section>
        <h1 style={{ padding: "30px" }}>Results</h1>
        <p style={{ padding: "30px" }}>Category: {categoryName}</p>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          padding: '20px',
          justifyContent: 'center'
        }}>
          {results.map((product) => (
            <Productcard 
              key={product.id}
              product={product}
               renderDesc={false}
              renderAdd={true}
            />
          ))}
        </div>
      </section>
    </LayOut> 
  )
}

export default Results