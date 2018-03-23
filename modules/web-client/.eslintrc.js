module.exports = {
    root: true,
    extends: 'airbnb',
    parser: 'babel-eslint',
    env: {
        es6: true,
        browser: true,
    },
    rules: {
        'arrow-parens': ['off'],
        'import/extensions': ['off', { 'js': 'never', 'json': 'always' }],
        'import/no-extraneous-dependencies': ['off', { 'devDependencies': true }],
        /* Do not ensure an imported module can be resolved to a module on the local filesystem */
        'import/no-unresolved': 'off',
        /* Set 2-space indentation, opposite of default 2 */
        'indent': ['error', 4, {
            /* Enforce indentation level for case clauses in switch statements */
            'SwitchCase': 1,
        }],
        'func-names': ['off'],
        'max-len': ['error', { 'code': 120 }],
        'no-console': ['off'],
        'no-else-return': ['off'],

        // http://eslint.org/docs/rules/no-param-reassign
        // Disallow reassign function parameters but allow modification
        'no-param-reassign': ['error', { props: false }],

        /* Allow unary operators ++ and -- */
        'no-plusplus': ['off'],

        // Allowing Math.pow rather than forcing `**`
        // https://eslint.org/docs/rules/no-restricted-properties
        'no-restricted-properties': ['off', {
            'object': 'Math',
            'property': 'pow',
        }],

        'no-template-curly-in-string': ['off'],
        /* Allow dangling underscores in identifiers */
        'no-underscore-dangle': ['off'],
        'object-curly-newline': ['error', {
            ObjectExpression: { consistent: true },
            ObjectPattern: { consistent: true },
        }],
        'prefer-destructuring': ['off'],
        'prefer-arrow-callback': ['error', {
            allowNamedFunctions: true,
            allowUnboundThis: true,
        }],
        'strict': ['off'],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/prop-types': ['off'],
    },
};
