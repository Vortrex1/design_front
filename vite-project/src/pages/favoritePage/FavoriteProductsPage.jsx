import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useActions from "../../hooks/useActions";
import ProductCard from "../userView/product/ProductCard";

const FavoriteProductsPage = () => {
    const userId = useSelector(state => state.user.currentUser.id);
    const favoriteProducts = useSelector(state => state.user.favoriteProducts);
    const allProducts = useSelector(state => state.product.products.items || []);
    const filters = {
        minPrice: 0,
        maxPrice: 10000,
        currency: '',
        status: '',
        searchQuery: '',
        sort: '',
        page: 1,
    };

    const { loadFavoriteProducts, fetchAllProducts } = useActions();

    useEffect(() => {
        if (userId) {
            loadFavoriteProducts(userId);
        }
        fetchAllProducts(filters);
    }, [userId]);

    const favoriteFullProducts = favoriteProducts
        .map(fav => allProducts.find(prod => prod.id === fav.productId))
        .filter(Boolean);

    if (favoriteFullProducts.length === 0) {
        return <div className="text-center mt-4">У вас ще немає улюблених продуктів.</div>;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Улюблені товари</h2>
            <div className="row g-4">
                {favoriteFullProducts.map(product => (
                    <div className="col-md-4" key={product.id}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavoriteProductsPage;
