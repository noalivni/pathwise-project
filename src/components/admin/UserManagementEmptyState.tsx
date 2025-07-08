
import { Users } from "lucide-react";

interface UserManagementEmptyStateProps {
  loading: boolean;
}

const UserManagementEmptyState = ({ loading }: UserManagementEmptyStateProps) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground">No users found</p>
    </div>
  );
};

export default UserManagementEmptyState;
