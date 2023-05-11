module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'prettier'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
	],
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	rules: {
		// js/ts
		// 'no-console': ['warn', { allow: ['error'] }],
		'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
		camelcase: [
			'error',
			{
				properties: 'never',
			},
		],
		// indent: ["error", "tab"],

		'no-var': 'error',
		'no-empty': [
			'error',
			{
				allowEmptyCatch: true,
			},
		],
		'no-void': 'error',
		'prefer-const': [
			'warn',
			{
				destructuring: 'all',
				ignoreReadBeforeAssign: true,
			},
		],
		'prefer-template': 'error',
		'object-shorthand': [
			'error',
			'always',
			{
				ignoreConstructors: false,
				avoidQuotes: true,
			},
		],
		'block-scoped-var': 'error',
		'no-constant-condition': [
			'error',
			{
				checkLoops: false,
			},
		],
		'arrow-spacing': [
			'error',
			{
				before: true,
				after: true,
			},
		],
		'no-multi-spaces': 'error', // 不允许多个空格
		'no-multiple-empty-lines': [
			'error',
			{
				max: 2,
				maxEOF: 0,
			},
		], // 不允许多个空行
		'no-redeclare': 'off',
		'@typescript-eslint/no-redeclare': 'error',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
		// '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
			},
		],
		'no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
			},
		],
		// prettier
		'prettier/prettier': [
			'error',
			{
				tabWidrh: 4,
				// 用制表符(tab)不是空格缩进行
				// 如果为true，则取编辑器tabSize值
				// 安装editorconfig编辑器插件并配置文件，则取 editorConfig 文件中设置的值
				// 具体取indent_size或者tab_width，依据indent_style值来决定
				// 如果为false，则取值为tabWidth值，但是有问题，经常需要重启编辑器才生效
				useTabs: true,
				singleQuote: true,
			},
		],

		// vue
		// 'vue/no-v-html': 'off',
		// 'vue/require-default-prop': 'off',
		// 'vue/require-explicit-emits': 'off',
		// 'vue/multi-word-component-names': 'off',
		// import
		// 'import/first': 'error',
		// 'import/no-duplicates': 'error',
		// 'import/order': [
		//     'error',
		//     {
		//         groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],

		//         pathGroups: [{
		//                 pattern: 'vue',
		//                 group: 'external',
		//                 position: 'before',
		//             },
		//             {
		//                 pattern: '@vue/**',
		//                 group: 'external',
		//                 position: 'before',
		//             },
		//             {
		//                 pattern: 'ant-design-vue',
		//                 group: 'internal',
		//             },
		//         ],
		//         pathGroupsExcludedImportTypes: ['type'],
		//     },
		// ],
	},
};
