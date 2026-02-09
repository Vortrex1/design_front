import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Form, Field, FormikProvider, useFormik, ErrorMessage } from "formik";
import { TreeSelect } from "primereact/treeselect";
import { useSelector } from "react-redux";
import useActions from "../../../../hooks/useActions";
import REMOTE_HOST_NAME from "../../../../env";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AdminLayout from "../../../../components/layout/AdminLayout";
import photoNotFound from '../../../../assets/images/photoNotFound.jpg';
import '../AdminProductForm.css';

const API_URL = REMOTE_HOST_NAME + 'images/productImages/';

// Validation schema for product update
const ProductUpdateSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Назва продукту повинна мати щонайменше 3 символи")
    .required("Назва обов'язкова"),
  price: Yup.number()
    .min(0, "Ціна не може бути від'ємною")
    .required("Ціна обов'язкова"),
  description: Yup.string()
    .min(10, "Опис повинен містити щонайменше 10 символів"),
});

const UpdateProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { updateProduct, fetchProductById, getCategories, uploadProductImages, deleteProductImage } = useActions();
  const { categoryList } = useSelector((store) => store.category);
  const product = useSelector((state) => state.product.product);

  const [selectedCategoryKey, setSelectedCategoryKey] = useState(product?.categoryId || "");
  const [selectedFiles, setSelectedFiles] = useState([]); // State for multiple files
  const [existingPhotos, setExistingPhotos] = useState([]); // Existing photos
  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);

  // Update selected category when product changes
  useEffect(() => {
    if (product?.categoryId) {
      setSelectedCategoryKey(product.categoryId);
      setExistingPhotos(product.photos || []);
    }
  }, [product]);

  // Load category list and current product on mount
  useEffect(() => {
    if (!categoryList.length) getCategories();
    if (productId) fetchProductById(productId);
  }, [productId]);

  // Handle file selection for photo upload (multiple files)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  // Handle deleting existing photo
  const handleDeletePhoto = async (photoName) => {
    try {
      await deleteProductImage(productId, photoName);
      toast.success("Фото видалено успішно");
      setExistingPhotos(existingPhotos.filter(photo => photo !== photoName));
    } catch (error) {
      toast.error("Помилка видалення фото");
    }
  };

  // Handle product update (main data)
  const handleUpdateProduct = async (values) => {
    setIsUpdatingProduct(true);
    try {
      const updateData = {
        id: productId,
        name: values.name,
        price: values.price,
        description: values.description,
        status: values.status,
        exchange: values.exchange,
        bargain: values.bargain,
        free: values.free,
        currency: values.currency,
        delivery: values.delivery,
        categoryId: values.categoryId,
      };
      await updateProduct(updateData);
      toast.success("Продукт оновлено успішно");
    } catch (error) {
      toast.error("Помилка оновлення продукту");
    } finally {
      setIsUpdatingProduct(false);
    }
  };

  // Handle photos upload
  const handleUploadPhotos = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploadingPhotos(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("imagesFiles", file);
      });

      await uploadProductImages(productId, formData);
      toast.success("Фото завантажено успішно");
      setSelectedFiles([]);
      // Refresh product data
      await fetchProductById(productId);
    } catch (error) {
      toast.error("Помилка завантаження фото");
    } finally {
      setIsUploadingPhotos(false);
    }
  };

  // Initial values for Formik
  const initialValues = {
    name: product?.name || "",
    price: product?.price || 0,
    description: product?.description || "",
    status: product?.status ?? 0,
    exchange: product?.exchange || false,
    bargain: product?.bargain || false,
    free: product?.free || false,
    currency: product?.currency ?? 0,
    delivery: product?.delivery || "",
    categoryId: product?.categoryId || null,
  };

  // Initialize Formik
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: handleUpdateProduct,
    validationSchema: ProductUpdateSchema,
    enableReinitialize: true,
    validateOnChange: true,
  });

  const {
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    values,
  } = formik;

  // Handle parent category change
  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.value;
    setSelectedCategoryKey(selectedCategoryId);
    setFieldValue("categoryId", selectedCategoryId);
  };

  // Map categories to tree structure (only leaf categories)
  const mapCategoriesToCategoryTree = (categoryList) => {
    return categoryList.flatMap((item) => {
      // If category has subcategories, return only subcategories
      if (item.subCategories && item.subCategories.length > 0) {
        return mapCategoriesToCategoryTree(item.subCategories);
      }
      // Otherwise, return the category itself
      return {
        id: item.id,
        key: item.id,
        label: item.name,
      };
    });
  };

  const categoriesTree = mapCategoriesToCategoryTree(categoryList);

  if (!product) {
    return (
      <AdminLayout>
        <div className="admin-product-form-container">
          <div className="admin-product-form-wrapper">
            <div className="admin-form-header">
              <h1 className="admin-form-title">⏳ Завантаження...</h1>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-product-form-container">
        <div className="admin-product-form-wrapper">
          <div className="admin-form-header">
            <h1 className="admin-form-title">✏️ Редагувати продукт</h1>
            <p className="admin-form-subtitle">Оновіть інформацію про продукт</p>
          </div>

          <FormikProvider value={formik}>
            <Form onSubmit={handleSubmit} className="admin-form-content">
              {/* Основна інформація */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">
                  <span className="admin-form-section-icon">📝</span>
                  Основна інформація
                </h3>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="name">Назва продукту</label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="admin-form-input"
                    placeholder="Введіть назву продукту"
                    onChange={handleChange}
                    value={values.name}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="admin-form-error"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="description">Опис</label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    className="admin-form-textarea"
                    placeholder="Детальний опис продукту"
                    onChange={handleChange}
                    value={values.description}
                    rows="5"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="admin-form-error"
                  />
                </div>
              </div>

              {/* Ціна та валюта */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">
                  <span className="admin-form-section-icon">💰</span>
                  Ціна та валюта
                </h3>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="price">Ціна</label>
                  <Field
                    type="number"
                    id="price"
                    name="price"
                    className="admin-form-input"
                    placeholder="0.00"
                    onChange={handleChange}
                    value={values.price}
                    step="0.01"
                  />
                  <ErrorMessage
                    name="price"
                    component="div"
                    className="admin-form-error"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="currency">Валюта</label>
                  <Field
                    as="select"
                    id="currency"
                    name="currency"
                    className="admin-form-select"
                    value={0}
                    disabled
                  >
                    <option value={0}>₴ Гривня (UAH)</option>
                  </Field>
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
                  <label className="admin-form-label" htmlFor="status">Статус товару</label>
                  <Field
                    as="select"
                    id="status"
                    name="status"
                    className="admin-form-select"
                    onChange={handleChange}
                    value={values.status}
                  >
                    <option value={0}>⭐ Новинка</option>
                    <option value={1}>🔥 Популярний</option>
                    <option value={2}>💰 Розпродаж</option>
                    <option value={3}>❌ Немає в наявності</option>
                  </Field>
                </div>

                <div className="admin-checkbox-group">
                  <div className="admin-checkbox-wrapper">
                    <Field
                      type="checkbox"
                      id="exchange"
                      name="exchange"
                      className="admin-checkbox"
                      checked={values.exchange}
                    />
                    <label className="admin-checkbox-label" htmlFor="exchange">
                      ☕ Без кофеїну (Decaf)
                    </label>
                  </div>

                  <div className="admin-checkbox-wrapper">
                    <Field
                      type="checkbox"
                      id="bargain"
                      name="bargain"
                      className="admin-checkbox"
                      checked={values.bargain}
                    />
                    <label className="admin-checkbox-label" htmlFor="bargain">
                      🌱 Органічна
                    </label>
                  </div>

                  <div className="admin-checkbox-wrapper">
                    <Field
                      type="checkbox"
                      id="free"
                      name="free"
                      className="admin-checkbox"
                      checked={values.free}
                    />
                    <label className="admin-checkbox-label" htmlFor="free">
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
                  <label className="admin-form-label" htmlFor="delivery">Спосіб доставки</label>
                  <Field
                    as="select"
                    id="delivery"
                    name="delivery"
                    className="admin-form-select"
                    onChange={handleChange}
                    value={values.delivery}
                  >
                    <option value="">Оберіть спосіб доставки</option>
                    <option value="Нова Пошта">📦 Нова Пошта</option>
                    <option value="Укрпошта">📮 Укрпошта</option>
                    <option value="Самовивіз">🏪 Самовивіз</option>
                    <option value="Кур'єр">🚴 Кур'єр</option>
                  </Field>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="categoryId">Категорія</label>
                  <TreeSelect
                    value={selectedCategoryKey}
                    options={categoriesTree}
                    onChange={handleCategoryChange}
                    selectionMode="single"
                    placeholder="Оберіть категорію"
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Фотографії */}
              <div className="admin-form-section">
                <h3 className="admin-form-section-title">
                  <span className="admin-form-section-icon">📸</span>
                  Фотографії продукту
                </h3>

                {/* Поточні фото */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Поточні фото</label>
                  {existingPhotos.length > 0 ? (
                    <div className="admin-image-preview-grid">
                      {existingPhotos.map((photo, index) => (
                        <div key={index} className="admin-image-preview-item">
                          <img
                            src={API_URL + photo}
                            alt={`Product ${index + 1}`}
                            className="admin-image-preview-img"
                            onError={(e) => {
                              e.target.src = photoNotFound;
                              e.target.onerror = null;
                            }}
                          />
                          <button
                            type="button"
                            className="admin-image-delete-btn"
                            onClick={() => handleDeletePhoto(photo)}
                            title="Видалити фото"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>Немає фото</p>
                  )}
                </div>

                {/* Завантаження нових фото */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Додати нові фото</label>
                  <div className="admin-image-upload-area">
                    <input
                      type="file"
                      id="newPhotos"
                      className="admin-image-upload-input"
                      onChange={handleFileChange}
                      multiple
                      accept="image/*"
                    />
                    <div className="admin-image-upload-icon">📁</div>
                    <div className="admin-image-upload-text">
                      Перетягніть файли сюди або натисніть для вибору
                    </div>
                    <div className="admin-image-upload-hint">
                      Підтримуються: JPG, PNG, GIF (до 5 МБ)
                    </div>
                  </div>

                  {/* Попередній перегляд нових фото */}
                  {selectedFiles.length > 0 && (
                    <div className="admin-image-preview-grid" style={{ marginTop: '20px' }}>
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="admin-image-preview-item">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="admin-image-preview-img"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Кнопки */}
              <div className="admin-form-button-group">
                <button
                  className="admin-btn admin-btn-primary"
                  type="submit"
                  disabled={isUpdatingProduct}
                >
                  {isUpdatingProduct && <span className="admin-loading-spinner"></span>}
                  {isUpdatingProduct ? "Оновлення..." : "💾 Оновити продукт"}
                </button>
                <button
                  className="admin-btn admin-btn-success"
                  type="button"
                  onClick={handleUploadPhotos}
                  disabled={selectedFiles.length === 0 || isUploadingPhotos}
                >
                  {isUploadingPhotos && <span className="admin-loading-spinner"></span>}
                  {isUploadingPhotos ? "Завантаження..." : "📤 Завантажити фото"}
                </button>
                <button
                  className="admin-btn admin-btn-secondary"
                  type="button"
                  onClick={() => navigate('/admin/products')}
                >
                  ❌ Скасувати
                </button>
              </div>
            </Form>
          </FormikProvider>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UpdateProductPage;
