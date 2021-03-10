import React, { FC, useEffect, useState } from 'react';
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
  DefaultOptions,
} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [authorizationToken, setAuthorizationToken] = useState<string>();
  const [client, setClient] = useState<ApolloClient<unknown>>();

  // get token from async storage if any
  useEffect(() => {
    try {
      AsyncStorage.getItem('authorizationToken').then((token) => {
        if (token !== null) setAuthorizationToken(token);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

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
