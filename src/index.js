import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { browserHistory } from 'react-router';

import registerServiceWorker from './registerServiceWorker';
import './index.css';

import Routes from './routes';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render(
  <MuiThemeProvider>
    <Routes history={browserHistory} />
  </MuiThemeProvider>,
  document.getElementById('root')
);
registerServiceWorker();
