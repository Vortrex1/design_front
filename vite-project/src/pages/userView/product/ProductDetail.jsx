import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import REMOTE_HOST_NAME from '../../../env/index';
import photoNotFound from '../../../assets/images/photoNotFound.jpg';
import productNotFound from '../../../assets/images/productNotFound.png';
import useActions from '../../../hooks/useActions';
import ProductToCartButton from '../cartItems/components/ProductToCartButton';
import StarRating from '../../../components/common/starRating/StarRating';
import ReviewForm from '../../../components/common/reviewForm/ReviewForm';
import ReviewsList from '../../../components/common/reviewsList/ReviewsList';
import { addReview, fetchReviewsByProductId } from '../../../store/state/actions/reviewActions';
import styles from './ProductDetail.module.css';

const API_URL_IMAGES_Product = REMOTE_HOST_NAME + 'images/productImages/';

// Custom Arrow Components
const NextArrow = ({ onClick }) => (
    <div
        className={`${styles.arrow} ${styles.arrowNext}`}
        onClick={onClick}
        id="slider-next-arrow"
    >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    </div>
);

const PrevArrow = ({ onClick }) => (
    <div
        className={`${styles.arrow} ${styles.arrowPrev}`}
        onClick={onClick}
        id="slider-prev-arrow"
    >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
    </div>
    
);

// Налаштування для каруселі
const getSliderSettings = (photosCount) => ({
    dots: false,
    infinite: photosCount > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: photosCount > 1,
    autoplay: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
        {
            breakpoint: 768,
            settings: {
                arrows: photosCount > 1,
                dots: false,
            },
        },
    ],
});

const ProductDetail = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const { fetchProductById, getCategory } = useActions();
    const sliderRef = React.useRef(null);
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    const product = useSelector((state) => state.product.product);
    const category = useSelector((state) => state.category.currentCategory);
    const reviews = useSelector((state) => state.review.reviewsByProduct[productId] || []);

    // Завантаження продукту та відгуків при монтажі
    React.useEffect(() => {
        if (productId) {
            fetchProductById(productId);
            loadReviews();
        }
        if (product?.categoryId) {
            getCategory(product?.categoryId);
        }
    }, [productId, product?.categoryId]);

    const loadReviews = async () => {
        if (productId) {
            setReviewsLoading(true);
            try {
                await dispatch(fetchReviewsByProductId(productId));
            } catch (error) {
                console.error('Failed to load reviews:', error);
            } finally {
                setReviewsLoading(false);
            }
        }
    };

    const handleAddReview = async (reviewData) => {
        try {
            await dispatch(addReview(reviewData)).unwrap();
            setShowReviewForm(false);
            // Перезавантажуємо відгуки та продукт для оновлення рейтингу
            await loadReviews();
            await fetchProductById(productId);
        } catch (error) {
            throw new Error(error.message || 'Не вдалося додати відгук');
        }
    };

    const handleCancelReview = () => {
        setShowReviewForm(false);
    };

    if (!product) {
        return (
            <div className="text-center py-5">
                <img
                    src={productNotFound}
                    alt="Продукт не знайдено"
                    className="img-fluid mb-4"
                    style={{ width: '250px', height: '250px' }}
                />
                <h4 className="fw-bold">Халепа, продукт не знайдено 😕</h4>
                <p className="text-muted">Спробуйте повернутися на сторінку категорій.</p>
            </div>
        );
    }

    return (
        <div className={`container ${styles.container}`}>
            {/* Шапка продукту */}
            <div className="row g-4 mb-5">
                {/* Карусель зображень */}
                <div className="col-lg-6">
                    <div className={styles.imageSection}>
                        <div
                            className={styles.imageContainer}
                            onMouseEnter={() => {
                                const nextArrow = document.getElementById('slider-next-arrow');
                                const prevArrow = document.getElementById('slider-prev-arrow');
                                if (nextArrow) nextArrow.style.opacity = '1';
                                if (prevArrow) prevArrow.style.opacity = '1';
                            }}
                            onMouseLeave={() => {
                                const nextArrow = document.getElementById('slider-next-arrow');
                                const prevArrow = document.getElementById('slider-prev-arrow');
                                if (nextArrow) nextArrow.style.opacity = '0';
                                if (prevArrow) prevArrow.style.opacity = '0';
                            }}
                        >
                            {product.photos?.length > 0 ? (
                                product.photos.length === 1 ? (
                                    // Якщо тільки одне фото - показуємо без слайдера
                                    <div className={styles.singleImage}>
                                        <img
                                            src={API_URL_IMAGES_Product + product.photos[0]}
                                            alt={product.name}
                                            className={styles.mainImage}
                                        />
                                    </div>
                                ) : (
                                    // Якщо більше одного фото - показуємо слайдер
                                    <Slider
                                        ref={sliderRef}
                                        {...getSliderSettings(product.photos.length)}
                                        beforeChange={(oldIndex, newIndex) => setCurrentSlide(newIndex)}
                                    >
                                        {product.photos.map((photo, index) => (
                                            <div key={index} className="px-2">
                                                <img
                                                    src={API_URL_IMAGES_Product + photo}
                                                    alt={`${product.name} - зображення ${index + 1}`}
                                                    className={styles.mainImage}
                                                />
                                            </div>
                                        ))}
                                    </Slider>
                                )
                            ) : (
                                <div className={styles.placeholderImage}>
                                    <img
                                        src={productNotFound}
                                        alt="Зображення відсутнє"
                                        className="img-fluid"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Thumbnails якщо більше 1 фото */}
                        {product.photos?.length > 1 && (
                            <div className={styles.thumbnailContainer}>
                                {product.photos.map((photo, index) => (
                                    <img
                                        key={index}
                                        src={API_URL_IMAGES_Product + photo}
                                        alt={`Мініатюра ${index + 1}`}
                                        className={`${styles.thumbnail} ${currentSlide === index ? styles.thumbnailActive : ''}`}
                                        onClick={() => sliderRef.current?.slickGoTo(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Інформація про продукт */}
                <div className="col-lg-6">
                    <div className={styles.infoSection}>
                        {/* Категорія */}
                        <div className="mb-3">
                            <span className={styles.categoryBadge}>
                                {category?.name || 'Без категорії'}
                            </span>
                        </div>

                        {/* Назва продукту */}
                        <h1 className={styles.productTitle}>
                            {product.name}
                        </h1>

                        {/* Статус */}
                        <div className={styles.statusBadge}>
                            {getStatusLabel(product.status)}
                        </div>

                        {/* Ціна */}
                        <div className={styles.priceContainer}>
                            <div className={styles.priceWrapper}>
                                <div>
                                    <p className={styles.priceLabel}>Ціна</p>
                                    <h2 className={styles.priceValue}>
                                        {product.price} {getCurrencyLabel(product.currency)}
                                    </h2>
                                </div>
                                {(product.bargain || product.exchange || product.free) && (
                                    <div className={styles.priceBadges}>
                                        {product.exchange && (
                                            <span className="badge bg-info text-dark">☕ Без кофеїну</span>
                                        )}
                                        {product.bargain && (
                                            <span className="badge bg-success">🌱 Органічна</span>
                                        )}
                                        {product.free && (
                                            <span className="badge bg-warning text-dark">🌍 Моносорт</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Кнопка додати в кошик */}
                        <div className={styles.addToCartSection}>
                            <ProductToCartButton productId={product.id} />
                        </div>

                        {/* Основна інформація */}
                        <div className={`card ${styles.infoCard}`}>
                            <div className={styles.infoCardBody}>
                                <h5 className={styles.infoCardTitle}>Основна інформація</h5>
                                <div className={styles.infoGrid}>
                                    <div className={styles.infoItem}>
                                        <small className={styles.infoLabel}>Доставка</small>
                                        <span className={styles.infoValue}>
                                            {product.delivery || 'Не вказано'}
                                        </span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <small className={styles.infoLabel}>Дата додавання</small>
                                        <span className={styles.infoValue}>
                                            {new Date(product.upDate).toLocaleDateString('uk-UA', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Опис продукту */}
                        <div className={`card ${styles.infoCard}`}>
                            <div className={styles.infoCardBody}>
                                <h5 className={styles.infoCardTitle}>Опис</h5>
                                <p className={styles.description}>
                                    {product.description || 'Опис відсутній'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Секція рейтингу та відгуків */}
            <div className="container">
                <div className={styles.reviewsSection}>
                    {/* Загальний рейтинг */}
                    <div className={styles.ratingOverview}>
                        <h3 className={styles.sectionTitle}>Рейтинг та відгуки</h3>
                        <div className={styles.ratingDisplay}>
                            <div className={styles.ratingScore}>
                                <div className={styles.scoreNumber}>{product.rating?.toFixed(1) || '0.0'}</div>
                                <StarRating rating={product.rating || 0} readOnly={true} />
                                <div className={styles.reviewsCount}>
                                    {product.reviewsCount || 0} {product.reviewsCount === 1 ? 'відгук' : 'відгуків'}
                                </div>
                            </div>
                            {!showReviewForm && (
                                <button 
                                    className={styles.addReviewButton}
                                    onClick={() => setShowReviewForm(true)}
                                >
                                    + Додати відгук
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Форма додавання відгуку */}
                    {showReviewForm && (
                        <div className={styles.reviewFormContainer}>
                            <ReviewForm 
                                productId={productId}
                                onSubmit={handleAddReview}
                                onCancel={handleCancelReview}
                            />
                        </div>
                    )}

                    {/* Список відгуків */}
                    <ReviewsList reviews={reviews} loading={reviewsLoading} />
                </div>
            </div>
        </div>
    );
};

// Функція для відображення статусу продукту
const getStatusLabel = (status) => {
    switch (status) {
        case 0:
            return <span className="badge bg-primary">⭐ Новинка</span>;
        case 1:
            return <span className="badge bg-success">🔥 Популярний</span>;
        case 2:
            return <span className="badge bg-danger">💰 Розпродаж</span>;
        case 3:
            return <span className="badge bg-secondary">❌ Немає в наявності</span>;
        default:
            return <span className="badge bg-secondary">Невідомо</span>;
    }
};

// Функція для відображення валюти (завжди гривня для магазину кави)
const getCurrencyLabel = (currency) => {
    return <span>₴</span>;
};

export default ProductDetail;
