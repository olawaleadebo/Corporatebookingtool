import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  ArrowLeft,
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';

export function UserManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');

  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john.doe@company.com', role: 'Traveller', department: 'Marketing', status: 'active', bookings: 24 },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@company.com', role: 'Travel Arranger', department: 'HR', status: 'active', bookings: 0 },
    { id: 3, name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'Traveller', department: 'Sales', status: 'active', bookings: 18 },
    { id: 4, name: 'Michael Chen', email: 'michael.chen@company.com', role: 'Traveller', department: 'Engineering', status: 'active', bookings: 12 },
    { id: 5, name: 'Emily Davis', email: 'emily.davis@company.com', role: 'Traveller', department: 'Operations', status: 'inactive', bookings: 8 },
    { id: 6, name: 'Robert Martinez', email: 'robert.martinez@company.com', role: 'Admin', department: 'IT', status: 'active', bookings: 5 },
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Traveller',
    department: ''
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === 'all' || user.role.toLowerCase() === selectedTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.department) {
      toast.error('Please fill in all fields');
      return;
    }

    const user = {
      id: users.length + 1,
      ...newUser,
      status: 'active',
      bookings: 0
    };

    setUsers([...users, user]);
    toast.success(`User ${newUser.name} added successfully`);
    setShowAddUser(false);
    setNewUser({ name: '', email: '', role: 'Traveller', department: '' });
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(u => u.id !== userId));
    toast.success('User deleted successfully');
  };

  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    ));
    toast.success('User status updated');
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
            <Button
              onClick={() => navigate('/admin')}
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-600">{users.length} total users</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                <p className="text-sm text-gray-600 mt-1">Total Users</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {users.filter(u => u.status === 'active').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Active</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {users.filter(u => u.role === 'Traveller').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Travellers</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600">
                  {users.filter(u => u.role === 'Travel Arranger').length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Arrangers</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-gray-900">All Users</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage system users and permissions
                </CardDescription>
              </div>
              <Button
                onClick={() => setShowAddUser(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-300 text-gray-900"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4 bg-gray-100 mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="traveller">Travellers</TabsTrigger>
                <TabsTrigger value="travel arranger">Arrangers</TabsTrigger>
                <TabsTrigger value="admin">Admins</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab}>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-400 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-100 p-3 rounded-full">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <p className="font-semibold text-gray-900">{user.name}</p>
                              <Badge className={
                                user.status === 'active'
                                  ? 'bg-green-100 text-green-700 border-green-200'
                                  : 'bg-gray-100 text-gray-700 border-gray-200'
                              }>
                                {user.status}
                              </Badge>
                              <Badge className={
                                user.role === 'Admin' 
                                  ? 'bg-purple-100 text-purple-700 border-purple-200'
                                  : user.role === 'Travel Arranger'
                                  ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                                  : 'bg-blue-100 text-blue-700 border-blue-200'
                              }>
                                {user.role}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {user.email}
                              </span>
                              <span>•</span>
                              <span>{user.department}</span>
                              <span>•</span>
                              <span>{user.bookings} bookings</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleUserStatus(user.id)}
                            className={
                              user.status === 'active'
                                ? 'border-amber-500 text-amber-700 hover:bg-amber-50'
                                : 'border-green-500 text-green-700 hover:bg-green-50'
                            }
                          >
                            {user.status === 'active' ? (
                              <>
                                <UserX className="w-4 h-4 mr-1" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4 mr-1" />
                                Activate
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(user.id)}
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No users found</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Add User Dialog */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription className="text-gray-600">
              Create a new user account in the system
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Full Name</Label>
              <Input
                placeholder="John Doe"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Email Address</Label>
              <Input
                type="email"
                placeholder="john.doe@company.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Role</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Traveller">Traveller</SelectItem>
                  <SelectItem value="Travel Arranger">Travel Arranger</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Department</Label>
              <Select value={newUser.department} onValueChange={(value) => setNewUser({ ...newUser, department: value })}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddUser(false)}
              className="border-gray-300 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}