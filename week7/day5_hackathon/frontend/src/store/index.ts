import { configureStore } from '@reduxjs/toolkit';
import { rawMaterialsApi } from './apis/rawMaterialsApi';
import { productsApi } from './apis/productsApi';
import { ordersApi } from './apis/ordersApi';
import { dashboardApi } from './apis/dashboardApi';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [rawMaterialsApi.reducerPath]: rawMaterialsApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(rawMaterialsApi.middleware)
      .concat(productsApi.middleware)
      .concat(ordersApi.middleware)
      .concat(dashboardApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
