/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary Backgrounds
                navy: {
                    950: '#020617', // Main app background
                    900: '#0f172a', // Sidebar/Panel background
                    800: '#1e293b', // Card/Content background
                    700: '#334155', // Hover/Active states
                },
                // Primary Accents (Cyan)
                primary: {
                    400: '#22d3ee',
                    500: '#06b6d4',
                    600: '#0891b2',
                },
                // Secondary Accents (Indigo)
                secondary: {
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                },
                // Status Colors
                status: {
                    critical: '#dc2626', // Red
                    high: '#f59e0b',     // Amber
                    medium: '#3b82f6',   // Blue
                    low: '#64748b',      // Slate
                    success: '#10b981',  // Green
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['Fira Code', 'Courier New', 'monospace'],
            }
        },
    },
    plugins: [],
}
