import React, { FC } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import { AuthPage, HomePage, NotFoundPage } from 'pages';

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
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </Router>
  );
};
