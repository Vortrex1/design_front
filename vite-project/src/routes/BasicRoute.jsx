import { memo } from "react";
import { Route, Routes } from "react-router-dom";
import NotFoundPage from "../components/NotFoundPage";
import Layout from "../components/layout/Layout";
import Login from "../pages/auth/login/Login";
import Register from "../pages/auth/register/Register";
import ProductListPage from "../pages/userView/product/ProductListPage.jsx";
import HomePage from "../pages/home/HomePage";
import MyProfilePage from "../pages/myProfile/MyProfilePage";
import AdminProductsPage from "../pages/adminPages/products/AdminProductsPage.jsx";
import AdminProductDetail from "../pages/adminPages/products/components/AdminProductDetail.jsx";
import UpdateProductPage from "../pages/adminPages/products/components/UpdateProductPage.jsx";
import CreateProduct from "../pages/adminPages/products/components/modals/CreateProduct.jsx";
import AdminUsersPage from "../pages/adminPages/users/AdminUsersPage.jsx";
import ProtectedRoute from "./ProtectedRoute";
import ProductDetail from "../pages/userView/product/ProductDetail.jsx";
import FavoriteProductsPage from "../pages/favoritePage/FavoriteProductsPage.jsx";
import CategoriesAdminList from "../pages/adminPages/categories/CategoriesAdminList.jsx";
import CreateCategoryPage from "../pages/adminPages/categories/components/CreateCategoryPage.jsx";
import UpdateCategoryPage from "../pages/adminPages/categories/components/UpdateCategoryPage.jsx";
import CartItemsPage from "../pages/userView/cartItems/CartitemsPage.jsx";
import OrderPage from "../pages/userView/cartItems/components/OrderPage.jsx";
import CheckoutPage from "../pages/userView/checkout/CheckoutPage.jsx";
import PaymentSuccessPage from "../pages/userView/checkout/PaymentSuccessPage.jsx";
import OrdersPage from "../pages/userView/orders/OrdersPage.jsx";

const BasicRoute = memo(() => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />

                    <Route path="/admin/products">
                        <Route
                            index
                            element={
                                <ProtectedRoute allowedRoles={["Administrator"]}>
                                    <AdminProductsPage />
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                    <Route path="/admin/category">
                        <Route
                            index
                            element={
                                <ProtectedRoute allowedRoles={["Administrator"]}>
                                    <CategoriesAdminList />
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                    <Route path="/admin/category/create">
                        <Route
                            index
                            element={
                                <ProtectedRoute allowedRoles={["Administrator"]}>
                                    <CreateCategoryPage />
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                    <Route path="/admin/category/update/:categoryId">
                        <Route
                            index
                            element={
                                <ProtectedRoute allowedRoles={["Administrator"]}>
                                    <UpdateCategoryPage />
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute allowedRoles={["Administrator"]}>
                                <AdminUsersPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute allowedRoles={["User", "Manager"]}>
                                <MyProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/product/detail/:productId"
                        element=
                        {
                            <ProtectedRoute allowedRoles={["Administrator"]}>
                                <AdminProductDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/product/update/:productId"
                        element=
                        {
                            <ProtectedRoute allowedRoles={["Administrator"]}>
                                <UpdateProductPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/product/add"
                        element=
                        {
                            <ProtectedRoute allowedRoles={["Administrator"]}>
                                <CreateProduct />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/product/:categoryId"
                        element={
                            <ProtectedRoute allowedRoles={["User", "Manager"]}>
                                <ProductListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/product"
                        element={
                            <ProtectedRoute allowedRoles={["User", "Manager"]}>
                                <ProductListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/product/detail/:productId"
                        element={
                            <ProtectedRoute allowedRoles={["User", "Manager"]}>
                                <ProductDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/favorites"
                        element={
                            <ProtectedRoute allowedRoles={["User", "Manager"]}>
                                <FavoriteProductsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/cartItems"
                        element={
                            <ProtectedRoute allowedRoles={["User", "Manager"]}>
                                <CartItemsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/order-delivery"
                        element={
                            <ProtectedRoute allowedRoles={["User", "Manager"]}>
                                <OrderPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute allowedRoles={["User", "Manager"]}>
                                <CheckoutPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/payment-success"
                        element={
                            <ProtectedRoute allowedRoles={["User", "Manager"]}>
                                <PaymentSuccessPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute allowedRoles={["User", "Manager"]}>
                                <OrdersPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </>
    );
});

export default BasicRoute;