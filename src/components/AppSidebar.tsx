
import { Brain, Home, FileText, Target, Users, BookOpen, FileUser, Settings, LogOut, BarChart3 } from "lucide-react";
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
  const userMenuItems: MenuItem[] = [
    { id: 'dashboard', title: 'Dashboard', icon: Home },
    { id: 'onboarding', title: 'Onboarding', icon: FileText },
    { id: 'assessment', title: 'Skills Assessment', icon: Target },
    { id: 'jobs', title: 'Job Recommendations', icon: Users },
    { id: 'interview', title: 'Interview Practice', icon: Users, premium: true },
    { id: 'learning', title: 'Learning Resources', icon: BookOpen, premium: true },
    { id: 'resume', title: 'Resume Builder', icon: FileUser },
  ];

  const adminMenuItems: MenuItem[] = [
    { id: 'dashboard', title: 'Admin Dashboard', icon: BarChart3 },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Pathwise
          </span>
        </div>
        {userRole === 'admin' && (
          <div className="mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full text-center">
            Admin Access
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {userRole === 'admin' ? 'Admin Tools' : 'Career Tools'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onViewChange(item.id)}
                    isActive={activeView === item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                    {item.premium && (
                      <span className="text-xs bg-gradient-to-r from-teal-500 to-blue-600 text-white px-2 py-1 rounded-full">
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
      
      <SidebarFooter className="p-4 border-t">
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
