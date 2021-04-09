import React, { FC, useEffect, useState } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  DefaultOptions,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';

import { serverUrl } from 'config/environment';

const uri = serverUrl.graphql;

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
  mutate: {
    errorPolicy: 'all',
  },
};

export const ApolloLayer: FC = ({ children }) => {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();

  useEffect(() => {
    // setup apollo client
    const link = createHttpLink({
      uri,
      credentials: 'include',
    });

    const cache = new InMemoryCache();

    const newClient = new ApolloClient({
      cache,
      link,
      defaultOptions,
    });

    setClient(newClient);
    console.log('apollo client is loaded!');
  }, []);

  return (
    <>
      {typeof client !== 'undefined' ? (
        <ApolloProvider client={client}>{children}</ApolloProvider>
      ) : null}
    </>
  );
};
