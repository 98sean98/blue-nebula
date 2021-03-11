import React, { FC, useEffect, useState } from 'react';
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
  DefaultOptions,
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
  const [client, setClient] = useState<ApolloClient<unknown>>();

  useEffect(() => {
    // setup apollo client

    const link = createHttpLink({
      uri,
      credentials: 'include',
    });

    const cache = new InMemoryCache();

    const headers =
      typeof authorizationToken !== 'undefined'
        ? {
            authorization: authorizationToken,
          }
        : undefined;

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
