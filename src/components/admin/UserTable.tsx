
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserData {
  id: string;
  full_name: string | null;
  email: string | null;
  role: 'user' | 'admin';
  created_at: string;
}

interface UserTableProps {
  users: UserData[];
  updatingRole: string | null;
  onRoleChange: (userId: string, newRole: 'user' | 'admin') => void;
}

const UserTable = ({ users, updatingRole, onRoleChange }: UserTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {user.full_name || 'No name set'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ID: {user.id.slice(0, 8)}...
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-mono text-sm">
                  {user.email || 'No email'}
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={user.role === 'admin' ? 'default' : 'secondary'}
                  className={user.role === 'admin' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : ''}
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm text-muted-foreground">
                  {formatDate(user.created_at)}
                </div>
              </TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(newRole: 'user' | 'admin') => onRoleChange(user.id, newRole)}
                  disabled={updatingRole === user.id}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
