import React from 'react';

import { ApolloLayer } from 'components/layer';

import { RootNavigation } from 'navigation/RootNavigation';

function App() {
  return (
    <ApolloLayer>
      <RootNavigation />
    </ApolloLayer>
  );
}

export default App;
