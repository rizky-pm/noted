import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth/auth.slice';
import dashboardReducer from '@/pages/authenticated/dashboard/state';
import filterReducer from '@/pages/authenticated/dashboard/components/actions/actions.slice';
import tagReducer from './tag/tag.slice';
import globalReducer from './global/global.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    filter: filterReducer,
    tag: tagReducer,
    global: globalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
