import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FileQuestion,
  BookOpen,
  ClipboardList,
  Trophy,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ['ADMIN', 'TEACHER', 'STUDENT'],
  },
  {
    label: 'User Management',
    path: '/admin/users',
    icon: <Users className="h-5 w-5" />,
    roles: ['ADMIN'],
  },
  {
    label: 'Question Bank',
    path: '/teacher/questions',
    icon: <FileQuestion className="h-5 w-5" />,
    roles: ['TEACHER'],
  },
  {
    label: 'Create Exam',
    path: '/teacher/create-exam',
    icon: <ClipboardList className="h-5 w-5" />,
    roles: ['TEACHER'],
  },
  {
    label: 'My Exams',
    path: '/student/exams',
    icon: <BookOpen className="h-5 w-5" />,
    roles: ['STUDENT'],
  },
  {
    label: 'Results',
    path: '/student/results',
    icon: <Trophy className="h-5 w-5" />,
    roles: ['STUDENT'],
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  const filteredItems = navItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile header */}
          <div className="flex items-center justify-between p-4 lg:hidden border-b border-sidebar-border">
            <span className="font-display font-bold text-lg text-sidebar-foreground">
              Navigation
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                    'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                      : 'text-sidebar-foreground'
                  )
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="px-4 py-3 rounded-lg bg-sidebar-accent/50">
              <p className="text-xs text-sidebar-foreground/70">Logged in as</p>
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.fullName}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
