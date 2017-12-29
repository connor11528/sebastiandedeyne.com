module.exports = {
    plugins: [
        require('tailwindcss')('./tailwind.js'),
        require('postcss-cssnext')({
            browsers: 'last 2 versions',
        }),
    ],
};
