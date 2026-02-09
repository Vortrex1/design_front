import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form } from 'react-bootstrap';
import { TreeSelect } from 'primereact/treeselect';
import useActions from '../../../../../hooks/useActions';
import '../../AdminProductForm.css';

const CreateProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(0);
    const [exchange, setExchange] = useState(false);
    const [bargain, setBargain] = useState(false);
    const [free, setFree] = useState(false);
    const [currency, setCurrency] = useState(0);
    const [delivery, setDelivery] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { createCategory, getCategories, addProduct } = useActions();
    const navigate = useNavigate();
    const categories = useSelector(state => state.category?.categoryList || []);

    // Для дерева категорій
    const [selectedCategoryKey, setSelectedCategoryKey] = useState("");
    const allOption = { key: "main", label: "Головна категорія" };

    // Мапінг категорій у дерево
    const mapCategoriesToCategoryTree = (categoryList) => {
        return categoryList.map((item) => {
            const tree = {
                id: item.id,
                key: item.id,
                label: item.name,
                children: item.subCategories
                    ? mapCategoriesToCategoryTree(item.subCategories)
                    : [],
            };
            return tree;
        });
    };
    const categoriesTree = mapCategoriesToCategoryTree(categories);
    const categoriesTreeWithAll = [allOption, ...categoriesTree];
    
    useEffect(() => {
        getCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const newProduct = {
                name,
                price: parseFloat(price),
                description,
                status,
                exchange,
                bargain,
                free,
                currency: 0, // Always UAH for coffee shop
                delivery,
                categoryId
            };

            await addProduct(newProduct);
            navigate('/admin/products');
        } catch (error) {
            console.error('Помилка створення продукту:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreateCategory = async () => {
        try {
            const newCategory = await createCategory({ name: newCategoryName });
            if (newCategory?.payload?.id) {
                setCategoryId(newCategory.payload.id);
            }
            setShowModal(false);
            await getCategories();
        } catch (error) {
            console.error('Помилка створення категорії:', error);
        }
    };

    return (
        <div className="admin-product-form-container">
            <div className="admin-product-form-wrapper">
                <div className="admin-form-header">
                    <h1 className="admin-form-title">✨ Створити продукт</h1>
                    <p className="admin-form-subtitle">Додайте новий продукт до каталогу</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-form-content">
                    {/* Основна інформація */}
                    <div className="admin-form-section">
                        <h3 className="admin-form-section-title">
                            <span className="admin-form-section-icon">📝</span>
                            Основна інформація
                        </h3>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Назва продукту</label>
                            <input
                                type="text"
                                className="admin-form-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Введіть назву продукту"
                                required
                            />
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Опис</label>
                            <textarea
                                className="admin-form-textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Детальний опис продукту"
                                rows="5"
                            ></textarea>
                        </div>
                    </div>

                    {/* Ціна та валюта */}
                    <div className="admin-form-section">
                        <h3 className="admin-form-section-title">
                            <span className="admin-form-section-icon">💰</span>
                            Ціна та валюта
                        </h3>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Ціна</label>
                            <input
                                type="number"
                                className="admin-form-input"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0.00"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Валюта</label>
                            <select
                                className="admin-form-select"
                                value={0}
                                disabled
                                title="Для магазину кави використовується тільки гривня"
                            >
                                <option value={0}>₴ Гривня (UAH)</option>
                            </select>
                            <small className="text-muted">Фіксована валюта для магазину кави</small>
                        </div>
                    </div>

                    {/* Характеристики кави */}
                    <div className="admin-form-section">
                        <h3 className="admin-form-section-title">
                            <span className="admin-form-section-icon">☕</span>
                            Характеристики кави
                        </h3>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Статус товару</label>
                            <select
                                className="admin-form-select"
                                value={status}
                                onChange={(e) => setStatus(parseInt(e.target.value))}
                                required
                            >
                                <option value={0}>⭐ Новинка</option>
                                <option value={1}>🔥 Популярний</option>
                                <option value={2}>💰 Розпродаж</option>
                                <option value={3}>❌ Немає в наявності</option>
                            </select>
                        </div>

                        <div className="admin-checkbox-group">
                            <div className="admin-checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    className="admin-checkbox"
                                    id="exchangeCheck"
                                    checked={exchange}
                                    onChange={(e) => setExchange(e.target.checked)}
                                />
                                <label className="admin-checkbox-label" htmlFor="exchangeCheck">
                                    ☕ Без кофеїну (Decaf)
                                </label>
                            </div>

                            <div className="admin-checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    className="admin-checkbox"
                                    id="bargainCheck"
                                    checked={bargain}
                                    onChange={(e) => setBargain(e.target.checked)}
                                />
                                <label className="admin-checkbox-label" htmlFor="bargainCheck">
                                    🌱 Органічна
                                </label>
                            </div>

                            <div className="admin-checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    className="admin-checkbox"
                                    id="freeCheck"
                                    checked={free}
                                    onChange={(e) => setFree(e.target.checked)}
                                />
                                <label className="admin-checkbox-label" htmlFor="freeCheck">
                                    🌍 Моносорт (Single Origin)
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Доставка та категорія */}
                    <div className="admin-form-section">
                        <h3 className="admin-form-section-title">
                            <span className="admin-form-section-icon">🚚</span>
                            Доставка та категорія
                        </h3>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Спосіб доставки</label>
                            <select
                                className="admin-form-select"
                                value={delivery}
                                onChange={(e) => setDelivery(e.target.value)}
                                required
                            >
                                <option value="">Оберіть спосіб доставки</option>
                                <option value="Нова Пошта">📦 Нова Пошта</option>
                                <option value="Укрпошта">📮 Укрпошта</option>
                                <option value="Самовивіз">🏪 Самовивіз</option>
                                <option value="Кур'єр">🚴 Кур'єр</option>
                            </select>
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Категорія</label>
                            <div className="admin-category-select-wrapper">
                                <TreeSelect
                                    value={selectedCategoryKey}
                                    options={categoriesTreeWithAll}
                                    onChange={(e) => {
                                        if (e.value === 'new') {
                                            setShowModal(true);
                                        } else {
                                            setSelectedCategoryKey(e.value);
                                            setCategoryId(e.value === 'main' ? null : e.value);
                                        }
                                    }}
                                    selectionMode="single"
                                    placeholder="Виберіть категорію або підкатегорію"
                                    className="w-100 mt-2"
                                    appendTo={document.body}
                                    required
                                />
                                <a
                                    href="#"
                                    className="admin-category-create-link"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowModal(true);
                                    }}
                                >
                                    <span>+</span> Створити нову категорію
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Кнопки */}
                    <div className="admin-form-button-group">
                        <button
                            type="submit"
                            className="admin-btn admin-btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <span className="admin-loading-spinner"></span>}
                            {isSubmitting ? 'Створення...' : '✅ Створити продукт'}
                        </button>
                        <button
                            type="button"
                            className="admin-btn admin-btn-secondary"
                            onClick={() => navigate('/admin/products')}
                            disabled={isSubmitting}
                        >
                            ❌ Скасувати
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal для створення категорії */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Створити нову категорію</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNewCategoryName">
                            <Form.Label>Назва нової категорії</Form.Label>
                            <Form.Control
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Закрити</Button>
                    <Button variant="primary" onClick={handleCreateCategory}>Створити</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CreateProduct;
