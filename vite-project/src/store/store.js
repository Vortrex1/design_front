import { combineReducers, configureStore } from '@reduxjs/toolkit';
import appSettingSlice from '../store/state/reduserSlises/appSettingSlice';
import cartItemReducer from '../store/state/reduserSlises/cartItemSlice';
import categoryReducer from '../store/state/reduserSlises/categorySlice';
import containersReducer from '../store/state/reduserSlises/containerSlice';
import filtersReducer from '../store/state/reduserSlises/filtersSlice';
import manufacturerReducer from '../store/state/reduserSlises/manufacturerSlice';
import productReducer from '../store/state/reduserSlises/productSlice';
import reviewReducer from '../store/state/reduserSlises/reviewSlice';
import roleReducer from '../store/state/reduserSlises/roleSlice';
import userReducer from '../store/state/reduserSlises/userSlice';
import usersReducer from '../store/state/reduserSlises/usersSlice';
export const rootReducer = combineReducers({
    users: usersReducer,
    user: userReducer,
    role: roleReducer,
    category: categoryReducer,
    manufacturer: manufacturerReducer,
    product: productReducer,
    review: reviewReducer,
    appSettings: appSettingSlice,
    users: usersReducer,
    filters: filtersReducer,
    containers: containersReducer,
    cartItem: cartItemReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});