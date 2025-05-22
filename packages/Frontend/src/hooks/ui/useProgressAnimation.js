import { useState, useEffect } from 'react';

export const useProgressAnimation = (targetValue, duration = 20) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(0); // Reset on target change
    const animation = setInterval(() => {
      setValue((prev) => {
        if (prev >= targetValue) {
          clearInterval(animation);
          return targetValue;
        }
        return Math.min(prev + 1, targetValue);
      });
    }, duration);

    return () => clearInterval(animation);
  }, [targetValue, duration]);

  return value;
};