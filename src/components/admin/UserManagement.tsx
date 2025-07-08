
import { Card, CardContent } from "@/components/ui/card";
import UserManagementHeader from "@/components/admin/UserManagementHeader";
import UserTable from "@/components/admin/UserTable";
import UserManagementEmptyState from "@/components/admin/UserManagementEmptyState";
import { useUserManagement } from "@/hooks/useUserManagement";

const UserManagement = () => {
  const {
    users,
    loading,
    updatingRole,
    fetchUsers,
    updateUserRole,
  } = useUserManagement();

  return (
    <Card>
      <UserManagementHeader 
        userCount={users.length}
        loading={loading}
        onRefresh={fetchUsers}
      />
      <CardContent>
        {loading || users.length === 0 ? (
          <UserManagementEmptyState loading={loading} />
        ) : (
          <UserTable 
            users={users}
            updatingRole={updatingRole}
            onRoleChange={updateUserRole}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;
