import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ThemeToggle } from './ThemeToggle';
import { LogOut, CloudSun } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth0();

  return (
    <nav className="border-b border-gray-200 bg-white px-4 py-2.5 dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between">
        <div className="flex items-center gap-2">
          <CloudSun className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <span className="self-center text-xl font-bold whitespace-nowrap dark:text-white">
            Comfort Index
          </span>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isAuthenticated && user && (
            <div className="flex items-center gap-3">
              {user.picture && (
                <img
                  src={user.picture}
                  alt={user.name || 'User Profile'}
                  className="h-8 w-8 rounded-full border border-gray-300 dark:border-gray-600"
                />
              )}
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">
                  {user.nickname || user.name}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-none">
                  {user.email}
                </p>
              </div>
              <button
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-950/40"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
