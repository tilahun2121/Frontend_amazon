import React from 'react';
import { FadeLoader } from 'react-spinners';

const Loader = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      width: '100%'
    }}>
      <FadeLoader
        color="#36d7b7"
        height={15}
        width={5}
        radius={2}
        margin={2}
        loading={true}
        aria-label="Loading Product"
      />
    </div>
  );
};

export default Loader;