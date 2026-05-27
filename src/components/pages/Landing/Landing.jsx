// landing page /home page
import React from 'react'
import LayOut from '../LayOut/LayOut'
import Carousel from '../../carousel/carousel'
import Catagory from '../../catagory/catagory'
import Product from '../../product/product'
function Landing () {
  return (
    <div>
  <LayOut>
<Carousel/>
<Catagory/>
<Product/>
</LayOut>
    </div>
  )
}
export default Landing;