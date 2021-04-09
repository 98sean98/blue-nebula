import React from 'react';

import { ApolloLayer, AuthLayer } from 'components/layer';

import { RootNavigation } from 'navigation/RootNavigation';

function App() {
  return (
    <AuthLayer>
      <ApolloLayer>
        <RootNavigation />
      </ApolloLayer>
    </AuthLayer>
  );
}

export default App;
