import React from 'react';
import { motion } from 'framer-motion';

const ActionButton = ({
    icon: Icon,
    label,
    onClick,
    disabled = false,
    variant = 'primary'
}) => {
    const variantStyles = {
        primary: disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-primary text-primary-foreground hover:scale-105 active:scale-95',
        danger: disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-destructive text-destructive-foreground hover:scale-105 active:scale-95',
        secondary: disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-secondary text-secondary-foreground hover:scale-105 active:scale-95'
    };

    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`
        flex items-center gap-2 px-4 py-2 rounded-lg 
        cartoon-border-sm cartoon-shadow-sm
        font-bold text-sm
        transition-all duration-200
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        ${variantStyles[variant]}
      `}
        >
            {typeof Icon === 'string' ? (
                <span className="text-lg">{Icon}</span>
            ) : (
                <Icon className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{label}</span>
        </motion.button>
    );
};

export default ActionButton;