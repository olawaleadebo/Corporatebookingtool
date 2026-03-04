import { useNavigate } from 'react-router';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  ArrowLeft,
  TrendingUp,
  Download,
  FileText,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react';

export function Reports() {
  const navigate = useNavigate();

  const reports = [
    { name: 'Monthly Spending Report', description: 'Detailed breakdown of all travel expenses', icon: BarChart3, date: 'Feb 2026' },
    { name: 'Department Analytics', description: 'Spending analysis by department', icon: PieChart, date: 'Q1 2026' },
    { name: 'Policy Compliance Report', description: 'Policy violations and trends', icon: FileText, date: 'Feb 2026' },
    { name: 'Booking Trends', description: 'Travel booking patterns and insights', icon: TrendingUp, date: 'Last 90 days' },
  ];

  const quickStats = [
    { label: 'Total Bookings', value: '1,248', change: '+12.5%' },
    { label: 'Total Spend', value: '₦485K', change: '-5.2%' },
    { label: 'Avg. Booking Cost', value: '₦388', change: '+3.1%' },
    { label: 'Policy Compliance', value: '94%', change: '+2.3%' },
  ];

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
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-sm text-gray-600">View and export system reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, idx) => (
            <Card key={idx} className="bg-white border-gray-200 shadow-sm">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last period
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Report Filters */}
        <Card className="bg-white border-gray-200 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-gray-900">Generate Custom Report</CardTitle>
            <CardDescription className="text-gray-600">
              Filter and export data based on your criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select defaultValue="february">
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="january">January 2026</SelectItem>
                  <SelectItem value="february">February 2026</SelectItem>
                  <SelectItem value="march">March 2026</SelectItem>
                  <SelectItem value="q1">Q1 2026</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-types">
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">All Types</SelectItem>
                  <SelectItem value="flights">Flights Only</SelectItem>
                  <SelectItem value="hotels">Hotels Only</SelectItem>
                  <SelectItem value="cars">Cars Only</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Available Reports */}
        <Tabs defaultValue="standard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger value="standard">Standard Reports</TabsTrigger>
            <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="standard">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reports.map((report, idx) => (
                <Card key={idx} className="bg-white border-gray-200 shadow-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <report.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-gray-900 mb-1">{report.name}</CardTitle>
                          <CardDescription className="text-gray-600">
                            {report.description}
                          </CardDescription>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {report.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-100"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        CSV
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="py-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Custom Reports</h3>
                <p className="text-gray-600 mb-6">
                  Create custom reports with specific filters and metrics
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Create Custom Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}