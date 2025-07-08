
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

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
    <div className="overflow-hidden border rounded-md">
      <ResizablePanelGroup direction="horizontal" className="min-h-[400px]">
        <ResizablePanel defaultSize={25} minSize={15}>
          <div className="h-full">
            <div className="border-b bg-muted/50 px-4 py-3">
              <h4 className="font-medium text-sm">Username</h4>
            </div>
            <div className="space-y-0">
              {users.map((user) => (
                <div key={user.id} className="border-b px-4 py-3">
                  <div className="font-medium">
                    {user.full_name || 'No name set'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={20} minSize={15}>
          <div className="h-full">
            <div className="border-b bg-muted/50 px-4 py-3">
              <h4 className="font-medium text-sm">ID</h4>
            </div>
            <div className="space-y-0">
              {users.map((user) => (
                <div key={user.id} className="border-b px-4 py-3">
                  <div className="text-xs text-muted-foreground font-mono">
                    {user.id.slice(0, 8)}...
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={25} minSize={20}>
          <div className="h-full">
            <div className="border-b bg-muted/50 px-4 py-3">
              <h4 className="font-medium text-sm">Email</h4>
            </div>
            <div className="space-y-0">
              {users.map((user) => (
                <div key={user.id} className="border-b px-4 py-3">
                  <div className="font-mono text-sm">
                    {user.email || 'No email'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={15} minSize={10}>
          <div className="h-full">
            <div className="border-b bg-muted/50 px-4 py-3">
              <h4 className="font-medium text-sm">Role</h4>
            </div>
            <div className="space-y-0">
              {users.map((user) => (
                <div key={user.id} className="border-b px-4 py-3">
                  <Badge 
                    variant={user.role === 'admin' ? 'default' : 'secondary'}
                    className={user.role === 'admin' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : ''}
                  >
                    {user.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={15} minSize={10}>
          <div className="h-full">
            <div className="border-b bg-muted/50 px-4 py-3">
              <h4 className="font-medium text-sm">Joined</h4>
            </div>
            <div className="space-y-0">
              {users.map((user) => (
                <div key={user.id} className="border-b px-4 py-3">
                  <div className="text-sm text-muted-foreground">
                    {formatDate(user.created_at)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={20} minSize={15}>
          <div className="h-full">
            <div className="border-b bg-muted/50 px-4 py-3">
              <h4 className="font-medium text-sm">Actions</h4>
            </div>
            <div className="space-y-0">
              {users.map((user) => (
                <div key={user.id} className="border-b px-4 py-3">
                  <Select
                    value={user.role}
                    onValueChange={(newRole: 'user' | 'admin') => onRoleChange(user.id, newRole)}
                    disabled={updatingRole === user.id}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default UserTable;
