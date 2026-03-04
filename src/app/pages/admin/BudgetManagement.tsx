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
import { Progress } from '../../components/ui/progress';
import { 
  ArrowLeft,
  DollarSign,
  Plus,
  Edit,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

export function BudgetManagement() {
  const navigate = useNavigate();
  const [showAddBudget, setShowAddBudget] = useState(false);

  const [budgets, setBudgets] = useState([
    { id: 1, department: 'Sales', monthly: 50000, spent: 42500, percentage: 85, year: 2026, quarter: 'Q1' },
    { id: 2, department: 'Marketing', monthly: 40000, spent: 28400, percentage: 71, year: 2026, quarter: 'Q1' },
    { id: 3, department: 'Engineering', monthly: 60000, spent: 47400, percentage: 79, year: 2026, quarter: 'Q1' },
    { id: 4, department: 'Operations', monthly: 33000, spent: 31350, percentage: 95, year: 2026, quarter: 'Q1' },
    { id: 5, department: 'HR', monthly: 15000, spent: 8250, percentage: 55, year: 2026, quarter: 'Q1' },
  ]);

  const [newBudget, setNewBudget] = useState({
    department: '',
    monthly: 0,
    year: 2026,
    quarter: 'Q1'
  });

  const handleAddBudget = () => {
    if (!newBudget.department || newBudget.monthly <= 0) {
      toast.error('Please fill in all fields');
      return;
    }

    const budget = {
      id: budgets.length + 1,
      ...newBudget,
      spent: 0,
      percentage: 0
    };

    setBudgets([...budgets, budget]);
    toast.success(`Budget for ${newBudget.department} added successfully`);
    setShowAddBudget(false);
    setNewBudget({ department: '', monthly: 0, year: 2026, quarter: 'Q1' });
  };

  const getBudgetStatus = (percentage: number) => {
    if (percentage >= 90) return { color: 'text-red-600', bg: 'bg-red-500', label: 'Critical', badgeClass: 'bg-red-100 text-red-700 border-red-200' };
    if (percentage >= 75) return { color: 'text-amber-600', bg: 'bg-amber-500', label: 'Warning', badgeClass: 'bg-amber-100 text-amber-700 border-amber-200' };
    return { color: 'text-green-600', bg: 'bg-green-500', label: 'Good', badgeClass: 'bg-green-100 text-green-700 border-green-200' };
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.monthly, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalPercentage = (totalSpent / totalBudget) * 100;

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
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Budget Management</h1>
                <p className="text-sm text-gray-600">Manage department budgets</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-blue-600 border-0">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-blue-100 mb-1">Total Monthly Budget</p>
                <p className="text-3xl font-bold text-white">₦{totalBudget.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900">₦{totalSpent.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Remaining</p>
                <p className="text-3xl font-bold text-green-600">₦{(totalBudget - totalSpent).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Utilization</p>
                <p className="text-3xl font-bold text-blue-600">{totalPercentage.toFixed(0)}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Budgets */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-gray-900">Department Budgets</CardTitle>
                <CardDescription className="text-gray-600">
                  Monitor and manage spending by department
                </CardDescription>
              </div>
              <Button
                onClick={() => setShowAddBudget(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Budget
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {budgets.map((budget) => {
              const status = getBudgetStatus(budget.percentage);
              const remaining = budget.monthly - budget.spent;

              return (
                <div key={budget.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{budget.department}</h3>
                        <Badge className={status.badgeClass}>
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{budget.year} - {budget.quarter}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Budget</p>
                      <p className="text-2xl font-bold text-gray-900">₦{budget.monthly.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Spent</p>
                      <p className="text-2xl font-bold text-blue-600">₦{budget.spent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Remaining</p>
                      <p className={`text-2xl font-bold ${status.color}`}>
                        ₦{remaining.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Budget Utilization</span>
                      <span className={`font-semibold ${status.color}`}>{budget.percentage}%</span>
                    </div>
                    <Progress value={budget.percentage} className="h-3" />
                    {budget.percentage >= 90 && (
                      <div className="flex items-center gap-2 text-sm text-red-600 mt-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Critical: Budget threshold exceeded</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Budget Trends */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Top Spending Departments</CardTitle>
              <CardDescription className="text-gray-600">
                Highest budget utilization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {budgets
                .sort((a, b) => b.percentage - a.percentage)
                .slice(0, 5)
                .map((budget, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-gray-900 font-medium">{budget.department}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">₦{budget.spent.toLocaleString()}</span>
                      <Badge className={getBudgetStatus(budget.percentage).badgeClass}>
                        {budget.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Budget Alerts</CardTitle>
              <CardDescription className="text-gray-600">
                Departments approaching limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {budgets
                .filter(b => b.percentage >= 75)
                .map((budget, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-gray-900 font-medium">{budget.department}</p>
                      <p className="text-sm text-gray-600">
                        {budget.percentage}% of budget used (₦{budget.spent.toLocaleString()} / ₦{budget.monthly.toLocaleString()})
                      </p>
                    </div>
                  </div>
                ))}
              {budgets.filter(b => b.percentage >= 75).length === 0 && (
                <div className="text-center py-8 text-gray-600">
                  <p>No budget alerts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Budget Dialog */}
      <Dialog open={showAddBudget} onOpenChange={setShowAddBudget}>
        <DialogContent className="bg-white border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle>Add New Budget</DialogTitle>
            <DialogDescription className="text-gray-600">
              Create a budget allocation for a department
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Department</Label>
              <Select value={newBudget.department} onValueChange={(value) => setNewBudget({ ...newBudget, department: value })}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                  <SelectItem value="Customer Service">Customer Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Monthly Budget (₦)</Label>
              <Input
                type="number"
                placeholder="50000"
                value={newBudget.monthly || ''}
                onChange={(e) => setNewBudget({ ...newBudget, monthly: parseInt(e.target.value) || 0 })}
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700">Year</Label>
                <Select value={newBudget.year.toString()} onValueChange={(value) => setNewBudget({ ...newBudget, year: parseInt(value) })}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2027">2027</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">Quarter</Label>
                <Select value={newBudget.quarter} onValueChange={(value) => setNewBudget({ ...newBudget, quarter: value })}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Q1">Q1</SelectItem>
                    <SelectItem value="Q2">Q2</SelectItem>
                    <SelectItem value="Q3">Q3</SelectItem>
                    <SelectItem value="Q4">Q4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddBudget(false)}
              className="border-gray-300 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddBudget}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Add Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}