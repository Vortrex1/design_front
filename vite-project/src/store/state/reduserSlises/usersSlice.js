import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userList: [],
  user: null
};

export const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getAll: (state, action) => {
      state.userList = action.payload;
    },
    getUserById: (state, action) => {
      state.user = action.payload;
    },
    deleteUserSlice: (state, action) => {
      state.userList = state.userList.filter((u) => u.id != action.payload);
    }
  },
});

export const {
  getAll,
  deleteUserSlice,
  getUserById
} = usersSlice.actions;

export default usersSlice.reducer;
