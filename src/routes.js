import React from 'react';
import { Router, Route } from 'react-router';

import App from './App';
import MyGroup from './components/MyGroup';
import MagicLink from './components/MagicLink';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App} />
    <Route path="/ml/:magicCode" component={MagicLink} />
    <Route path="/group" component={MyGroup} />
  </Router>
);

export default Routes;
