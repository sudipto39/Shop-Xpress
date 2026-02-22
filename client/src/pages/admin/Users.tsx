import { useState } from 'react';
import { Search, MoreHorizontal, UserCheck, UserX, Shield, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const mockUsers = [
  { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', createdAt: '2024-01-15' },
  { _id: '2', name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', createdAt: '2024-01-10' },
  { _id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active', createdAt: '2024-01-18' },
  { _id: '4', name: 'Mike Johnson', email: 'mike@example.com', role: 'user', status: 'inactive', createdAt: '2024-01-12' },
  { _id: '5', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'user', status: 'active', createdAt: '2024-01-20' },
];

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users] = useState(mockUsers);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMakeAdmin = (userId: string) => {
    toast.success('User role updated to admin');
  };

  const handleRemoveAdmin = (userId: string) => {
    toast.success('Admin privileges removed');
  };

  const handleDeleteUser = (userId: string) => {
    toast.success('User deleted successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users Management</h1>
        <p className="text-muted-foreground">Manage all registered users</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-0"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-card neumorphic overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === 'admin' ? 'default' : 'secondary'}
                    className={user.role === 'admin' ? 'gradient-primary border-0' : ''}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === 'active' ? 'default' : 'secondary'}
                    className={user.status === 'active' ? 'bg-success text-success-foreground' : ''}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {user.role === 'admin' ? (
                        <DropdownMenuItem onClick={() => handleRemoveAdmin(user._id)}>
                          <UserX className="mr-2 h-4 w-4" />
                          Remove Admin
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleMakeAdmin(user._id)}>
                          <Shield className="mr-2 h-4 w-4" />
                          Make Admin
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
