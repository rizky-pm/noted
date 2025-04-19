const noteCardClassMap: Record<string, string> = {
  red: 'bg-red-50 text-red-800 border-red-300',
  yellow: 'bg-yellow-50 text-yellow-800 border-yellow-300',
  green: 'bg-green-50 text-green-800 border-green-300',
  blue: 'bg-blue-50 text-blue-800 border-blue-300',
  purple: 'bg-purple-50 text-purple-800 border-purple-300',
  gray: 'bg-gray-50 text-gray-800 border-gray-300',
};

const bagdeClassMap: Record<string, string> = {
  red: 'bg-red-200 text-red-800 hover:bg-red-200',
  yellow: 'bg-yellow-200 text-yellow-800 hover:bg-yellow-200',
  green: 'bg-green-200 text-green-800 hover:bg-green-200',
  blue: 'bg-blue-200 text-blue-800 hover:bg-blue-200',
  purple: 'bg-purple-200 text-purple-800 hover:bg-purple-200',
  gray: 'bg-gray-200 text-gray-800 hover:bg-gray-200',
};

export const getNoteCardClasses = (color: string, isEditMode: boolean) => {
  if (!isEditMode) return noteCardClassMap[color] ?? '';

  const gradients: Record<string, string> = {
    red: 'bg-[linear-gradient(0deg,_rgba(255,255,255,1)60%,_rgba(254,202,202,1)95%)]',
    yellow:
      'bg-[linear-gradient(0deg,_rgba(255,255,255,1)60%,_rgba(254,240,138,1)95%)]',
    green:
      'bg-[linear-gradient(0deg,_rgba(255,255,255,1)60%,_rgba(187,247,208,1)95%)]',
    blue: 'bg-[linear-gradient(0deg,_rgba(255,255,255,1)60%,_rgba(191,219,254,1)95%)]',
    purple:
      'bg-[linear-gradient(0deg,_rgba(255,255,255,1)60%,_rgba(233,213,255,1)95%)]',
    gray: 'bg-[linear-gradient(0deg,_rgba(255,255,255,1)60%,_rgba(229,231,235,1)95%)]',
  };

  return gradients[color] ?? '';
};

export const getBadgeClasses = (color: string) => {
  return bagdeClassMap[color] ?? '';
};
