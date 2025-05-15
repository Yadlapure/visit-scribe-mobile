
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, UserCheck, User, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Example user type - modify this to match your backend model
interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'practitioner' | 'admin';
  status: 'active' | 'inactive';
}

export const UsersTable = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // This would normally come from your API
  const [users, setUsers] = useState<UserData[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'client', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'practitioner', status: 'active' },
    { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active' },
    { id: '4', name: 'Alice Johnson', email: 'alice@example.com', role: 'practitioner', status: 'inactive' },
    { id: '5', name: 'Bob Williams', email: 'bob@example.com', role: 'client', status: 'active' },
  ]);

  const handleRoleChange = async (userId: string, newRole: 'client' | 'practitioner' | 'admin') => {
    try {
      setLoading(true);
      // This is where you would make a call to your backend API
      // Example: await api.updateUserRole(userId, newRole)
      
      // For now, we'll update the local state to simulate the change
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      toast({
        title: "Role updated",
        description: "User role has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update user role",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusToggle = async (userId: string, newStatus: 'active' | 'inactive') => {
    try {
      setLoading(true);
      // This is where you would make a call to your backend API
      // Example: await api.updateUserStatus(userId, newStatus)
      
      // For now, we'll update the local state to simulate the change
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      
      toast({
        title: "Status updated",
        description: `User is now ${newStatus}.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update user status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'practitioner':
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={user.role}
                      onValueChange={(value) => 
                        handleRoleChange(
                          user.id, 
                          value as 'client' | 'practitioner' | 'admin'
                        )
                      }
                      disabled={loading || user.role === 'admin'}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="practitioner">Practitioner</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => 
                        handleStatusToggle(
                          user.id, 
                          user.status === 'active' ? 'inactive' : 'active'
                        )
                      }
                      disabled={loading}
                    >
                      {user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
