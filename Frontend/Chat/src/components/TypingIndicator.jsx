import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TypingIndicator = ({ isTyping }) => {
    return (
        <AnimatePresence>
            {isTyping && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="flex justify-start mb-4"
                >
                    <div className="bg-[#FFE5EB] text-black px-4 py-3 rounded-lg cartoon-border-sm cartoon-shadow-sm flex items-center gap-2 max-w-[75%] sm:max-w-[60%]">
                        <span className="text-sm sm:text-base font-bold tracking-tight">Typing...</span>
                        <div className="flex gap-1 ml-1 items-center h-full pt-1">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full"
                                    animate={{ y: [0, -6, 0] }}
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
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TypingIndicator;