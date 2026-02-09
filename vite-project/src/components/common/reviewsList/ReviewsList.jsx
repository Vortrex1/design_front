import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import StarRating from '../starRating/StarRating';
import { UserService } from '../../../utils/services/UserService';
import { deleteReview } from '../../../store/state/actions/reviewActions';
import REMOTE_HOST_NAME from '../../../env/index';
import styles from './ReviewsList.module.css';

const ReviewItem = ({ review }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Отримуємо поточного користувача та перевіряємо чи він адмін
  const currentUser = useSelector((state) => state.user.currentUser);
  const token = localStorage.getItem("accessToken");
  const decodedUser = token ? jwtDecode(token) : null;

  const userRoles = decodedUser
    ? Array.isArray(decodedUser.role)
        ? decodedUser.role
        : [decodedUser.role]
    : [];

  const isAdmin = userRoles.includes(1) || userRoles.includes("Administrator") || userRoles.includes("Manager");

  const formatDate = (dateString) => {
    if (!dateString) return 'Дата не вказана';
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Ви впевнені, що хочете видалити цей відгук?')) {
      setIsDeleting(true);
      try {
        await dispatch(deleteReview(review.id)).unwrap();
      } catch (error) {
        console.error('Failed to delete review:', error);
        alert('Помилка при видаленні відгуку');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      if (review.userId) {
        setUserLoading(true);
        try {
          UserService.setAuthorizationToken(localStorage.getItem('accessToken'));
          const userData = await UserService.getUserById(review.userId);
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user:', error);
        } finally {
          setUserLoading(false);
        }
      }
    };

    loadUser();
  }, [review.userId]);

  const displayName = review.userName || user?.name || user?.userName || 'Анонімний користувач';
  const avatarUrl = user?.photo ? `${REMOTE_HOST_NAME}images/userImages/${user.photo}` : null;

  return (
    <div className={styles.reviewItem}>
      <div className={styles.reviewHeader}>
        <div className={styles.userInfo}>
          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>
                {displayName}
              </div>
              <div className={styles.reviewDate}>
                {formatDate(review.createdAt)}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.reviewActions}>
          <StarRating rating={review.rating || 0} readOnly={true} />
          {isAdmin && (
            <button
              className={styles.deleteButton}
              onClick={handleDelete}
              disabled={isDeleting}
              title="Видалити відгук"
            >
              {isDeleting ? '⏳' : '🗑️'}
            </button>
          )}
        </div>
      </div>
      <div className={styles.reviewContent}>
        <p className={styles.comment}>{review.comment || 'Без коментаря'}</p>
      </div>
    </div>
  );
};

const ReviewsList = ({ reviews, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, rating-high, rating-low
  const [filterRating, setFilterRating] = useState(0); // 0 = all, 1-5 = specific rating
  const reviewsPerPage = 5;

  // Логіка сортування та фільтрації
  const sortedAndFilteredReviews = React.useMemo(() => {
    if (!reviews || reviews.length === 0) return [];

    let filtered = reviews;

    // Фільтр по рейтингу
    if (filterRating > 0) {
      filtered = reviews.filter(review => Math.floor(review.rating) === filterRating);
    }

    // Сортування
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return sorted;
  }, [reviews, sortBy, filterRating]);

  // Логіка пагінації
  const totalPages = Math.ceil(sortedAndFilteredReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = sortedAndFilteredReviews.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageButton} ${currentPage === i ? styles.pageButtonActive : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className={styles.pagination}>
        <button
          className={styles.pageButton}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Попередня
        </button>

        {startPage > 1 && (
          <>
            <button className={styles.pageButton} onClick={() => handlePageChange(1)}>
              1
            </button>
            {startPage > 2 && <span className={styles.pageEllipsis}>...</span>}
          </>
        )}

        {pages}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className={styles.pageEllipsis}>...</span>}
            <button className={styles.pageButton} onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </button>
          </>
        )}

        <button
          className={styles.pageButton}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Наступна
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Завантаження відгуків...</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>Поки що немає відгуків про цей товар</p>
        <p className={styles.emptySubtext}>Будьте першим, хто залишить відгук!</p>
      </div>
    );
  }

  return (
    <div className={styles.reviewsList}>
      <div className={styles.reviewsHeader}>
        <h4 className={styles.listTitle}>
          Відгуки ({sortedAndFilteredReviews.length})
        </h4>

        {/* Панель сортування та фільтрації */}
        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Сортувати:</label>
            <select
              className={styles.filterSelect}
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1); // Скидаємо на першу сторінку при зміні сортування
              }}
            >
              <option value="newest">Спочатку новіші</option>
              <option value="oldest">Спочатку старіші</option>
              <option value="rating-high">Рейтинг: від вищого</option>
              <option value="rating-low">Рейтинг: від нижчого</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Фільтр по рейтингу:</label>
            <select
              className={styles.filterSelect}
              value={filterRating}
              onChange={(e) => {
                setFilterRating(Number(e.target.value));
                setCurrentPage(1); // Скидаємо на першу сторінку при зміні фільтра
              }}
            >
              <option value={0}>Всі рейтинги</option>
              <option value={5}>⭐⭐⭐⭐⭐ (5 зірок)</option>
              <option value={4}>⭐⭐⭐⭐ (4 зірки)</option>
              <option value={3}>⭐⭐⭐ (3 зірки)</option>
              <option value={2}>⭐⭐ (2 зірки)</option>
              <option value={1}>⭐ (1 зірка)</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.reviewsContainer}>
        {currentReviews.length === 0 ? (
          <div className={styles.noResults}>
            <p>Немає відгуків, що відповідають обраним критеріям</p>
          </div>
        ) : (
          currentReviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))
        )}
      </div>
      {renderPagination()}
    </div>
  );
};

export default ReviewsList;
