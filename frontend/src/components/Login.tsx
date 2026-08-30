import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { CloudSun, KeyRound } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Login: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <header className="flex justify-end p-4">
        <ThemeToggle />
      </header>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-blue-50 p-4 dark:bg-blue-900/30">
              <CloudSun className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Weather Comfort Index
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-gray-500 dark:text-gray-400">
            Compare and rank cities worldwide based on a custom weather comfort scoring algorithm.
          </p>

          <div className="mt-8">
            <button
              onClick={() => loginWithRedirect()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-lg font-medium text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <KeyRound className="h-5 w-5" />
              Sign In to Dashboard
            </button>
          </div>

          <p className="mt-6 text-xs text-gray-400 dark:text-gray-500">
            Secure authentication powered by Auth0.
          </p>
        </div>
      </div>
    </div>
  );
};
