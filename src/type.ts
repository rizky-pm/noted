import { ITag } from './types/tag.type';
export interface BaseResponse {
  status: string;
  message: string;
  code: number;
}

export interface ISidebarMenu {
  id: string;
  path: string;
  label: string;
}

export interface INoteCardProps {
  id: number;
  title: string;
  tag: string;
  content: string;
  createdBy: string;
  createdAt: number;
  modifiedAt: number | null;
}

export interface INewNote {
  title: string;
  tag: string;
  content: string;
}

export interface INote {
  _id: string;
  title: string;
  content: string;
  tag: ITag;
  ownerId: string;
  createdAt: number;
  updatedAt: number;
  position: {
    x: number;
    y: number;
    order: number;
    lastMovedAt: number;
  };
}
