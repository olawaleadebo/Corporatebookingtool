import { useNavigate } from 'react-router';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { 
  Plane, 
  Users,
  Settings,
  FileText,
  DollarSign,
  TrendingUp,
  LogOut,
  Shield,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

export function AdminDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Users', value: '248', change: '+12%', icon: Users, color: 'text-blue-600' },
    { label: 'Active Bookings', value: '156', change: '+8%', icon: Activity, color: 'text-green-600' },
    { label: 'Monthly Spend', value: '₦189M', change: '-5%', icon: DollarSign, color: 'text-blue-600' },
    { label: 'Policy Violations', value: '12', change: '-15%', icon: AlertCircle, color: 'text-red-600' },
  ];

  const recentActivity = [
    { type: 'user', action: 'New user registered', user: 'Emily Carter', time: '5 min ago', status: 'success' },
    { type: 'booking', action: 'Booking approved', user: 'Michael Chen', time: '12 min ago', status: 'success' },
    { type: 'policy', action: 'Policy violation detected', user: 'Sarah Johnson', time: '1 hour ago', status: 'warning' },
    { type: 'budget', action: 'Budget threshold reached', department: 'Sales', time: '2 hours ago', status: 'error' },
  ];

  const departmentSpending = [
    { name: 'Sales', budget: '₦58.5M', spent: '₦49.9M', percentage: 85, status: 'warning' },
    { name: 'Marketing', budget: '₦46.8M', spent: '₦33.2M', percentage: 71, status: 'success' },
    { name: 'Engineering', budget: '₦70.2M', spent: '₦55.5M', percentage: 79, status: 'success' },
    { name: 'Operations', budget: '₦39M', spent: '₦37M', percentage: 95, status: 'error' },
  ];

  return (
    <AdminLayout>
      <div className="bg-gray-50 min-h-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => (
              <Card key={idx} className="bg-white border-gray-200 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <Badge className={
                      stat.change.startsWith('+') 
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-red-100 text-red-700 border-red-200'
                    }>
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card 
                className="bg-white border-gray-200 shadow-sm cursor-pointer hover:border-blue-400 transition-all"
                onClick={() => navigate('/admin/users')}
              >
                <CardHeader>
                  <Users className="w-8 h-8 text-blue-600 mb-2" />
                  <CardTitle className="text-gray-900">User Management</CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage users and roles
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="bg-white border-gray-200 shadow-sm cursor-pointer hover:border-blue-400 transition-all"
                onClick={() => navigate('/admin/policies')}
              >
                <CardHeader>
                  <Shield className="w-8 h-8 text-blue-600 mb-2" />
                  <CardTitle className="text-gray-900">Policy Management</CardTitle>
                  <CardDescription className="text-gray-600">
                    Configure travel policies
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="bg-white border-gray-200 shadow-sm cursor-pointer hover:border-blue-400 transition-all"
                onClick={() => navigate('/admin/budgets')}
              >
                <CardHeader>
                  <DollarSign className="w-8 h-8 text-blue-600 mb-2" />
                  <CardTitle className="text-gray-900">Budget Management</CardTitle>
                  <CardDescription className="text-gray-600">
                    Set and track budgets
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="bg-white border-gray-200 shadow-sm cursor-pointer hover:border-blue-400 transition-all"
                onClick={() => navigate('/admin/reports')}
              >
                <CardHeader>
                  <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
                  <CardTitle className="text-gray-900">Reports & Analytics</CardTitle>
                  <CardDescription className="text-gray-600">
                    View detailed reports
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="bg-white border-gray-200 shadow-sm cursor-pointer hover:border-blue-400 transition-all"
                onClick={() => navigate('/admin/settings')}
              >
                <CardHeader>
                  <Settings className="w-8 h-8 text-blue-600 mb-2" />
                  <CardTitle className="text-gray-900">Company Settings</CardTitle>
                  <CardDescription className="text-gray-600">
                    Configure system settings
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-blue-600 border-0 cursor-pointer hover:shadow-lg hover:shadow-blue-500/20 transition-all">
                <CardHeader>
                  <FileText className="w-8 h-8 text-white mb-2" />
                  <CardTitle className="text-white">Export Data</CardTitle>
                  <CardDescription className="text-blue-100">
                    Download system reports
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Recent Activity</CardTitle>
                <CardDescription className="text-gray-600">
                  Latest system events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      activity.status === 'success' ? 'bg-green-100' :
                      activity.status === 'warning' ? 'bg-yellow-100' :
                      'bg-red-100'
                    }`}>
                      {activity.status === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {activity.status === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
                      {activity.status === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-600">
                        {activity.user || activity.department}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      <span className="hidden sm:inline">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Department Spending */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Department Spending</CardTitle>
                <CardDescription className="text-gray-600">
                  Budget utilization by department
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {departmentSpending.map((dept, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900">{dept.name}</p>
                        <p className="text-sm text-gray-600">{dept.spent} of {dept.budget}</p>
                      </div>
                      <Badge className={
                        dept.status === 'success' ? 'bg-green-100 text-green-700 border-green-200' :
                        dept.status === 'warning' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                        'bg-red-100 text-red-700 border-red-200'
                      }>
                        {dept.percentage}%
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          dept.status === 'success' ? 'bg-green-500' :
                          dept.status === 'warning' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${dept.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}