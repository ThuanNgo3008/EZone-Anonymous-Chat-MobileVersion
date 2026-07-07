import React from 'react';
import { motion } from 'framer-motion';

const CartoonLoadingIndicator = ({ color = '#ED2553', size = 'md' }) => {
    const sizeMap = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4'
    };

    const dotClass = `${sizeMap[size]} rounded-full cartoon-border-sm`;

    return (
        <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className={dotClass}
                    style={{ backgroundColor: color }}
                    animate={{ y: [0, -12, 0] }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        repeatType: 'loop',
                        delay: i * 0.15,
                        ease: 'easeInOut'
                    }}
                />
            ))}
        </div>
    );
};

export default CartoonLoadingIndicator;