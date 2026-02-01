import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Reset
    root.classList.remove('dark');
    body.removeAttribute('data-theme');

    // Apply
    if (theme === 'dark') {
      root.classList.add('dark');
    }
    
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  return { theme, setTheme };
};
