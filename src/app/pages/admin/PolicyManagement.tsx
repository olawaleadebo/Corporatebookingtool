import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { 
  Shield,
  Plane,
  Hotel,
  Car,
  Save,
  Plus,
  Users,
  BarChart3,
  Edit,
  Trash2,
  UserPlus,
  CheckCircle,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

export function PolicyManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('policies');

  const [flightPolicies, setFlightPolicies] = useState({
    maxDomesticCost: 800,
    maxInternationalCost: 2500,
    advanceBookingDays: 7,
    allowBusinessClass: false,
    requireApprovalOver: 1500,
    preferredAirlines: ['United', 'British Airways', 'Lufthansa']
  });

  const [hotelPolicies, setHotelPolicies] = useState({
    maxNightlyRate: 300,
    requireApprovalOver: 400,
    allowLuxuryHotels: false,
    preferredChains: ['Hilton', 'Marriott', 'Hyatt']
  });

  const [carPolicies, setCarPolicies] = useState({
    maxDailyRate: 100,
    allowedCategories: ['Economy', 'Compact', 'Mid-size'],
    requireApprovalOver: 150
  });

  const [roles, setRoles] = useState([
    { id: 1, name: 'Policy Admin', permissions: ['Create', 'Edit', 'Delete', 'Approve'], users: 3, description: 'Full policy management access' },
    { id: 2, name: 'Policy Manager', permissions: ['Create', 'Edit', 'Approve'], users: 8, description: 'Can manage and approve policies' },
    { id: 3, name: 'Policy Viewer', permissions: ['View'], users: 45, description: 'Read-only access to policies' },
    { id: 4, name: 'Department Lead', permissions: ['Create', 'Edit'], users: 12, description: 'Can create department-specific policies' },
  ]);

  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', description: '', permissions: [] as string[] });

  const policyStats = {
    totalPolicies: 24,
    activePolicies: 21,
    violations: 45,
    complianceRate: 94,
    savingsFromPolicies: '₦12.5M'
  };

  const violationData = [
    { policy: 'Flight - Business Class', violations: 12, severity: 'High', trend: '+3', department: 'Sales' },
    { policy: 'Hotel - Nightly Rate', violations: 18, severity: 'Medium', trend: '-2', department: 'Marketing' },
    { policy: 'Flight - Advance Booking', violations: 8, severity: 'Low', trend: '+1', department: 'Engineering' },
    { policy: 'Car - Daily Rate', violations: 7, severity: 'Low', trend: '0', department: 'Operations' },
  ];

  const departmentCompliance = [
    { name: 'Engineering', compliance: 98, violations: 3 },
    { name: 'Marketing', compliance: 95, violations: 8 },
    { name: 'Sales', compliance: 88, violations: 18 },
    { name: 'Operations', compliance: 92, violations: 12 },
    { name: 'Finance', compliance: 85, violations: 4 },
  ];

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTrendBadgeClass = (trend: string) => {
    if (trend.startsWith('+')) {
      return 'bg-red-100 text-red-700 border-red-200';
    } else if (trend.startsWith('-')) {
      return 'bg-green-100 text-green-700 border-green-200';
    }
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getComplianceBadgeClass = (compliance: number) => {
    if (compliance >= 95) {
      return 'bg-green-100 text-green-700 border-green-200';
    } else if (compliance >= 90) {
      return 'bg-blue-100 text-blue-700 border-blue-200';
    }
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  const handleSave = () => {
    toast.success('Policies updated successfully');
  };

  const handleAddRole = () => {
    if (newRole.name && newRole.permissions.length > 0) {
      setRoles([...roles, { 
        id: roles.length + 1, 
        ...newRole, 
        users: 0 
      }]);
      setNewRole({ name: '', description: '', permissions: [] });
      setIsAddRoleOpen(false);
      toast.success('Role created successfully');
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleDeleteRole = (id: number) => {
    setRoles(roles.filter(role => role.id !== id));
    toast.success('Role deleted successfully');
  };

  const togglePermission = (permission: string) => {
    if (newRole.permissions.includes(permission)) {
      setNewRole({ ...newRole, permissions: newRole.permissions.filter(p => p !== permission) });
    } else {
      setNewRole({ ...newRole, permissions: [...newRole.permissions, permission] });
    }
  };

  return (
    <AdminLayout>
      <div className="bg-gray-50 min-h-full">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Policy Management</h1>
            <p className="text-sm text-gray-600 mt-1">Configure travel policies, manage roles, and view compliance reports</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
              <TabsTrigger value="policies" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <Shield className="w-4 h-4 mr-2" />
                Policies
              </TabsTrigger>
              <TabsTrigger value="roles" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <Users className="w-4 h-4 mr-2" />
                Roles & Permissions
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <BarChart3 className="w-4 h-4 mr-2" />
                Reports
              </TabsTrigger>
            </TabsList>

            {/* POLICIES TAB */}
            <TabsContent value="policies" className="space-y-6">
              <Tabs defaultValue="flights" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                  <TabsTrigger value="flights">
                    <Plane className="w-4 h-4 mr-2" />
                    Flights
                  </TabsTrigger>
                  <TabsTrigger value="hotels">
                    <Hotel className="w-4 h-4 mr-2" />
                    Hotels
                  </TabsTrigger>
                  <TabsTrigger value="cars">
                    <Car className="w-4 h-4 mr-2" />
                    Cars
                  </TabsTrigger>
                </TabsList>

                {/* Flight Policies */}
                <TabsContent value="flights">
                  <Card className="bg-white border-gray-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-gray-900">Flight Booking Policies</CardTitle>
                      <CardDescription className="text-gray-600">
                        Set limits and requirements for flight bookings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-gray-700">Max Domestic Flight Cost (₦)</Label>
                          <Input
                            type="number"
                            value={flightPolicies.maxDomesticCost}
                            onChange={(e) => setFlightPolicies({...flightPolicies, maxDomesticCost: parseInt(e.target.value)})}
                            className="bg-white border-gray-300 text-gray-900"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-700">Max International Flight Cost (₦)</Label>
                          <Input
                            type="number"
                            value={flightPolicies.maxInternationalCost}
                            onChange={(e) => setFlightPolicies({...flightPolicies, maxInternationalCost: parseInt(e.target.value)})}
                            className="bg-white border-gray-300 text-gray-900"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-700">Advance Booking (Days)</Label>
                          <Input
                            type="number"
                            value={flightPolicies.advanceBookingDays}
                            onChange={(e) => setFlightPolicies({...flightPolicies, advanceBookingDays: parseInt(e.target.value)})}
                            className="bg-white border-gray-300 text-gray-900"
                          />
                          <p className="text-xs text-gray-500">Flights must be booked this many days in advance</p>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-700">Require Approval Over (₦)</Label>
                          <Input
                            type="number"
                            value={flightPolicies.requireApprovalOver}
                            onChange={(e) => setFlightPolicies({...flightPolicies, requireApprovalOver: parseInt(e.target.value)})}
                            className="bg-white border-gray-300 text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <Label className="text-gray-900">Allow Business Class</Label>
                          <p className="text-sm text-gray-600">Permit business class bookings</p>
                        </div>
                        <Switch
                          checked={flightPolicies.allowBusinessClass}
                          onCheckedChange={(checked) => setFlightPolicies({...flightPolicies, allowBusinessClass: checked})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-700">Preferred Airlines</Label>
                        <div className="flex flex-wrap gap-2">
                          {flightPolicies.preferredAirlines.map((airline, idx) => (
                            <span key={idx} className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 border-blue-200">
                              {airline}
                            </span>
                          ))}
                          <Button size="sm" variant="outline" className="border-gray-300 text-gray-700">
                            <Plus className="w-3 h-3 mr-1" />
                            Add Airline
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Hotel Policies */}
                <TabsContent value="hotels">
                  <Card className="bg-white border-gray-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-gray-900">Hotel Booking Policies</CardTitle>
                      <CardDescription className="text-gray-600">
                        Set limits and requirements for hotel bookings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-gray-700">Max Nightly Rate (₦)</Label>
                          <Input
                            type="number"
                            value={hotelPolicies.maxNightlyRate}
                            onChange={(e) => setHotelPolicies({...hotelPolicies, maxNightlyRate: parseInt(e.target.value)})}
                            className="bg-white border-gray-300 text-gray-900"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-700">Require Approval Over (₦)</Label>
                          <Input
                            type="number"
                            value={hotelPolicies.requireApprovalOver}
                            onChange={(e) => setHotelPolicies({...hotelPolicies, requireApprovalOver: parseInt(e.target.value)})}
                            className="bg-white border-gray-300 text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <Label className="text-gray-900">Allow Luxury Hotels</Label>
                          <p className="text-sm text-gray-600">Permit 5-star hotel bookings</p>
                        </div>
                        <Switch
                          checked={hotelPolicies.allowLuxuryHotels}
                          onCheckedChange={(checked) => setHotelPolicies({...hotelPolicies, allowLuxuryHotels: checked})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-700">Preferred Hotel Chains</Label>
                        <div className="flex flex-wrap gap-2">
                          {hotelPolicies.preferredChains.map((chain, idx) => (
                            <span key={idx} className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 border-blue-200">
                              {chain}
                            </span>
                          ))}
                          <Button size="sm" variant="outline" className="border-gray-300 text-gray-700">
                            <Plus className="w-3 h-3 mr-1" />
                            Add Chain
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Car Policies */}
                <TabsContent value="cars">
                  <Card className="bg-white border-gray-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-gray-900">Car Rental Policies</CardTitle>
                      <CardDescription className="text-gray-600">
                        Set limits and requirements for car rentals
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-gray-700">Max Daily Rate (₦)</Label>
                          <Input
                            type="number"
                            value={carPolicies.maxDailyRate}
                            onChange={(e) => setCarPolicies({...carPolicies, maxDailyRate: parseInt(e.target.value)})}
                            className="bg-white border-gray-300 text-gray-900"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-700">Require Approval Over (₦)</Label>
                          <Input
                            type="number"
                            value={carPolicies.requireApprovalOver}
                            onChange={(e) => setCarPolicies({...carPolicies, requireApprovalOver: parseInt(e.target.value)})}
                            className="bg-white border-gray-300 text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-700">Allowed Car Categories</Label>
                        <div className="flex flex-wrap gap-2">
                          {carPolicies.allowedCategories.map((category, idx) => (
                            <span key={idx} className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 border-blue-200">
                              {category}
                            </span>
                          ))}
                          <Button size="sm" variant="outline" className="border-gray-300 text-gray-700">
                            <Plus className="w-3 h-3 mr-1" />
                            Add Category
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save All Policies
                </Button>
              </div>
            </TabsContent>

            {/* ROLES TAB */}
            <TabsContent value="roles" className="space-y-6">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Roles & Permissions</CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage user roles and their permissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Roles</h2>
                    <Button
                      onClick={() => setIsAddRoleOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Role
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {roles.map(role => (
                      <div key={role.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-sm font-bold text-gray-900">{role.name}</h3>
                            <p className="text-xs text-gray-500">{role.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="border-gray-300 text-gray-700">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-300 text-gray-700"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Permissions:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {role.permissions.map(permission => (
                              <span key={permission} className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 border-blue-200">
                                {permission}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Users: {role.users}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Role</DialogTitle>
                    <DialogDescription>
                      Create a new role with specific permissions
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700">Role Name</Label>
                      <Input
                        type="text"
                        value={newRole.name}
                        onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                        className="bg-white border-gray-300 text-gray-900"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700">Description</Label>
                      <Input
                        type="text"
                        value={newRole.description}
                        onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                        className="bg-white border-gray-300 text-gray-900"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700">Permissions</Label>
                      <div className="flex flex-wrap gap-2">
                        {['Create', 'Edit', 'Delete', 'Approve', 'View'].map(permission => (
                          <button
                            key={permission}
                            type="button"
                            onClick={() => togglePermission(permission)}
                            className={`inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-xs font-medium transition-colors
                              ${newRole.permissions.includes(permission) 
                                ? 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200' 
                                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                              }`}
                          >
                            {permission}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button
                      onClick={handleAddRole}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Add Role
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* REPORTS TAB */}
            <TabsContent value="reports" className="space-y-6">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Policy Statistics</CardTitle>
                  <CardDescription className="text-gray-600">
                    Overview of policy compliance and statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500">Total Policies</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{policyStats.totalPolicies}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500">Active Policies</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{policyStats.activePolicies}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500">Total Violations</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{policyStats.violations}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500">Compliance Rate</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{policyStats.complianceRate}%</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 md:col-span-2">
                      <p className="text-xs text-gray-500">Savings from Policies</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{policyStats.savingsFromPolicies}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-gray-900">Policy Violations</CardTitle>
                      <CardDescription className="text-gray-600">
                        Recent policy violations by department
                      </CardDescription>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {violationData.map(violation => {
                      const severityClass = getSeverityBadgeClass(violation.severity);
                      const trendClass = getTrendBadgeClass(violation.trend);
                      
                      return (
                        <div key={violation.policy} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-sm font-bold text-gray-900">{violation.policy}</h3>
                              <p className="text-xs text-gray-500 mt-0.5">{violation.department}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium ${severityClass}`}>
                                {violation.severity}
                              </span>
                              <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 border-gray-200">
                                {violation.violations}
                              </span>
                              <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium ${trendClass}`}>
                                {violation.trend}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-gray-900">Department Compliance</CardTitle>
                      <CardDescription className="text-gray-600">
                        Compliance rates by department
                      </CardDescription>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {departmentCompliance.map(department => {
                      const complianceClass = getComplianceBadgeClass(department.compliance);
                      
                      return (
                        <div key={department.name} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-sm font-bold text-gray-900">{department.name}</h3>
                              <p className="text-xs text-gray-500 mt-0.5">{department.violations} violations</p>
                            </div>
                            <span className={`inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm font-medium ${complianceClass}`}>
                              {department.compliance}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
}
