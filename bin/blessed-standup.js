#!/usr/bin/env node

var chalk = require('chalk');
var updateNotifier = require('update-notifier');
var pkg = require('../package.json');

function updateCheck() {
  var notifier = updateNotifier({pkg: pkg});
  var message = [];

  if (notifier.update) {
    message.push('Update available: ' + chalk.green.bold(notifier.update.latest) + chalk.gray(' (current: ' + notifier.update.current + ')'));
    message.push('Run ' + chalk.magenta('npm install -g ' + pkg.name) + ' to update.');
    console.log(message.join('\n'));
  } else {
    require('../index');
  }
}

updateCheck();

