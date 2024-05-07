import React, { useEffect, useState } from 'react';
import './TextAnimation.css'; // Ensure this path matches your file structure

const TextAnimation = ({ text, abbreviation }) => {
    const [displayState, setDisplayState] = useState('showAbbreviation'); // Start by showing the abbreviation

    useEffect(() => {
        const timers = [];
        // Wait a moment before starting the text animation
        const startTextAnimationTimer = setTimeout(() => {
            [...text].forEach((_, index) => {
                const timer = setTimeout(() => {
                    setDisplayState(`showText-${index + 1}`);
                }, 500 + index * 100); // Adjust timing as needed
                timers.push(timer);
            });
        }, 1000); // Delay before starting text animation
        timers.push(startTextAnimationTimer);

        return () => timers.forEach(clearTimeout); // Cleanup timers
    }, [text]);

    return (
        <div className="text-animation-container">
            <div className="abbreviation">{abbreviation}</div>
            {displayState.startsWith('showText') && (
                <div className="animated-text">
                    {[...text].map((char, index) => (
                        <span key={index} className={`animated-letter ${displayState === `showText-${index + 1}` ? 'visible' : ''}`}>
                            {char}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TextAnimation;
