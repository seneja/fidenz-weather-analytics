
import { Bell, Menu } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { ThemeToggle } from '../ThemeToggle';
import { Button } from '../ui/Button';

export function Header() {
  const { user } = useAuth0();

  return (
    <header className="h-16 flex-shrink-0 border-b border-border bg-background flex items-center justify-between px-6 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu size={20} />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="relative text-secondary-foreground">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-error" />
        </Button>
        <div className="h-8 w-8 rounded-full border border-border overflow-hidden bg-surface flex items-center justify-center">
          {user?.picture ? (
            <img src={user.picture} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm font-medium text-primary">
              {user?.name?.charAt(0) || 'U'}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
