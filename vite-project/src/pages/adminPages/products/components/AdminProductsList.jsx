import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../../../../store/state/actions/productActions';
import { Link } from 'react-router-dom';

const AdminProductsList = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.product.products);
    const status = useSelector((state) => state.product.status);
    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleDelete = (id) => {
        setProductToDelete(id);
        setShowModal(true);
    };

    const confirmDelete = () => {
        dispatch(deleteProduct(productToDelete));
        setShowModal(false);
        setProductToDelete(null);
    };

    const cancelDelete = () => {
        setShowModal(false);
        setProductToDelete(null);
    };

    if (status === 'loading') {
        return <div className="admin-luxury-loading">Завантаження продуктів...</div>;
    }

    if (status === 'failed') {
        return <div className="admin-luxury-empty">Помилка завантаження продуктів</div>;
    }

    if (!Array.isArray(products) || products.length === 0) {
        return <div className="admin-luxury-empty">Продукти відсутні</div>;
    }

    return (
        <>
            <div className="admin-luxury-table-container">
                <table className="admin-luxury-table">
                    <thead>
                    <tr>
                        <th>Назва</th>
                        <th>Опис</th>
                        <th style={{ width: '200px', textAlign: 'center' }}>Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td style={{ fontWeight: '600' }}>{product.name}</td>
                            <td style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {product.description || 'Немає опису'}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                 {/* <Link
                                    title="Деталі продукту"
                                    to={`/admin/product/detail/${product.id}`}
                                    className="admin-luxury-action-btn"
                                >
                                    <img
                                        src="/Icons for functions/free-icon-info-1445402.png"
                                        alt="Details"
                                        height="18"
                                    />
                                </Link>  */}
                                <Link
                                    title="Редагувати продукт"
                                    to={`/admin/product/update/${product.id}`}
                                    className="admin-luxury-action-btn"
                                >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </Link>
                                <button
                                    title="Видалити продукт"
                                    className="admin-luxury-action-btn danger"
                                    onClick={() => handleDelete(product.id)}
                                >
                                    <img
                                        src="/Icons for functions/free-icon-recycle-bin-3156999.png"
                                        alt="Delete"
                                        height="18"
                                    />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Підтвердження видалення</h5>
                                <button type="button" className="btn-close" onClick={cancelDelete}></button>
                            </div>
                            <div className="modal-body">
                                <p>Ви впевнені, що хочете видалити цей продукт?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Ні</button>
                                <button type="button" className="admin-luxury-btn" onClick={confirmDelete}>Так, видалити</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminProductsList;
