import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className='flex items-center justify-center w-full h-screen bg-white'>
      <motion.svg
        width='220'
        height='100'
        viewBox='0 0 220 100'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <text
          x='50%'
          y='50%'
          fontSize='36'
          fontWeight='bold'
          fill='black'
          textAnchor='middle'
          dominantBaseline='middle'
        >
          Noted!
        </text>

        <motion.line
          x1='35'
          y1='75'
          x2='185'
          y2='75'
          stroke='black'
          strokeWidth='4'
          strokeLinecap='round'
          strokeDasharray='150'
          strokeDashoffset='150'
          animate={{
            strokeDashoffset: [150, 0, 0, -150],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.5, 0.75, 0.9],
          }}
        />
      </motion.svg>
    </div>
  );
};

export default LoadingScreen;
