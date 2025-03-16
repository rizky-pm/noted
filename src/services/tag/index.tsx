import { useQuery } from '@tanstack/react-query';
import axiosRequest from '..';
import { IGetAllTagResponse } from '@/types/tag.type';

const useTagService = () => {
  const getAllTags = useQuery({
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

  return { getAllTags };
};

export default useTagService;
