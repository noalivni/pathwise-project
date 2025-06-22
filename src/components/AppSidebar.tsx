
import { Home, FileText, Target, Users, BookOpen, FileUser, Settings, LogOut, BarChart3, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  premium?: boolean;
}

interface AppSidebarProps {
  userRole: 'user' | 'admin';
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

const AppSidebar = ({ userRole, activeView, onViewChange, onLogout }: AppSidebarProps) => {
  const { signOut } = useAuth();

  const userMenuItems: MenuItem[] = [
    { id: 'dashboard', title: 'Dashboard', icon: Home },
    { id: 'assessment', title: 'Skills Assessment', icon: Target },
    { id: 'jobs', title: 'Job Recommendations', icon: Users },
    { id: 'interview', title: 'Interview Practice', icon: Users, premium: true },
    { id: 'learning', title: 'Learning Resources', icon: BookOpen, premium: true },
    { id: 'resume', title: 'Resume Builder', icon: FileUser },
    { id: 'profile', title: 'Profile', icon: User },
  ];

  const adminMenuItems: MenuItem[] = [
    { id: 'dashboard', title: 'Admin Dashboard', icon: BarChart3 },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : userMenuItems;

  const handleLogout = async () => {
    await signOut();
    onLogout();
  };

  return (
    <Sidebar className="bg-sidebar border-sidebar-border">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/ceb34abc-2d20-4666-9bc9-a202c773db0a.png" 
            alt="Pathwise Logo" 
            className="w-10 h-10"
          />
          <span className="text-2xl font-bold text-sidebar-foreground">
            Pathwise
          </span>
        </div>
        {userRole === 'admin' && (
          <div className="mt-3 px-3 py-1 bg-destructive/20 text-destructive text-xs rounded-full text-center font-medium">
            Admin Access
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 font-medium">
            {userRole === 'admin' ? 'Admin Tools' : 'Career Tools'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onViewChange(item.id)}
                    isActive={activeView === item.id}
                    className={`flex items-center justify-between hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200 ${
                      activeView === item.id ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                    {item.premium && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full font-medium">
                        PRO
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
