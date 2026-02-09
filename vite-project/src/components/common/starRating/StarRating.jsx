import React, { useState, useEffect } from 'react';
import styles from './StarRating.module.css';

const StarRating = ({ rating = 0, onRatingChange, readOnly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(rating);

  useEffect(() => {
    setSelectedRating(rating);
  }, [rating]);

  const handleStarClick = (event, starIndex) => {
    if (readOnly) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const starWidth = rect.width;
    
    // Визначаємо, чи клік був на лівій чи правій половині зірки
    const isLeftHalf = clickX < starWidth / 2;
    const newRating = isLeftHalf ? starIndex - 0.5 : starIndex;
    
    setSelectedRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleStarHover = (event, starIndex) => {
    if (readOnly) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const hoverX = event.clientX - rect.left;
    const starWidth = rect.width;
    
    const isLeftHalf = hoverX < starWidth / 2;
    const hoverValue = isLeftHalf ? starIndex - 0.5 : starIndex;
    
    setHoverRating(hoverValue);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = hoverRating || selectedRating;
    
    for (let i = 1; i <= 5; i++) {
      const starValue = i;
      let starClass = styles.star;
      
      if (displayRating >= starValue) {
        starClass += ` ${styles.filled}`;
      } else if (displayRating >= starValue - 0.5) {
        starClass += ` ${styles.half}`;
      }
      
      stars.push(
        <span
          key={i}
          className={starClass}
          onClick={(e) => handleStarClick(e, starValue)}
          onMouseMove={(e) => handleStarHover(e, starValue)}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
        >
          ★
        </span>
      );
    }
    
    return stars;
  };

  return (
    <div className={styles.starRating}>
      <div className={styles.starsContainer}>
        {renderStars()}
      </div>
      {selectedRating > 0 && (
        <div className={styles.ratingValue}>
          {selectedRating.toFixed(1)}/5.0
        </div>
      )}
    </div>
  );
};

export default StarRating;
