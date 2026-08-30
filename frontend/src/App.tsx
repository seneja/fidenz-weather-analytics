import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navbar } from './components/Navbar';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { CloudSun } from 'lucide-react';

const App: React.FC = () => {
  const { isAuthenticated, isLoading, error } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <CloudSun className="h-12 w-12 animate-pulse text-blue-600 dark:text-blue-400" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Checking session authentication...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-50 p-4 text-center dark:bg-gray-900">
        <div className="max-w-md rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Authentication Error</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Retry Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-200 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <Dashboard />
    </div>
  );
};

export default App;
