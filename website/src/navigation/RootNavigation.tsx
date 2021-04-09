import React, { FC } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import { AuthPage, HomePage } from 'pages';

export const RootNavigation: FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path={'/auth'}>
          <AuthPage />
        </Route>
        <Route exact path={'/'}>
          <HomePage />
        </Route>
      </Switch>
    </Router>
  );
};
