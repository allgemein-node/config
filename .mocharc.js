'use strict';

// Here's a JavaScript-based config file.
// If you need conditional logic, you might want to use this type of config.
// Otherwise, JSON or YAML is recommended.

module.exports = {
  diff: true,
  // extension: ['js'],
  // package: './package.json',
  reporter: 'spec',
  // slow: 75,
  timeout: 60000,
  ui: 'bdd',
  recursive: true,
  require: ['ts-node/register'],
  'watch-extensions': ['ts']
};
