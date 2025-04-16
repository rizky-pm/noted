import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import axiosRequest from '..';
import { useDispatch } from 'react-redux';
import { signIn } from '@/store/auth/auth.slice';
import { BaseResponse } from '@/type';
import {
  AuthResponse,
  AuthUser,
  ISignInCredentials,
  ISignUpCredentials,
} from './type';

const useAuthenticationQuery = () => {
  const dispatch = useDispatch();

  const checkUser = useQuery<AuthUser, AxiosError<BaseResponse>>({
    queryKey: ['auth.check-user'],
    queryFn: async (): Promise<AuthUser> => {
      const response = await axiosRequest.get<AuthResponse>('/auth/me', {
        withCredentials: true,
      });

      dispatch(signIn(response.data));

      return response.data.data ?? null;
    },
    enabled: false,
    retry: false,
    staleTime: 0,
  });

  const signUpUser = useMutation({
    mutationKey: ['auth.sign-up-user'],
    mutationFn: async (
      credentials: ISignUpCredentials
    ): Promise<BaseResponse> => {
      const response = await axiosRequest.post('/auth/register', credentials, {
        withCredentials: true,
      });

      return response.data;
    },
  });

  const signInUser = useMutation<
    AuthUser,
    AxiosError<BaseResponse>,
    ISignInCredentials
  >({
    mutationKey: ['auth.sign-in-user'],
    mutationFn: async (credentials: ISignInCredentials): Promise<AuthUser> => {
      const response = await axiosRequest.post('/auth/login', credentials, {
        withCredentials: true,
      });

      return response.data;
    },
  });

  const signOutUser = useMutation({
    mutationKey: ['auth.sign-out-user'],
    mutationFn: async (): Promise<BaseResponse> => {
      const response = await axiosRequest.post(
        '/auth/logout',
        {},
        { withCredentials: true }
      );

      return response.data;
    },
    onError: (error) => {
      console.error('Logout failed', error.message || 'Unknown error');
    },
  });

  return { checkUser, signInUser, signOutUser, signUpUser };
};

export const useEditProfile = () => {
  return useMutation<
    AxiosResponse,
    AxiosError,
    { avatar: string | null | undefined; username: string }
  >({
    mutationKey: ['auth.edit-profile'],
    mutationFn: async (payload) => {
      return await axiosRequest.patch('/auth/edit-profile', payload, {
        withCredentials: true,
      });
    },
  });
};

export const useChangePassword = () => {
  return useMutation<
    AxiosResponse,
    AxiosError,
    { oldPassword: string; newPassword: string }
  >({
    mutationKey: ['auth.change-password'],
    mutationFn: async (payload) => {
      return await axiosRequest.patch('/auth/change-password', payload, {
        withCredentials: true,
      });
    },
  });
};

export const useRequestToResetPassword = () => {
  return useMutation<AxiosResponse, AxiosError, { email: string }>({
    mutationKey: ['auth.request-reset-password'],
    mutationFn: async (payload) => {
      return await axiosRequest.post('/auth/reset-password', payload);
    },
  });
};

interface IValidateResetPasswordSessionPayload {
  token: string;
  email: string;
}

export const useValidateResetPasswordSession = (
  payload: IValidateResetPasswordSessionPayload
) => {
  return useQuery({
    queryKey: ['auth.validate-reset-password-session'],
    queryFn: async () => {
      const response = await axiosRequest.get<BaseResponse>(
        `/auth/validate-reset-password-session?email=${payload.email}&token=${payload.token}`
      );

      return response.data;
    },
    retry: 0,
  });
};

interface IResetPasswordPayload {
  newPassword: string;
  email: string;
  token: string;
}

export const useResetPassword = () => {
  return useMutation<AxiosResponse, AxiosError, IResetPasswordPayload>({
    mutationKey: ['auth.reset-password'],
    mutationFn: async (payload) => {
      return await axiosRequest.patch('/auth/reset-password', payload);
    },
  });
};

export default useAuthenticationQuery;
