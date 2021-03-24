import React, { FC, useEffect, useState } from 'react';
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
  DefaultOptions,
  NormalizedCacheObject,
} from '@apollo/client';
import { useSelector } from 'react-redux';

import { RootState } from '@reduxApp';

import { serverUrl } from '@config/environment';

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
  const authorizationToken = useSelector(
    (state: RootState) => state.auth.authorizationToken,
  );
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();

  useEffect(() => {
    // setup apollo client

    const headers =
      typeof authorizationToken !== 'undefined'
        ? {
            authorization: authorizationToken,
          }
        : undefined;

    const link = createHttpLink({
      uri,
      credentials: 'include',
      headers,
    });

    const cache = new InMemoryCache();

    const newClient = new ApolloClient({
      cache,
      link,
      defaultOptions,
      headers,
    });

    setClient(newClient);
    console.log('apollo client is loaded!');
  }, [authorizationToken]);

  return (
    <>
      {typeof client !== 'undefined' ? (
        <ApolloProvider client={client}>{children}</ApolloProvider>
      ) : null}
    </>
  );
};
