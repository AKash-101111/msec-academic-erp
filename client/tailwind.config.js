/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                lavender: '#F2EAF7', // Primary Background
                amethyst: '#C59DD9', // Secondary Surfaces
                royal: '#7A3F91',    // Primary Brand Accent
                plum: '#2B0D3E',     // Headings & High Contrast

                // Accent colors for status indicators
                accent: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },

                // Keeping slate for neutral text if needed, but overriding 800/900 for consistency if used
                slate: {
                    ...require('tailwindcss/colors').slate,
                    800: '#2B0D3E', // Deep Plum for dark text
                    900: '#1a0526', // Very dark purple
                },
                // Removing old primary/accent/highlight to enforce new theme
            },
            fontFamily: {
                sans: ['Source Sans 3', 'system-ui', '-apple-system', 'sans-serif'],
            },
            backgroundColor: {
                'app': '#F9FAFB',
                'surface': '#FFFFFF',
                'app-dark': '#030712',
                'surface-dark': '#111827',
            },
            textColor: {
                'dark': '#E5E7EB',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
            }
        },
    },
    plugins: [],
}
