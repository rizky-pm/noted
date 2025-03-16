import { BaseResponse } from '@/type';

export interface ITag {
  code: string;
  createdAt: number;
  createdBy: number;
  label: string;
  updatedAt: string;
  _id: string;
}

export interface IGetAllTagResponse extends BaseResponse {
  data: ITag[];
}
