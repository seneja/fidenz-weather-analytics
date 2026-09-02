import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/Card';
import { CloudRain } from 'lucide-react';

export const Login: React.FC = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-info/10 rounded-full blur-[100px] pointer-events-none" />

      <header className="flex justify-end p-6 z-10">
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center p-6 z-10">
        <Card className="w-full max-w-lg border-none shadow-elevated bg-surface/80 backdrop-blur-xl">
          <CardHeader className="text-center pb-2 pt-10">
            <div className="mx-auto mb-6 bg-accent/10 p-4 rounded-2xl w-20 h-20 flex items-center justify-center">
              <CloudRain className="w-10 h-10 text-accent" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Atmos Analytics</CardTitle>
            <CardDescription className="text-base mt-2 px-6">
              Compare and rank global locations using our advanced weather comfort algorithms.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 pb-10 px-8">
            <Button
              size="lg"
              className="w-full text-base h-14"
              isLoading={isLoading}
              onClick={() => loginWithRedirect()}
            >
              Access Dashboard
            </Button>
          </CardContent>
          <CardFooter className="justify-center border-t border-border/50 py-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
              Securely powered by Auth0
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};
