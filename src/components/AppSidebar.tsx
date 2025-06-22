
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LogOut, User, Settings, Crown, Home, Target, BookOpen, MessageSquare, FileText, Award, Users, BarChart3, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";

interface AppSidebarProps {
  userRole: 'user' | 'admin';
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

interface MenuItem {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  isPremium?: boolean;
}

const AppSidebar = ({ userRole, activeView, onViewChange, onLogout }: AppSidebarProps) => {
  const { profile } = useAuth();

  const userMenuItems: MenuItem[] = [
    { key: 'dashboard', label: 'Dashboard', icon: Home },
    { key: 'assessment', label: 'Skills Assessment', icon: Target },
    { key: 'jobs', label: 'Job Recommendations', icon: BookOpen },
    { 
      key: 'interview', 
      label: 'Interview Practice', 
      icon: MessageSquare,
      isPremium: true 
    },
    { 
      key: 'learning', 
      label: 'Learning Resources', 
      icon: Award,
      isPremium: true 
    },
    { key: 'resume', label: 'Resume Builder', icon: FileText },
    { key: 'profile', label: 'Profile', icon: User },
  ];

  const adminMenuItems: MenuItem[] = [
    { key: 'dashboard', label: 'Admin Dashboard', icon: BarChart3 },
    { key: 'users', label: 'User Management', icon: Users },
    { key: 'data', label: 'Data Analytics', icon: Database },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <Sidebar variant="inset" className="pathwise-sidebar">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="text-lg font-bold text-main">Pathwise</span>
          </div>
          <ThemeToggle />
        </div>
        
        {profile && userRole === 'user' && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-sub">Welcome back,</p>
                <p className="font-semibold text-main">{profile.full_name || 'User'}</p>
              </div>
              <Badge 
                variant={profile.subscription_status === 'premium' ? 'default' : 'secondary'}
                className={profile.subscription_status === 'premium' ? 'bg-gradient-to-r from-teal-500 to-blue-600' : ''}
              >
                {profile.subscription_status === 'premium' && <Crown className="w-3 h-3 mr-1" />}
                {profile.subscription_status.toUpperCase()}
              </Badge>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sub">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.key)}
                    isActive={activeView === item.key}
                    className={`nav-link text-main hover:text-main ${
                      activeView === item.key 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    } transition-colors duration-200`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                    {item.isPremium && profile?.subscription_status !== 'premium' && (
                      <Crown className="ml-auto h-3 w-3 text-yellow-500" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="space-y-2">
          <SidebarMenuButton 
            onClick={onLogout}
            className="nav-link text-main hover:text-main hover:bg-muted transition-colors duration-200"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
