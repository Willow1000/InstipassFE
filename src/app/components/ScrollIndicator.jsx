import { motion, useScroll, useTransform } from "framer-motion";

const ScrollIndicator = () => {
  // Hook to get scroll progress. scrollYProgress is a MotionValue from 0 to 1.
  const { scrollYProgress } = useScroll();

  // Transform scrollYProgress (0-1) to a y-position for the inner dot (0-20px).
  // This makes the dot move within the container.
  const dotY = useTransform(scrollYProgress, [0, 1], [0, 20]);

  // Transform scrollYProgress (0-1) to an opacity value.
  // The indicator will fade out as you reach the bottom of the page.
  const opacity = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0]);

  return (
    <motion.div
      // Apply the opacity transformation here
      style={{ opacity }}
      className=" left-1/2 -translate-x-1/2"
    >
      <motion.div
        className="w-8 h-12 border-2 border-white rounded-full flex justify-center pt-2"
        // This animation is for the subtle up-and-down bounce
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        <motion.div
          className="w-2 h-2 bg-white rounded-full"
          // Apply the dot's vertical movement transformation here
          style={{ y: dotY }}
        />
      </motion.div>
    </motion.div>
  );
};

export default ScrollIndicator;
