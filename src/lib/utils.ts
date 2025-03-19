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
