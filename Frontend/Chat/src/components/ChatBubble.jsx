import React from 'react';
import { motion } from 'framer-motion';

const ChatBubble = ({ message, isOwn, timestamp }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`w-full flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
        >
            <div
                className={`max-w-[75%] sm:max-w-[60%] px-4 py-3 rounded-lg cartoon-border-sm cartoon-shadow-sm ${isOwn
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                    }`}
            >
                <p className="text-sm sm:text-base break-words whitespace-pre-wrap leading-relaxed">
                    {message}
                </p>
                {timestamp && (
                    <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {timestamp}
                    </p>
                )}
            </div>
        </motion.div>
    );
};

export default ChatBubble;