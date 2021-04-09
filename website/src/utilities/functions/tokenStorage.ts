const storageKey = 'authorizationToken';

export const getTokenFromStorage = (): string | null =>
  localStorage.getItem(storageKey);

export const setTokenIntoStorage = (token: string): void =>
  localStorage.setItem(storageKey, token);

export const removeTokenFromStorage = (): void =>
  localStorage.removeItem(storageKey);
