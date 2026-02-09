import { useEffect } from 'react';
import { Button, Card, ListGroup, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import useActions from '../../../../hooks/useActions';
import styles from './AdminProductDetail.module.css';
import REMOTE_HOST_NAME from '../../../../env';
import photoNotFound from '../../../../assets/images/photoNotFound.jpg';

const AdminProductDetail = () => {
    const { productId } = useParams();
    const product = useSelector((state) => state.product.product);
    const { fetchProductById } = useActions();
    const navigate = useNavigate();

    useEffect(() => {
        if (productId) {
            fetchProductById(productId);
        }
    }, [productId]);

    // Функція для відображення статусу продукту
    const getStatusLabel = (status) => {
        switch (status) {
            case 0:
                return <span className="badge bg-success">✅ Активний</span>;
            case 1:
                return <span className="badge bg-warning text-dark">⏸️ Неактивний</span>;
            case 2:
                return <span className="badge bg-danger">❌ Відключений</span>;
            case 3:
                return <span className="badge bg-info text-dark">⏳ На перевірці</span>;
            default:
                return <span className="badge bg-secondary">Невідомо</span>;
        }
    };

    // Функція для відображення валюти
    const getCurrencyLabel = (currency) => {
        switch (currency) {
            case 0:
                return <span>₴ UAH</span>;
            case 1:
                return <span>$ USD</span>;
            case 2:
                return <span>€ EUR</span>;
            default:
                return <span>Невідомо</span>;
        }
    };

    // Вивід фото продукту (як у ProductDetail)
    const API_URL_IMAGES_Product = REMOTE_HOST_NAME + 'images/productImages/';

    return (
        <div className="container mt-5">
            <Card className={styles.productDetailCard}>
                <div className={styles.productDetailHeader}>
                    <h2 className="mb-0">Деталі продукту</h2>
                </div>
                <Card.Body>
                    {product ? (
                        <div>
                            <Row className="g-4">
                                {/* Ліва колонка - фото + основна інформація */}
                                <Col md={5}>
                                    <div className={styles.productDetailImageWrapper}>
                                        {product.photos && product.photos.length > 0 ? (
                                            <img
                                                src={API_URL_IMAGES_Product + product.photos[0]}
                                                alt={product.name}
                                                className={styles.productDetailImage}
                                                onError={e => { e.target.src = photoNotFound; e.target.onerror = null; }}
                                            />
                                        ) : (
                                            <img
                                                src={photoNotFound}
                                                alt="Фото відсутнє"
                                                className={styles.productDetailImage}
                                            />
                                        )}
                                    </div>
                                    <Card.Title className="text-primary fw-bold">{product.name}</Card.Title>
                                    <Card.Text>
                                        <strong>Опис:</strong> {product.description || 'Опис відсутній'}
                                    </Card.Text>
                                    <ListGroup variant="flush" className="bg-light rounded-3 shadow-sm">
                                        <ListGroup.Item>
                                            <strong>Ціна:</strong>{' '}
                                            <span className="text-success fw-bold">
                                                {product.price} {getCurrencyLabel(product.currency)}
                                            </span>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Статус:</strong> {getStatusLabel(product.status)}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Дата оновлення:</strong>{' '}
                                            {new Date(product.upDate).toLocaleDateString()}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>

                                {/* Права колонка - додаткова інформація */}
                                <Col md={7}>
                                    <ListGroup variant="flush" className="bg-light rounded-3 shadow-sm">
                                        <ListGroup.Item>
                                            <strong>Обмін:</strong> {product.exchange ? 'Так' : 'Ні'}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Торг:</strong> {product.bargain ? 'Так' : 'Ні'}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Безкоштовно:</strong> {product.free ? 'Так' : 'Ні'}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <strong>Доставка:</strong> {product.delivery || 'Інформація відсутня'}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                            </Row>

                            {/* Кнопка "Назад" */}
                            <div className="mt-4 text-end">
                                <Button
                                    variant="secondary"
                                    className="me-2 shadow-sm"
                                    onClick={() => navigate('/admin/products')}
                                >
                                    Назад до списку
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-muted">Завантаження...</p>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default AdminProductDetail;