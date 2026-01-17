/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                islamic: {
                    green: '#2E8B57', // SeaGreen
                    dark: '#006400', // DarkGreen
                    gold: '#FFD700', // Gold
                    cream: '#F5F5DC', // Beige/Cream
                    text: '#1F2937',
                }
            },
            backgroundImage: {
                'pattern': "url('https://www.transparenttextures.com/patterns/arabesque.png')", // Placeholder for simple pattern
            }
        },
    },
    plugins: [],
}
