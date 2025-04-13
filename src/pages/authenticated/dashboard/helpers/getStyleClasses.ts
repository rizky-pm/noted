const noteClassMap: Record<string, string> = {
  red: 'bg-red-50 text-red-800 border-red-300',
  yellow: 'bg-yellow-50 text-yellow-800 border-yellow-300',
  green: 'bg-green-50 text-green-800 border-green-300',
  blue: 'bg-blue-50 text-blue-800 border-blue-300',
};

export const getNoteCardClasses = (color: string, isEditMode: boolean) => {
  if (!isEditMode) return noteClassMap[color] ?? '';

  const gradients: Record<string, string> = {
    red: 'bg-[linear-gradient(0deg,_rgba(255,255,255,1)60%,_rgba(252,202,202,1)95%)]',
    yellow:
      'bg-[linear-gradient(0deg,_rgba(255,255,255,1)60%,_rgba(254,240,138,1)95%)]',
    green:
      'bg-[linear-gradient(0deg,_rgba(255,255,255,1)60%,_rgba(187,247,208,1)95%)]',
    blue: 'bg-[linear-gradient(0deg,_rgba(255,255,255,1)60%,_rgba(191,291,254,1)95%)]',
  };

  return gradients[color] ?? '';
};

export const getBadgeClasses = (color: string) =>
  `bg-${color}-200 text-${color}-800`;
