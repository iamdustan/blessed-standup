import React from 'react';
import screen from './screen';
import App from './app';
import {render} from 'react-blessed';

render(<App screen={screen} />, screen);

