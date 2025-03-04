export interface ISidebarMenu {
  id: string;
  path: string;
  label: string;
}

export interface INoteCard {
  id: number;
  title: string;
  tag: string;
  content: string;
  createdBy: string;
  createdAt: number;
  modifiedAt: number | null;
}
