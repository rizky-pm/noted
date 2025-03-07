import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import routes from './routes/index.tsx';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={routes}
        future={{
          v7_startTransition: true,
        }}
      />
    </QueryClientProvider>
  </Provider>
);
