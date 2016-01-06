import updateNotifier from 'update-notifier';
import chalk from 'chalk';

import React from 'react';
import {create} from './screen';
import App from './app';
import {render} from 'react-blessed';
import {argv} from 'yargs'

import pkg from '../package.json';
const notifier = updateNotifier({
  pkg,
  updateCheckInterval: 0,
});

if (!argv.force && notifier.update) {
  const current = `(current: ${notifier.update.current})`;
  console.log(`Update available: ${chalk.green.bold(notifier.update.latest)} ${chalk.gray(current)}`);
  console.log(`Run ${chalk.magenta('npm install -g ' + pkg.name)} to update.`);
  console.log(`Run ${chalk.magenta(pkg.name + ' --force')} to ignore update.`);
} else {
  const screen = create();
  render(<App screen={screen} />, screen);
}

