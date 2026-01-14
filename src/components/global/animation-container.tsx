"use client";

import { motion, useReducedMotion } from "framer-motion";

interface AnimationContainerProps {
    children: React.ReactNode;
    delay?: number;
    reverse?: boolean;
    className?: string;
};

const AnimationContainer = ({ children, className, reverse, delay }: AnimationContainerProps) => {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            className={className}
            initial={shouldReduceMotion ? false : { opacity: 0, y: reverse ? -20 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={
                shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.3, delay: delay, ease: "easeInOut", type: "spring", stiffness: 240, damping: 22 }
            }
        >
            {children}
        </motion.div>
    );
};

export default AnimationContainer
