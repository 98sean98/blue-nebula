import React from 'react';
import { ThemeProvider } from '@material-ui/core';

import { ApolloLayer, AuthLayer, UserLayer } from 'components/layer';

import { RootNavigation } from 'navigation/RootNavigation';

import { muiTheme } from 'styles/muiTheme';

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <AuthLayer>
        <ApolloLayer>
          <UserLayer>
            <RootNavigation />
          </UserLayer>
        </ApolloLayer>
      </AuthLayer>
    </ThemeProvider>
  );
}

export default App;
