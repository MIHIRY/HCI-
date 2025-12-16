/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'code-blue': '#3b82f6',
        'email-gray': '#6b7280',
        'chat-vibrant': '#8b5cf6',
      },
    },
  },
  plugins: [],
}
