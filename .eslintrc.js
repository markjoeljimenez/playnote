module.exports = {
	extends: 'erb/typescript',
	rules: {
		// A temporary hack related to IDE not resolving correct package.json
		'import/no-extraneous-dependencies': 'off',
		'react/jsx-indent': [2, 'tab'],
		'global-require': [0],
		'react/jsx-indent-props': [2, 'tab'],
		'react/no-array-index-key': [0],
		radix: [0],
		'react/jsx-one-expression-per-line': [0],
		'react/jsx-closing-tag-location': [0],
		'@typescript-eslint/lines-between-class-members': [0],
	},
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
		createDefaultProgram: true,
	},
	settings: {
		'import/resolver': {
			// See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
			node: {},
			webpack: {
				config: require.resolve('./configs/webpack.config.eslint.js'),
			},
		},
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx'],
		},
	},
};
