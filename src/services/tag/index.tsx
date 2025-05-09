import { useMutation, useQuery } from '@tanstack/react-query';
import axiosRequest from '..';
import { IGetAllTagResponse } from '@/types/tag.type';
import { TypeCreateNewTagSchema } from '@/pages/authenticated/profile/components/tags-setting/components/tag-management-dialog/schema';
import { BaseResponse } from '@/type';

export const useGetAllTag = () => {
  return useQuery({
    queryKey: ['tag.get-all'],
    queryFn: async () => {
      const response = await axiosRequest.get<IGetAllTagResponse>(
        '/tag/get-all',
        {
          withCredentials: true,
        }
      );

      return response.data;
    },
  });
};

export const useCreateNewTag = () => {
  return useMutation({
    mutationKey: ['tag.create-new-tag'],
    mutationFn: async (payload: TypeCreateNewTagSchema) => {
      const response = await axiosRequest.post<BaseResponse>(
        '/tag/create-new-tag',
        payload,
        { withCredentials: true }
      );

      return response;
    },
  });
};

export const useDeleteTagById = () => {
  return useMutation({
    mutationKey: ['tag.delete-tag'],
    mutationFn: async (id: string) => {
      const response = await axiosRequest.delete<BaseResponse>(
        `/tag/delete/${id}`,
        {
          withCredentials: true,
        }
      );

      return response;
    },
  });
};

interface IEditTagByIdPayload {
  tagId: string;
  name: string | undefined;
  color: string | undefined;
}

export const useEditTagById = () => {
  return useMutation({
    mutationKey: ['tag.edit-tag'],
    mutationFn: async (payload: IEditTagByIdPayload) => {
      const response = await axiosRequest.patch<BaseResponse>(
        '/tag/edit',
        payload,
        { withCredentials: true }
      );

      return response;
    },
  });
};
