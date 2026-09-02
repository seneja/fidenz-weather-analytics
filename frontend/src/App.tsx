import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { AppLayout } from './components/layout/AppLayout';
import { CloudSun } from 'lucide-react';
import { Button } from './components/ui/Button';

const App: React.FC = () => {
  const { isAuthenticated, isLoading, error } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <CloudSun className="h-12 w-12 animate-pulse text-accent" />
          <p className="text-sm font-medium text-muted-foreground">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4 text-center">
        <div className="max-w-md rounded-xl bg-surface border border-border p-8 shadow-elevated">
          <h2 className="text-xl font-bold text-error">Authentication Error</h2>
          <p className="mt-3 text-sm text-secondary-foreground">{error.message}</p>
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
            className="mt-6 w-full"
          >
            Retry Login
          </Button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
};

export default App;
