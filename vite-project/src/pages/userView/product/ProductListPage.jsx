import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import REMOTE_HOST_NAME from '../../../env/index';
import useActions from '../../../hooks/useActions';
import photoNotFound from '../../../assets/images/photoNotFound.jpg';
import productNotFound from '../../../assets/images/productNotFound.png';

import { Range } from 'react-range';
import ProductCard from './ProductCard';
import styles from './ProductListPage.module.css';

const API_URL_IMAGES_Category = REMOTE_HOST_NAME + 'images/categoryImages/';

const MIN = 0;
const MAX = 10000;

const ProductListPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { fetchProductsByCategoryId, getCategories, getCategory, fetchAllProducts, loadFavoriteProducts } = useActions();

  const { productsByCategory, category, categoryList, products } = useSelector((state) => ({
    productsByCategory: state.product.productsByCategory,
    products: state.product.products,
    category: state.category.currentCategory,
    categoryList: state.category.categoryList,
  }));

  const userId = useSelector(state => state.user.currentUser.id);

  useEffect(() => {
    loadFavoriteProducts(userId);
  }, [userId]);


  const [filters, setFilters] = React.useState({
    minPrice: 0,
    maxPrice: 10000,
    currency: '',
    status: '',
    searchQuery: '',
    sort: '',
    page: 1,
  });


  const currentCategory = productsByCategory[categoryId] || {};

  React.useEffect(() => {
    if (categoryId) {
      getCategory(categoryId);
      fetchProductsByCategoryId({ categoryId, filters });
    } else {
      getCategories();
      fetchAllProducts(filters);
    }
  }, [categoryId, filters]);


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };


  const goToPage = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSubcategoryClick = (subcategoryId) => {
    navigate(`/product/${subcategoryId}`);
  };

  return (
    <div className={`container ${styles.container}`}>
      {/* Шапка категорії */}
      <div className={styles.categoryHeader}>
        <div className="row g-0 align-items-center">
          {/* Ліва частина: Зображення або картки категорій */}
          {categoryId && (
            <div className="col-md-4">
              <div className={styles.categoryImageWrapper}>
                <img
                  src={category?.photo ? API_URL_IMAGES_Category + category.photo : photoNotFound}
                  alt={category?.name || 'Категорія'}
                  className={styles.categoryImage}
                />
              </div>
            </div>
          )}

          {/* Права частина: Інформація про категорію */}
          <div className={categoryId ? "col-md-8" : "col-12"}>
            <div className={styles.categoryInfo}>
              <h2 className={styles.categoryTitle}>{categoryId ? category?.name : 'Головні категорії'}</h2>

              <div>
                {/* Кнопка "Повернутися до усіх продуктів" */}
                {categoryId && (
                  <button
                    className={styles.backButton}
                    onClick={() => navigate('/product')}
                  >
                    <i className="bi bi-house me-2"></i> Повернутися до усіх продуктів
                  </button>
                )}

                {/* Кнопка "Назад до батьківської категорії" */}
                {categoryId && category?.parentId && (
                  <button
                    className={styles.backButton}
                    onClick={() => navigate(`/product/${category.parentId}`)}
                  >
                    <i className="bi bi-arrow-left me-2"></i> До батьківської категорії
                  </button>
                )}
              </div>

              {/* Відображення підкатегорій або категорій з ParentId = null */}
              <div className={styles.subcategoriesWrapper}>
                {(categoryId
                  ? category?.subCategories
                  : categoryList?.filter((cat) => !cat.parentId)
                )?.map((item) => (
                  <button
                    key={item.id}
                    className={styles.subcategoryButton}
                    onClick={() => handleSubcategoryClick(item.id)}
                  >
                    <img
                      src={item.photo ? API_URL_IMAGES_Category + item.photo : photoNotFound}
                      alt={item.name}
                      className={styles.subcategoryImage}
                    />
                    <span className={styles.subcategoryName}>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Фільтри з використанням акордеону */}
      <div className={styles.filtersCard}>
        <div className={styles.filtersHeader} id="filterHeading">
          <button
            className={styles.filtersToggle}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#filterCollapse"
            aria-expanded="true"
            aria-controls="filterCollapse"
          >
            <i className="bi bi-funnel"></i> Фільтри та пошук
          </button>
        </div>
        <div id="filterCollapse" className="collapse show" aria-labelledby="filterHeading">
          <div className={styles.filtersBody}>
            <div className="row g-3">
              {/* Ціновий діапазон через Slider */}
              <div className="col-12">
                <label className={styles.filterLabel}>Ціновий діапазон</label>
                <Range
                  step={10}
                  min={MIN}
                  max={MAX}
                  values={[filters.minPrice, filters.maxPrice]}
                  onChange={(values) =>
                    setFilters((prev) => ({
                      ...prev,
                      minPrice: values[0],
                      maxPrice: values[1],
                      page: 1,
                    }))
                  }
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: '8px',
                        width: '100%',
                        backgroundColor: '#ddd',
                        marginTop: '20px',
                      }}
                    >
                      {React.Children.map(children, (child, index) => {
                        return React.cloneElement(child, { key: `thumb-${index}` });
                      })}
                    </div>
                  )}
                  renderThumb={({ props, index }) => {
                    const { key, ...restProps } = props;
                    return (
                      <div
                        {...restProps}
                        style={{
                          ...restProps.style,
                          height: '24px',
                          width: '24px',
                          borderRadius: '12px',
                          backgroundColor: '#0d6efd',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          boxShadow: '0px 2px 6px #AAA',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: '-28px',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            padding: '2px 4px',
                            borderRadius: '4px',
                            backgroundColor: '#0d6efd',
                          }}
                        >
                          {index === 0 ? filters.minPrice : filters.maxPrice} грн
                        </div>
                      </div>
                    );
                  }}
                />
              </div>

              <div className="col-md-6 col-lg-3">
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className={`form-select ${styles.filterSelect}`}
                  aria-label="Статус"
                >
                  <option value="">Статус</option>
                  <option value="0">⭐ Новинка</option>
                  <option value="1">🔥 Популярний</option>
                  <option value="2">💰 Розпродаж</option>
                  <option value="3">❌ Немає в наявності</option>
                </select>
              </div>

              <div className="col-12 col-lg-6">
                <div className="input-group">
                  <input
                    type="text"
                    name="searchQuery"
                    value={filters.searchQuery}
                    onChange={handleFilterChange}
                    className={`form-control ${styles.searchInput}`}
                    placeholder="Пошук за назвою..."
                  />
                  <span className={`input-group-text ${styles.searchIcon}`}>
                    <i className="bi bi-search"></i>
                  </span>
                </div>
              </div>
              <div className="col-12 col-lg-6">
                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className={`form-select ${styles.filterSelect}`}
                  aria-label="Сортування"
                >
                  <option value="">Сортувати за</option>
                  <option value="0">🆕 Новіші</option>
                  <option value="1">💰 Дешевші</option>
                  <option value="2">💎 Дорожчі</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Список продуктів з покращеною стилізацією */}
      {categoryId ? (
        Array.isArray(currentCategory.items) && currentCategory.items.length > 0 ? (
          <div className={styles.productsGrid}>
            {currentCategory.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <img
              src={productNotFound}
              alt="Продуктів немає"
              className={styles.emptyStateImage}
            />
            <h4 className={styles.emptyStateTitle}>Халепа, продуктів немає 😕</h4>
            <p className={styles.emptyStateText}>Спробуйте змінити фільтри або повернутися пізніше</p>
          </div>
        )
      ) : (
        Array.isArray(products.items) && products.items.length > 0 ? (
          <div className={styles.productsGrid}>
            {products.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <img
              src={productNotFound}
              alt="Продуктів немає"
              className={styles.emptyStateImage}
            />
            <h4 className={styles.emptyStateTitle}>Халепа, продуктів немає 😕</h4>
            <p className={styles.emptyStateText}>Спробуйте змінити фільтри або повернутися пізніше</p>
          </div>
        )
      )}
      {/* Пагінація з покращеним дизайном */}
      {currentCategory.totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-5">
          <ul className={styles.pagination}>
            {Array.from({ length: currentCategory.totalPages }, (_, i) => (
              <li key={i + 1} className={styles.pageItem}>
                <button
                  className={styles.pageButton}
                  onClick={() => goToPage(i + 1)}
                  disabled={filters.page === i + 1}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ProductListPage;




