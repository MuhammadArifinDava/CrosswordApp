import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

const ACHIEVEMENT_DEFINITIONS = [
  {
    id: 'speedster',
    icon: '⚡',
    title: 'The Flash',
    description: 'Solve a puzzle in under 2 minutes',
    condition: (stats) => stats.timeSolved && stats.timeSolved < 120
  },
  {
    id: 'sniper',
    icon: '🎯',
    title: 'Sniper',
    description: 'Solve without using any hints',
    condition: (stats) => stats.hintsUsed === 0
  },
  {
    id: 'perfectionist',
    icon: '💎',
    title: 'Perfectionist',
    description: '100% correct with 0 errors',
    condition: (stats) => stats.errors === 0
  },
  {
    id: 'nightowl',
    icon: '🦉',
    title: 'Night Owl',
    description: 'Play a game after 10 PM',
    condition: () => new Date().getHours() >= 22
  }
];

export const useAchievements = () => {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('achievements')) || [];
    } catch {
      return [];
    }
  });
  
  const [newUnlock, setNewUnlock] = useState(null);

  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(unlocked));
  }, [unlocked]);

  const checkAchievements = useCallback((gameStats) => {
    // gameStats: { timeSolved (seconds), hintsUsed, errors }
    
    const newlyUnlocked = [];
    
    ACHIEVEMENT_DEFINITIONS.forEach(ach => {
      if (unlocked.includes(ach.id)) return;
      
      if (ach.condition(gameStats)) {
        newlyUnlocked.push(ach.id);
      }
    });

    if (newlyUnlocked.length > 0) {
      setUnlocked(prev => [...prev, ...newlyUnlocked]);
      
      // Show first new unlock
      const firstId = newlyUnlocked[0];
      const achInfo = ACHIEVEMENT_DEFINITIONS.find(a => a.id === firstId);
      setNewUnlock(achInfo);
      
      // Confetti!
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Auto dismiss
      setTimeout(() => setNewUnlock(null), 5000);
    }
  }, [unlocked]);

  return { unlocked, checkAchievements, newUnlock, definitions: ACHIEVEMENT_DEFINITIONS };
};
