const CracoAlias = require('craco-alias');

module.exports = function ({ env }) {
  return {
    plugins: [
      {
        plugin: CracoAlias,
        options: {
          source: 'tsconfig',
          tsConfigPath: './tsconfig.json',
        },
      },
    ],
  };
};
