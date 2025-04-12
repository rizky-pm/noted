import { AxiosError } from 'axios';

export const getAxiosError = (error: unknown) => {
  const err = error as AxiosError<{
    message: string;
    data?: {
      errorCode: string;
    };
  }>;

  return {
    message: err.response?.data?.message ?? 'Something went wrong',
    errorCode: err.response?.data?.data?.errorCode ?? '',
    status: err.response?.status,
  };
};
