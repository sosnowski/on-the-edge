/** @type {import('tailwindcss').Config} */
module.exports = {
  important: '.micro-survey',
  prefix: "ms-",
  corePlugins: {
    preflight: false,
  },
  content: ['./src/**/*.{html,js,svelte,ts}', './index.html'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

