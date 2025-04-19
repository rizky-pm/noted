export const getColorPickerClasses = (color: string) => {
  const gradients: Record<string, string> = {
    red: 'bg-red-400',
    yellow: 'bg-yellow-400',
    green: 'bg-green-400',
    blue: 'bg-blue-400',
    gray: 'bg-gray-400',
    purple: 'bg-purple-400',
  };

  return gradients[color] ?? '';
};
