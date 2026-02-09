import { createAsyncThunk } from '@reduxjs/toolkit';
import { ReviewService } from '../../../utils/services/ReviewService';
import { setCurrentReview } from '../reduserSlises/reviewSlice';

export const fetchReviews = createAsyncThunk('reviews/fetchAll', async () => {
  const response = await ReviewService.getAll();
  return response;
});

export const fetchReviewsByProductId = createAsyncThunk(
  'reviews/fetchByProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await ReviewService.getByProductId(productId);
      return { productId, reviews: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load reviews');
    }
  }
);

export const fetchReviewById = (reviewId) => async (dispatch) => {
  try {
    const res = await ReviewService.getById(reviewId);
    dispatch(setCurrentReview(res));
  } catch (error) {
    console.error('Get review failed', error);
  }
};

export const addReview = createAsyncThunk('reviews/add', async (review) => {
  const response = await ReviewService.create(review);
  return response;
});

export const updateReview = createAsyncThunk('reviews/update', async (review) => {
  const response = await ReviewService.update(review);
  return response;
});

export const deleteReview = createAsyncThunk('reviews/delete', async (reviewId, { rejectWithValue }) => {
  try {
    await ReviewService.delete(reviewId);
    return reviewId;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to delete review');
  }
});
