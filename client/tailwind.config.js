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
<<<<<<< HEAD
                primary: {
                    DEFAULT: '#111827',
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                    950: '#030712',
                },
                secondary: {
                    DEFAULT: '#6366F1',
                    50: '#EBEEFF',
                    100: '#DDE0FF',
                    200: '#C3C8FF',
                    300: '#A5ABFF',
                    400: '#888DFF',
                    500: '#6366F1',
                    600: '#4F46E5',
                    700: '#4338CA',
                    800: '#3730A3',
                    900: '#312E81',
                },
                accent: {
                    DEFAULT: '#22C55E',
                    50: '#F0FDF4',
                    100: '#DCFCE7',
                    200: '#BBF7D0',
                    300: '#86EFAC',
                    400: '#4ADE80',
                    500: '#22C55E',
                    600: '#16A34A',
                    700: '#15803D',
                    800: '#166534',
                    900: '#14532D',
                },
=======
                lavender: '#F2EAF7', // Primary Background
                amethyst: '#C59DD9', // Secondary Surfaces
                royal: '#7A3F91',    // Primary Brand Accent
                plum: '#2B0D3E',     // Headings & High Contrast

                // Keeping slate for neutral text if needed, but overriding 800/900 for consistency if used
                slate: {
                    ...require('tailwindcss/colors').slate,
                    800: '#2B0D3E', // Deep Plum for dark text
                    900: '#1a0526', // Very dark purple
                },
                // Removing old primary/accent/highlight to enforce new theme
>>>>>>> 48ffff9 (Royal Amethyst theme + login UI update)
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
