/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // ✅ Add this line
  theme: {
    extend: {
      colors: {
        primary: '#4b0082',     // Dark Violet
        gold: '#ffd700',        // Gold
        background: '#f5f5f5',  // Light Gray Background
        darkText: '#222222',
        shimmer: '#a855f7',     // Optional glowing purple-pink
        glass: 'rgba(255, 255, 255, 0.1)', // Glassmorphism base
      },
      boxShadow: {
        glow: '0 0 20px #ffd700',
        intense: '0 0 30px #4b0082',
        glassy: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at center, #4b0082, #000)',
        'hero-pattern': 'linear-gradient(135deg, #4b0082, #a855f7)',
      },
      fontFamily: {
        classy: ['"Poppins"', 'sans-serif'],
      },
      dropShadow: {
        glow: '0 0 6px #ffd700aa',
      },
      animation: {
    'fade-in': 'fadeIn 0.6s ease-out',
  },
  keyframes: {
    fadeIn: {
      '0%': { opacity: 0, transform: 'translateY(-10px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
  },
    },
  },
  plugins: [],
};
