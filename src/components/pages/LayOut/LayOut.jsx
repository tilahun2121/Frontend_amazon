import React from 'react'
import Header from '../../header/header'
function LayOut  ({children})  {
  return (
    <div>
        <Header/>
        {children}
    </div>
  )
}
export default LayOut;