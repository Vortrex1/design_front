import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryList: [],
  currentCategory: null
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    getAll: (state, action) => {
      state.categoryList = action.payload;
    },
    addCategory: (state, action) => {
      state.categoryList.push(action.payload);
    },
    getCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
    deleteCategoryById: (state, action) => {
      state.categoryList = state.categoryList.filter(category => category.id !== action.payload);
    },
    setUpdateCategory: (state, action) => {
      const index = state.categoryList.findIndex(category => category.id === action.payload.id);
      if (index !== -1) {
        state.categoryList[index] = action.payload;
      }
    },
  },
});

export const {
  getAll,
  addCategory,
  getCurrentCategory,
  deleteCategoryById,
  setUpdateCategory,
} = categorySlice.actions;

export default categorySlice.reducer;
