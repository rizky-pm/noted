import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import _ from 'lodash';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitialName = (fullName: string) => {
  if (!fullName) return '';

  const words = _.split(fullName, ' ').filter(Boolean);
  const initials =
    words.length >= 2
      ? words[0].charAt(0) + words[words.length - 1].charAt(0)
      : words[0].charAt(0);

  return _.upperCase(initials);
};

export const formatTimeAgo = (unix: number) => {
  return timeAgo.format(unix * 1000 - 30 * 1000, 'round-minute');
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to Base64'));
      }
    };

    reader.onerror = (error) => reject(error);
  });
};

export const base64ToFile = (base64: string | null, filename: string) => {
  if (!base64) return undefined;

  const arr = base64.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};
