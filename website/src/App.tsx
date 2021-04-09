import React from 'react';

import { ApolloLayer, AuthLayer, UserLayer } from 'components/layer';

import { RootNavigation } from 'navigation/RootNavigation';

function App() {
  return (
    <AuthLayer>
      <ApolloLayer>
        <UserLayer>
          <RootNavigation />
        </UserLayer>
      </ApolloLayer>
    </AuthLayer>
  );
}

export default App;
