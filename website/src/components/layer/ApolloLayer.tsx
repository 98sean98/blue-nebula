import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  DefaultOptions,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';

import { serverUrl } from 'config/environment';

import { useAuthContext } from 'utilities/hooks';
import { getTokenFromStorage } from 'utilities/functions';

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

  const { isAuthenticated } = useAuthContext();

  const authorizationToken: string | undefined = useMemo(() => {
    if (isAuthenticated) return getTokenFromStorage() ?? undefined;
  }, [isAuthenticated]);

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
