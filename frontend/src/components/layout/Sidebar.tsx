
import { CloudRain, LayoutDashboard, Settings, Map, LogOut } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

export function Sidebar() {
  const { logout } = useAuth0();
  
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, active: true },
    { name: 'Maps', icon: Map, active: false },
    { name: 'Settings', icon: Settings, active: false },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-border bg-surface flex flex-col transition-all duration-300 hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2 text-primary font-semibold text-lg tracking-tight">
          <div className="bg-accent text-accent-foreground p-1.5 rounded-md">
            <CloudRain size={20} />
          </div>
          Atmos Analytics
        </div>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 px-2">
          Menu
        </div>
        {navItems.map((item) => (
          <button
            key={item.name}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
              item.active 
                ? "bg-secondary text-primary" 
                : "text-secondary-foreground hover:bg-surface hover:text-primary"
            )}
          >
            <item.icon size={18} />
            {item.name}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-secondary-foreground"
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        >
          <LogOut size={18} />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
