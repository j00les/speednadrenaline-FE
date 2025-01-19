import React, { useState, useEffect } from 'react';

const Fade = ({ children, shouldFade }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (shouldFade) {
      setIsVisible(false); // Fade out when shouldFade is true
    } else {
      setIsVisible(true); // Fade in when shouldFade is false
    }
  }, [shouldFade]);

  return (
    <div
      className={`transition-opacity duration-1000 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
};

export default Fade;
