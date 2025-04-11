import { useMediaQuery } from 'react-responsive';

const breakpoints = {
  sm: '(min-width: 40rem)',
  md: '(min-width: 48rem)',
  lg: '(min-width: 64rem)',
  xl: '(min-width: 80rem)',
  '2xl': '(min-width: 96rem)',
};

const useBreakpoints = () => {
  const isSmallScren = useMediaQuery({ query: breakpoints.sm });
  const isMediumScreen = useMediaQuery({ query: breakpoints.md });
  const isLargeScreen = useMediaQuery({ query: breakpoints.lg });
  const isExtraLargeScreen = useMediaQuery({ query: breakpoints.xl });
  const isTwoExtraLargeScreen = useMediaQuery({ query: breakpoints['2xl'] });

  return {
    isSmallScren,
    isMediumScreen,
    isLargeScreen,
    isExtraLargeScreen,
    isTwoExtraLargeScreen,
  };
};

export default useBreakpoints;
