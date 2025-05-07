module.exports = {
  extends: ['@wordpress/stylelint-config'],
  rules: {
    'scss/at-import-no-partial-leading-underscore': true,
    'scss/at-import-partial-extension': 'never',
    'scss/at-rule-no-unknown': true,
    'scss/at-import-deprecated': true,
    // Règle pour détecter les fonctions globales dépréciées
    'function-no-unknown': [true, {
      // Ajouter les exceptions nécessaires
      'ignoreFunctions': ['unquote', 'quote']
    }],
    // Ajouter un message personnalisé via une règle personnalisée
    'comment-empty-line-before': [
      'always',
      {
        'except': ['first-nested'],
        'ignore': ['stylelint-commands']
      }
    ]
  }
};
