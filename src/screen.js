import path from 'path';
import blessed from 'blessed';

export const create = () => {
  const screen = blessed.screen({
    autoPadding: true,
    smartCSR: true,
    title: 'blessed-standup',
    debug: process.env.NODE_ENV !== 'production',
    dockBorders: true,
    // dump: path.join(__dirname, '..', 'log', 'process.log'),
  });

  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  process.on('uncaughtException', function(err) {
    if (/blessedstandup/.test(err.message)) {
      console.error('ERROR! ' + err.message);
      process.exit(1);
    }

    console.error('Caught exception: ' + err);
    console.log(err.stack);
  });

  return screen;
};

