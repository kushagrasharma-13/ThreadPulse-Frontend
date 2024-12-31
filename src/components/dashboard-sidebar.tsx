'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Home, BarChart, Settings, Users, PlusCircle, LogOut, Search, Menu, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { refreshAccessToken, logout } from '@/utils/auth';
import { useMediaQuery } from '@/hooks/use-media-query';

const menuItems = [
  { icon: Search, label: 'Search', href: '/dashboard/search' },
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: BarChart, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Users, label: 'Community', href: '/dashboard/community' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isRedditConnected, setIsRedditConnected] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        const isValid = await refreshAccessToken();
        setIsLoggedIn(isValid);
      } else {
        setIsLoggedIn(false);
      }
    };
    checkAuthStatus();
    
    if (isLoggedIn) {
      const checkRedditConnection = async () => {
        const connected = await new Promise(resolve => setTimeout(() => resolve(Math.random() > 0.5), 1000));
        setIsRedditConnected(connected as boolean);
      };
      checkRedditConnection();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Sidebar 
      className={cn(
        "border-r h-screen bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
      collapsible="icon"
    >
      <SidebarHeader className="border-b px-2 py-3">
        <div className="flex items-center justify-between">
          {!isCollapsed && <h2 className="text-lg font-semibold tracking-tight">ThreadPulse</h2>}
          {/* <SidebarTrigger onClick={toggleSidebar} className="h-6 w-6"> */}
          <SidebarTrigger className="h-6 w-6">
            <Menu className="h-4 w-4" />
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 px-2 py-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link 
                href={item.href} 
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <div className="space-y-2">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard/connect-reddit"
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === '/dashboard/connect-reddit' ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  isCollapsed && "justify-center px-0"
                )}
              >
                {isRedditConnected ? (
                  <>
                    <Users className="h-4 w-4" />
                    {!isCollapsed && <span>Manage Reddit</span>}
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4" />
                    {!isCollapsed && <span>Connect Reddit</span>}
                  </>
                )}
              </Link>
              <Button 
                variant="outline" 
                className={cn(
                  "w-full justify-start gap-3",
                  isCollapsed && "justify-center px-0"
                )} 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                {!isCollapsed && <span>Logout</span>}
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button 
                variant="outline" 
                className={cn(
                  "w-full justify-start gap-3",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <LogIn className="h-4 w-4" />
                {!isCollapsed && <span>Login</span>}
              </Button>
            </Link>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

