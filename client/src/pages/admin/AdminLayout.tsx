import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  Menu,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export default function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed && (
            <Link to="/admin" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <span className="text-sm font-bold text-primary-foreground">S</span>
              </div>
              <span className="font-bold">Admin</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(collapsed && 'mx-auto')}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                  collapsed && 'justify-center px-2'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User & Actions */}
        <div className="border-t border-border p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={cn('mb-2', collapsed ? 'w-full' : '')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {!collapsed && (
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              size={collapsed ? 'icon' : 'default'}
              className={cn('w-full', collapsed && 'w-10')}
              asChild
            >
              <Link to="/">
                {collapsed ? <ChevronLeft className="h-4 w-4" /> : 'Back to Store'}
              </Link>
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size={collapsed ? 'icon' : 'default'}
            className={cn('w-full mt-2 text-destructive hover:text-destructive', collapsed && 'w-10')}
            onClick={logout}
          >
            <LogOut className={cn('h-4 w-4', !collapsed && 'mr-2')} />
            {!collapsed && 'Logout'}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 transition-all duration-300',
          collapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <div className="min-h-screen bg-background p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
