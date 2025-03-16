import { BaseResponse, INote } from '@/type';

export interface IGetAllNoteResponse extends BaseResponse {
  data: {
    page: number;
    limit: number;
    totalPages: number;
    notes: INote[];
  };
}
