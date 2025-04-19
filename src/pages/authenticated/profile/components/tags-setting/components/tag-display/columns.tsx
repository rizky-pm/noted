import { ITag } from '@/types/tag.type';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';

export const columns: ColumnDef<ITag>[] = [
  {
    accessorKey: 'label',
    header: 'Label',
  },
  {
    accessorKey: 'color',
    header: 'Color',
  },
  // {
  //   accessorKey: 'createdAt',
  //   header: 'Created At',
  //   cell: ({ row }) => {
  //     const formattedDate = dayjs
  //       .unix(row.getValue('createdAt'))
  //       .format('D MMMM YYYY');

  //     return <span>{formattedDate}</span>;
  //   },
  // },
  // {
  //   accessorKey: 'updatedAt',
  //   header: 'Updated At',
  //   cell: ({ row }) => {
  //     const formattedDate = dayjs
  //       .unix(row.getValue('updatedAt'))
  //       .format('D MMMM YYYY');

  //     return <span>{formattedDate}</span>;
  //   },
  // },
];
