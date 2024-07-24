import eslint from '@antfu/eslint-config';

export default eslint(
  {
    react: true,
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: true,
    },
  },

  // override rules
  {
    rules: {
      'curly': ['error', 'all'],
      'no-unused-vars': 'off',
      'style/max-len': [
        'error',
        {
          code: 100,
          ignoreComments: false,
          ignoreTrailingComments: false,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        },
      ],
      'style/brace-style': ['error', '1tbs', { allowSingleLine: false }],
      'style/arrow-parens': ['error', 'always'],
      'style/jsx-quotes': ['error', 'prefer-double'],
      'style/multiline-ternary': ['error', 'always-multiline', { ignoreJSX: true }],
      'style/no-confusing-arrow': ['error'],
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'import/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
          'pathGroups': [
            { pattern: '@/**', group: 'internal' },
          ],
          'newlines-between': 'always-and-inside-groups',
          'pathGroupsExcludedImportTypes': [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'type',
          ],
        },
      ],
      'ts/no-unused-vars': 'error',
    },
  },
  {
    files: ['tsconfig.json'],
    rules: {
      'jsonc/sort-keys': 'off',
    },
  },
  {
    files: ['*.md'],
    rules: {
      'style/max-len': 'off',
    },
  },
);
