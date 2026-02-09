import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  favoriteProducts: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    authUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },

    getAllFavoriteProducts: (state, action) => {
      state.favoriteProducts = action.payload;
    },

    addFavoriteProduct: (state, action) => {
      const favorite = action.payload;
      const exists = state.favoriteProducts.some(f => f.productId === favorite.productId);

      if (!exists) {
        state.favoriteProducts.push(favorite);
      }
    },


    removeFavoriteProduct: (state, action) => {

      state.favoriteProducts = state.favoriteProducts.filter(
        (fav) => {
          debugger
          return fav.id !== action.payload
          
          } 
      );
    },

  },
});

export const {
  authUser,
  logout,
  addFavoriteProduct,
  removeFavoriteProduct,
  getAllFavoriteProducts
} = userSlice.actions;

export default userSlice.reducer;
