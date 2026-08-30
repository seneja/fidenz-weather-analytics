import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  if (!domain || !clientId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-50 p-4 text-center dark:bg-gray-900">
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Configuration Error</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Auth0 environment variables are not set in the client application.
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Please define VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID in your frontend .env file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
      }}
    >
      {children}
    </Auth0Provider>
  );
};
