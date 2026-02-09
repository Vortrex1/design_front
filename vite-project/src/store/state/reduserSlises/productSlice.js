// src/store/slices/productSlice.js

import { createSlice } from '@reduxjs/toolkit';
import {
  fetchProducts,
  fetchProductById,
  addProduct,
  deleteProduct,
  fetchProductsByCategoryId,
} from '../actions/productActions';

const initialState = {
  products: [],
  product: null,
  productsByCategory: {}, // key: categoryId -> value: { items: [...], page: N, totalPages: N }
  status: 'idle',
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    getAllProduct: (state, action) => {
      state.products = action.payload;
    },
    getCurrentProduct: (state, action) => {
      state.product = action.payload;
    },
    deleteProductById: (state, action) => {
      state.products = state.products.filter(product => product.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Existing cases
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // New case for fetching by category
      .addCase(fetchProductsByCategoryId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsByCategoryId.fulfilled, (state, action) => {
        const { categoryId, products, totalPages } = action.payload;

        console.log("action.payload", action.payload);

        state.productsByCategory[categoryId] = {
          ...(state.productsByCategory[categoryId] || {}),
          items: products,
          totalPages,
          currentPage: action.meta.arg.filters.page,
        };

        state.status = 'succeeded';
      })
      .addCase(fetchProductsByCategoryId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
  },
});

export const {
  getCurrentProduct,
  getAllProduct,
  deleteProductById,
} = productSlice.actions;

export default productSlice.reducer;
