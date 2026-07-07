import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import CartoonAvatar from '@/components/CartoonAvatar.jsx';
import PulseRingAnimation from '@/components/PulseRingAnimation.jsx';
import CartoonLoadingIndicator from '@/components/CartoonLoadingIndicator.jsx';
import { createChatConnection } from '@/services/chatService';
import { toast } from "sonner";

const MOTIVATIONAL_TEXTS = [
    "A secret match is coming...",
    "Hold your horses...",
    "Finding someone matching your vibe...",
    "Loading your mystery buddy...",
    "Ready, set, chat!",
    "Almost there, stay with us!"
];

const WaitingScreen = () => {
    const navigate = useNavigate();

    const params = new URLSearchParams(window.location.search);

    const userId =
        params.get("userId") ||
        localStorage.getItem("userId");

    const [waitTime, setWaitTime] = useState(0);
    const [onlineCount, setOnlineCount] = useState(1248);
    const [motivationalText, setMotivationalText] =
        useState(MOTIVATIONAL_TEXTS[0]);

    useEffect(() => {
        const timer = setInterval(() => {
            setWaitTime((prev) => prev + 1);
        }, 1000);

        const textTimer = setInterval(() => {
            setMotivationalText(
                MOTIVATIONAL_TEXTS[
                Math.floor(Math.random() * MOTIVATIONAL_TEXTS.length)
                ]
            );

            setOnlineCount((prev) =>
                prev + Math.floor(Math.random() * 5) - 2
            );
        }, 4000);

        return () => {
            clearInterval(timer);
            clearInterval(textTimer);
        };
    }, []);

    useEffect(() => {
        if (!userId) {
            navigate('/');
            return;
        }

        localStorage.setItem("userId", userId);

        const connection = createChatConnection();

        connection.on("Matched", (roomId) => {
            console.log("Matched room:", roomId);
            toast.success("Someone's in the chat...");

            setTimeout(() => {
                navigate(`/?userId=${userId}&roomId=${roomId}`);
            }, 800);
        });

        const startConnection = async () => {
            try {
                await connection.start();
                console.log("SignalR connected");

                await connection.invoke("FindMatch");

                console.log("Finding match...");
            } catch (error) {
                console.error("SignalR error:", error);
            }
        };

        startConnection();

        return () => {
            connection.stop();
        };
    }, [userId, navigate]);

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <>
            <Helmet>
                <title>Looking for a match... | EZone</title>
                <meta
                    name="description"
                    content="Finding the perfect match for you..."
                />
            </Helmet>

            <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-crowd-pattern">
                <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]" />

                <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-2 cartoon-text">
                            Chasing a ghost...
                        </h1>

                        <motion.p
                            key={motivationalText}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-lg font-bold text-primary"
                        >
                            {motivationalText}
                        </motion.p>
                    </motion.div>

                    <div className="relative flex items-center justify-center mb-16">
                        <div className="absolute">
                            <PulseRingAnimation
                                color="hsl(var(--primary))"
                                size={200}
                            />
                        </div>

                        <motion.div
                            className="relative z-10 bg-background p-4 rounded-2xl cartoon-border cartoon-shadow-lg"
                            animate={{
                                y: [0, -10, 0],
                                rotate: [0, -5, 5, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <CartoonAvatar size="lg" />
                        </motion.div>
                    </div>

                    <div className="mb-12">
                        <CartoonLoadingIndicator size="lg" />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-full bg-background/90 backdrop-blur-sm cartoon-border-sm cartoon-shadow-sm rounded-xl p-4 flex justify-between items-center mb-8"
                    >
                        <div className="text-center flex-1 border-r-2 border-black">
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">
                                WAITING
                            </p>
                            <p className="text-xl font-black text-foreground">
                                {waitTime}s
                            </p>
                        </div>

                        <div className="text-center flex-1">
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">
                                Online
                            </p>
                            <p className="text-xl font-black text-primary">
                                {onlineCount.toLocaleString()}
                            </p>
                        </div>
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-foreground font-bold rounded-xl cartoon-border-sm cartoon-shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <X className="w-5 h-5" />
                        Cancel
                    </motion.button>
                </div>
            </div>
        </>
    );
};

export default WaitingScreen;