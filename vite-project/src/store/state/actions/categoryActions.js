import { CategoryService } from "../../../utils/services/CategoryService";
import { getAll, getCurrentCategory, addCategory, deleteCategoryById, setUpdateCategory } from "../reduserSlises/categorySlice";

export const getCategories = () => async (dispatch) => {
  try {
    const res = await CategoryService.getAll();
    dispatch(getAll(res));
  } catch (error) {
    console.error("Get Categories failed", error);
  }
};
export const getCategory = (categoryId) => async (dispatch) => {
  try {
    const res = await CategoryService.getById(categoryId);
    dispatch(getCurrentCategory(res));
  } catch (error) {
    console.error("Get Category failed", error);
  }
};

export const uploadCategoryImage = (categoryId, file) => async (dispatch) => {
  try {
    const response = await CategoryService.uploadImage(categoryId, file);
    dispatch(getUserById(response));
    return { success: true, message: "Image saved!" };
  } catch (error) {
    const errorMessage = error.response?.data;
    return { success: false, message: errorMessage };
  }
};

export const createCategory = (categoryData) => async (dispatch) => {
  try {
    const res = await CategoryService.addCategory(categoryData);
    dispatch(addCategory(res));
    return { payload: res };
  } catch (error) {
    console.error("Create Category failed", error);
    throw error;
  }
};

export const deleteCategory = (categoryId) => async (dispatch) => {
  try {
    const res = await CategoryService.deleteCategory(categoryId);
    dispatch(deleteCategoryById(categoryId));
  } catch (error) {
    console.error("Get product failed", error);
  }
};
export const updateCategory = (category) => async (dispatch) => {
  try {
    const res = await CategoryService.updateCategory(category);
    dispatch(setUpdateCategory(category));
  } catch (error) {
    console.error("update Category failed", error);
  }
};


