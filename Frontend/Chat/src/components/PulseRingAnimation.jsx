import React from 'react';
import { motion } from 'framer-motion';

const PulseRingAnimation = ({ color = '#ED2553', size = 120 }) => {
    return (
        <div
            className="relative flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full border-4"
                    style={{
                        borderColor: color,
                        width: '100%',
                        height: '100%'
                    }}
                    animate={{
                        scale: [1, 2.5],
                        opacity: [0.6, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.6,
                        ease: 'easeOut'
                    }}
                />
            ))}
        </div>
    );
};

export default PulseRingAnimation;