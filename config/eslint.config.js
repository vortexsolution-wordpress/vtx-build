module.exports = {
    root: true,
    extends: [
        require.resolve('@wordpress/scripts/config/.eslintrc.js'),
    ],
    rules: {
        'no-console': 'warn',
        'react/react-in-jsx-scope': 'off',
    },
};
