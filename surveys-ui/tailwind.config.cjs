/** @type {import('tailwindcss').Config} */
module.exports = {
  important: '.micro-survey',
  corePlugins: {
    preflight: false,
  },
  content: ['./src/**/*.{html,js,svelte,ts}', './index.html', '../surveys/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

