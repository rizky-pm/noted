import { BaseResponse } from '@/type';

export interface ITag {
  code: string;
  createdAt: number;
  createdBy: number;
  label: string;
  updatedAt: string;
  color: 'red' | 'blue' | 'yellow' | 'green';
  _id: string;
  deletable: boolean;
}

export interface IGetAllTagResponse extends BaseResponse {
  data: ITag[];
}
