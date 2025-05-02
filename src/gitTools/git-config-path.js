/* eslint-disable */
/*!
 * git-config-path <https://github.com/jonschlinkert/git-config-path>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Licensed under the MIT License.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

module.exports = function (type, options) {
  if (typeof type !== 'string') {
    options = type;
    type = null;
  }

  const opts = { type, cwd: process.cwd(), ...options };
  let configPath;

  if (opts.type === 'global') {
    configPath = path.join(os.homedir(), '.gitconfig');
  } else {
    configPath = path.resolve(opts.cwd, '.git/config');
  }

  if (!fs.existsSync(configPath)) {
    if (typeof opts.type === 'string') return null;
    configPath = path.join(os.homedir(), '.config/git/config');
  }

  return fs.existsSync(configPath) ? configPath : null;
};
