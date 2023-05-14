module.exports = {
    extends: ['stylelint-config-standard-scss', 'stylelint-config-recommended-vue/scss', 'stylelint-order', 'stylelint-config-standard'],
    plugin: ['stylelint-scss'],
    rules: {
        'selector-class-pattern': '^[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$|^Mui.*$',
        'font-family-no-missing-generic-family-keyword': null,
        indentation: 4,
        'unit-no-unknown': [true, { ignoreUnits: ['/rpx/', '/upx/'] }],
        'no-descending-specificity': null,
        'function-url-quotes': 'always',
        'string-quotes': 'single',
        'unit-case': null,
        'color-hex-case': 'lower',
        'color-hex-length': 'long',
        'rule-empty-line-before': 'never',
        'font-family-no-missing-generic-family-keyword': null,
        'block-opening-brace-space-before': 'always',
        'property-no-unknown': null,
        'no-empty-source': null,
        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ['deep']
            }
        ],
        'function-no-unknown': [
            true,
            {
                ignoreFunctions: ['transparentize']
            }
        ],
        'at-rule-no-unknown': null,
        'declaration-block-trailing-semicolon': null,
        'property-no-vendor-prefix': null,
        'scss/no-global-function-names': null
    }
};
