import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axiosRequest from '..';
import { useDispatch } from 'react-redux';
import { signIn } from '@/features/auth/auth.slice';

interface BaseResponse {
  status: string;
  message: string;
  code: number;
}

interface AuthUser {
  id: string;
  username: string;
  email: string;
}

interface AuthResponse extends BaseResponse {
  data: AuthUser;
}

interface ISignInCredentials {
  username: string;
  password: string;
}

const useAuthenticationQuery = () => {
  const dispatch = useDispatch();

  const checkUser = useQuery<AuthUser, AxiosError<BaseResponse>>({
    queryKey: ['auth.check-user'],
    queryFn: async (): Promise<AuthUser> => {
      const response = await axiosRequest.get<AuthResponse>('/auth/me', {
        withCredentials: true,
      });

      dispatch(signIn(response.data));

      return response.data.data;
    },
    enabled: false,
    retry: false,
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

  return { checkUser, signInUser, signOutUser };
};

export default useAuthenticationQuery;
