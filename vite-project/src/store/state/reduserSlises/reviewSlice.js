import { createSlice } from '@reduxjs/toolkit';
import { fetchReviews, fetchReviewsByProductId, addReview, updateReview, deleteReview } from '../actions/reviewActions';

const initialState = {
  reviews: [],
  reviewsByProduct: {}, // productId -> array of reviews
  currentReview: null,
  status: 'idle',
  error: null,
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setCurrentReview: (state, action) => {
      state.currentReview = action.payload;
    },
    removeReviewById: (state, action) => {
      state.reviews = state.reviews.filter(r => r.id !== action.payload);
      // Also remove from reviewsByProduct
      Object.keys(state.reviewsByProduct).forEach(pid => {
        state.reviewsByProduct[pid] = state.reviewsByProduct[pid].filter(r => r.id !== action.payload);
      });
    },
    addReviewLocally: (state, action) => {
      state.reviews.unshift(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(fetchReviewsByProductId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReviewsByProductId.fulfilled, (state, action) => {
        const { productId, reviews } = action.payload;
        state.reviewsByProduct[productId] = reviews;
        state.status = 'succeeded';
      })
      .addCase(fetchReviewsByProductId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(addReview.fulfilled, (state, action) => {
        // Prepend to global reviews and per-product list if applicable
        state.reviews.unshift(action.payload);
        const pid = action.payload.productId;
        if (pid) {
          state.reviewsByProduct[pid] = [action.payload].concat(state.reviewsByProduct[pid] || []);
        }
      })

      .addCase(updateReview.fulfilled, (state, action) => {
        const updated = action.payload;
        state.reviews = state.reviews.map(r => r.id === updated.id ? updated : r);
        if (updated.productId && state.reviewsByProduct[updated.productId]) {
          state.reviewsByProduct[updated.productId] = state.reviewsByProduct[updated.productId].map(r => r.id === updated.id ? updated : r);
        }
      })

      .addCase(deleteReview.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        const reviewId = action.payload;
        state.reviews = state.reviews.filter(r => r.id !== reviewId);
        // Also remove from reviewsByProduct
        Object.keys(state.reviewsByProduct).forEach(pid => {
          state.reviewsByProduct[pid] = state.reviewsByProduct[pid].filter(r => r.id !== reviewId);
        });
        state.status = 'succeeded';
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { setCurrentReview, removeReviewById, addReviewLocally } = reviewSlice.actions;

export default reviewSlice.reducer;
