import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageTransitionProps {
    children: ReactNode;
}

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
    },
    in: {
        opacity: 1,
        y: 0,
        scale: 1,
    },
    out: {
        opacity: 0,
        y: -20,
        scale: 0.98,
    },
};

const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.2, // Faster duration
} as const;

export default function PageTransition({ children }: PageTransitionProps) {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="w-full h-full will-change-transform"
        >
            {children}
        </motion.div>
    );
}
