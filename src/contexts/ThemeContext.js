import { createContext, useContext, useEffect, useRef, useState } from 'react'
import styles from './ThemeContext.module.css'

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }

  const touchCircleClass = useRef('');
  const lastTouchTime = useRef(0);

  useEffect(() => {
    touchCircleClass.current = styles.touchCircle;

    const createCircle = (x, y) => {
      const circle = document.createElement('div');
      circle.className = touchCircleClass.current;
      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;
      document.body.appendChild(circle);

      setTimeout(() => {
        circle.remove();
      }, 400);
    };

    const handleTouch = (e) => {
      lastTouchTime.current = Date.now();
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        createCircle(touch.clientX, touch.clientY);
      }
    };

    const handleClick = (e) => {
 
      if (Date.now() - lastTouchTime.current < 500) return;
      createCircle(e.clientX, e.clientY);
    };

    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('click', handleClick);
    };
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
