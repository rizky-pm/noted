import { ITag } from '@/types/tag.type';

interface IDialogProperty {
  id: 'new-tag' | 'edit-tag' | null;
  isOpen: boolean;
}

interface IAlertProperty {
  id: 'delete-tag' | null;
  isOpen: boolean;
}

export interface ITagsSettingState {
  dialog: IDialogProperty;
  alert: IAlertProperty;
  selectedTag: ITag | null;
}
