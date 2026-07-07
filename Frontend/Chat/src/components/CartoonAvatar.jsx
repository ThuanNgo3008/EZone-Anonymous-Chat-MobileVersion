import React, { useMemo } from 'react';

const ANIMAL_EMOJIS = ['🦊', '🐻', '🐼', '🐰', '🦁', '🐯', '🐨', '🐸', '🦆', '🐷', '🐮', '🐵'];

const ANIMAL_NAMES = [
    'Cheerful Fox',      
    'Spacey Bear',       
    'Snoozy Panda',      
    'Speedy Bunny',      
    'Mighty Lion',       
    'Fierce Tiger',      
    'Cutie Koala',       
    'Leapy Frog',        
    'Paddly Duck',       
    'Pretty Piggy',      
    'Gentle Cow',        
    'Playful Monkey'     
];

const CartoonAvatar = ({ size = 'md', name = null, emoji = null }) => {
    const randomAvatar = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * ANIMAL_EMOJIS.length);
        return {
            emoji: emoji || ANIMAL_EMOJIS[randomIndex],
            name: name || ANIMAL_NAMES[randomIndex]
        };
    }, [emoji, name]);

    const sizeClasses = {
        sm: 'w-10 h-10 text-xl',
        md: 'w-16 h-16 text-4xl',
        lg: 'w-24 h-24 text-6xl'
    };

    const containerSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    };

    return (
        <div className={`flex items-center gap-3 ${containerSizeClasses[size]}`}>
            <div
                className={`${sizeClasses[size]} cartoon-border cartoon-shadow bg-gradient-to-br from-yellow-300 to-orange-400 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105`}
            >
                <span className="select-none">{randomAvatar.emoji}</span>
            </div>
            <div className="font-bold text-foreground">
                {randomAvatar.name}
            </div>
        </div>
    );
};

export default CartoonAvatar;