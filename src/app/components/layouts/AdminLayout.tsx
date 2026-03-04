import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Button } from '../ui/button';
import { 
  LayoutDashboard,
  Users,
  Shield,
  DollarSign,
  TrendingUp,
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'User Management', path: '/admin/users', icon: Users },
  { name: 'Policy Management', path: '/admin/policies', icon: Shield },
  { name: 'Budget Management', path: '/admin/budgets', icon: DollarSign },
  { name: 'Reports & Analytics', path: '/admin/reports', icon: TrendingUp },
  { name: 'Company Settings', path: '/admin/settings', icon: Settings },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActivePath = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed position */}
      <aside className={`
        fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-50
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 flex flex-col
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
              <p className="text-sm text-gray-600">Management Portal</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Navigation - Scrollable with its own scrollbar */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-colors duration-150
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
                <span className="text-sm">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer - Fixed at bottom, never scrolls */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-white">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-gray-100"
            onClick={() => navigate('/login')}
          >
            <LogOut className="w-5 h-5 mr-3 text-gray-500" />
            <span className="text-sm">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
            <h1 className="font-bold text-gray-900">Admin Panel</h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}