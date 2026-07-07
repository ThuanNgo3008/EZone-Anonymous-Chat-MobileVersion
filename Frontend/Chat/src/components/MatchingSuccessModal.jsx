import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const MatchingSuccessModal = ({ isOpen, onProceed }) => {
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        if (!isOpen) return;

        setCountdown(3);
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onProceed();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, onProceed]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: -20 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="bg-background cartoon-border cartoon-shadow-lg rounded-2xl p-8 max-w-sm w-full text-center relative overflow-hidden"
                    >
                        {/* Confetti effect (simplified CSS animation) */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-3 h-3 bg-primary rounded-sm"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: '-10%',
                                        animation: `confetti-fall ${1 + Math.random() * 2}s linear infinite`,
                                        animationDelay: `${Math.random() * 2}s`,
                                        backgroundColor: ['#ED2553', '#FFB800', '#00C48C', '#3B82F6'][Math.floor(Math.random() * 4)]
                                    }}
                                />
                            ))}
                        </div>

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 cartoon-border cartoon-shadow-sm"
                        >
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </motion.div>

                        <h2 className="text-2xl font-black mb-2 text-foreground">Ghép đôi thành công!</h2>
                        <p className="text-muted-foreground font-medium mb-6">
                            Đang chuyển đến phòng chat trong <span className="text-primary font-bold">{countdown}</span>s...
                        </p>

                        <button
                            onClick={onProceed}
                            className="w-full py-3 px-6 bg-primary text-primary-foreground font-bold rounded-xl cartoon-border-sm cartoon-shadow-sm hover:scale-105 active:scale-95 transition-transform"
                        >
                            Vào phòng ngay
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default MatchingSuccessModal;