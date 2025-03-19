import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth/auth.slice';
import dashboardReducer from '@/pages/authenticated/dashboard/state';
import filtersReducer from '@/pages/authenticated/dashboard/components/actions/actions.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    filters: filtersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
