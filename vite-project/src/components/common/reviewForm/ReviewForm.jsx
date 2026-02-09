import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import StarRating from '../starRating/StarRating';
import styles from './ReviewForm.module.css';

const ReviewForm = ({ productId, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Отримуємо поточного користувача з Redux state
  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Будь ласка, оберіть рейтинг');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Відгук має містити мінімум 10 символів');
      return;
    }

    if (!userId) {
      setError('Користувач не авторизований');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {

      // Перевіряємо чи токен існує
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Токен авторизації відсутній');
      }

      console.log('Redux user data:', {
        currentUser: currentUser,
        userId: userId,
        accessToken: token ? 'Token exists' : 'No token'
      });

      const reviewData = {
        productId: productId,
        userId: userId,
        comment: comment.trim(),
        rating: rating
      };

      console.log('Sending review data:', reviewData);

      await onSubmit(reviewData);

      // Очищаємо форму після успішної відправки
      setRating(0);
      setComment('');
    } catch (err) {
      console.error('Error in ReviewForm:', err);
      setError(err.message || 'Помилка при додаванні відгуку');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    setError('');
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    setError('');
  };

  return (
    <div className={styles.reviewForm}>
      <h4 className={styles.formTitle}>Додати відгук</h4>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Ваш рейтинг <span className={styles.required}>*</span>
          </label>
          <StarRating 
            rating={rating} 
            onRatingChange={handleRatingChange}
            readOnly={false}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="comment" className={styles.label}>
            Ваш відгук <span className={styles.required}>*</span>
          </label>
          <textarea
            id="comment"
            className={styles.textarea}
            value={comment}
            onChange={handleCommentChange}
            placeholder="Поділіться своїми враженнями про товар (мінімум 10 символів)"
            rows="5"
            disabled={isSubmitting}
          />
          <div className={styles.charCount}>
            {comment.length} символів
          </div>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Скасувати
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? 'Збереження...' : 'Зберегти відгук'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
