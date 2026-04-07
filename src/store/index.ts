// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/lib/features/auth/authSlice';

// ✅ Ensure this is exported as 'makeStore'
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      // Add other reducers here as we build them
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];