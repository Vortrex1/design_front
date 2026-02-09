// src/store/actions/productActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProductService } from '../../../utils/services/ProductService';
import { getCurrentProduct , getAllProduct, deleteProductById} from "../reduserSlises/productSlice";


export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const response = await ProductService.getAll();
  return response;
});

export const fetchProductById = (productId) => async (dispatch) => {
  try {
    const res = await ProductService.getById(productId);
    dispatch(getCurrentProduct(res));
  } catch (error) {
    console.error("Get product failed", error);
  }
};
export const fetchAllProducts = (filters) => async (dispatch) => {
  try {
    const res = await ProductService.getAllFiltered(filters);
    dispatch(getAllProduct(res));
  } catch (error) {
    console.error("Get products failed", error);
  }
};

export const deleteProduct = (productId) => async (dispatch) => {
  try {
    const res = await ProductService.deleteProduct(productId);
    dispatch(deleteProductById(productId));
  } catch (error) {
    console.error("Get product failed", error);
  }
};

export const addProduct = createAsyncThunk('products/add', async (product) => {
  const response = await ProductService.addProduct(product);
  return response;
});

export const updateProduct = (productData) => async (dispatch) => {
  try {
    const res = await ProductService.updateProduct(productData);
    dispatch(getCurrentProduct(res));
    return res;
  } catch (error) {
    console.error("Update product failed", error);
    throw error;
  }
};

export const uploadProductImages = (productId, formData) => async (dispatch) => {
  try {
    const res = await ProductService.uploadProductImages(productId, formData);
    dispatch(getCurrentProduct(res));
    return res;
  } catch (error) {
    console.error("Upload product images failed", error);
    throw error;
  }
};

export const deleteProductImage = (productId, photoName) => async (dispatch) => {
  try {
    const res = await ProductService.deleteProductImage(productId, photoName);
    dispatch(getCurrentProduct(res));
    return res;
  } catch (error) {
    console.error("Delete product image failed", error);
    throw error;
  }
};

export const fetchProductsByCategoryId = createAsyncThunk(
  'products/fetchByCategory',
  async ({ categoryId, filters }, { rejectWithValue }) => {
    try {

      console.log("filters", filters);

      const response = await ProductService.getByCategoryId(categoryId, filters);
      return { categoryId, products: response.items, totalPages: response.totalPages };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load products');
    }
  }
);