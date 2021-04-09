import React, { FC } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { HomePage } from 'pages';

export const RootNavigation: FC = () => {
  return (
    <Router>
      <Switch>
        <Route path={'/'}>
          <HomePage />
        </Route>
      </Switch>
    </Router>
  );
};
