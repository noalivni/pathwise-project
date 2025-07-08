
import { RefreshCw, Users } from "lucide-react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UserManagementHeaderProps {
  userCount: number;
  loading: boolean;
  onRefresh: () => void;
}

const UserManagementHeader = ({ userCount, loading, onRefresh }: UserManagementHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Management
        </CardTitle>
        <CardDescription>
          Manage user accounts and roles • {userCount} total users
        </CardDescription>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh}
        disabled={loading}
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
      </Button>
    </CardHeader>
  );
};

export default UserManagementHeader;
