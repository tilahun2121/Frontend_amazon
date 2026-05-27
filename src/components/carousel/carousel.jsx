import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { img } from "./img/data";
import './carousel.css';

function Carouseleffect() {
  return (
    <div className="carousel-container">
      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        showIndicators={true}
        showThumbs={false}
        showStatus={true}
        showArrows={true}
        interval={3000}
        transitionTime={500}
        swipeable={true}
        emulateTouch={true}
      >
        {img.map((imageitem, index) => (
          <div key={index} className="carousel-slide">
            <img src={imageitem} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default Carouseleffect;