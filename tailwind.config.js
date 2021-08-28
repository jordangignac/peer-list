module.exports = {
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('daisyui')],
  variants: {extend: {}},
  theme: {extend: {}},
};
