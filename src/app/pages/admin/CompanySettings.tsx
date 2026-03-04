import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  ArrowLeft,
  Settings,
  Building2,
  Mail,
  Globe,
  Save,
  Bell,
  Palette,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';

export function CompanySettings() {
  const navigate = useNavigate();

  const [companyInfo, setCompanyInfo] = useState({
    name: 'Your Company Name',
    address: '123 Business Street, Lagos, Nigeria',
    phone: '+234 (0) 123 456 7890',
    email: 'contact@yourcompany.com',
    website: 'www.yourcompany.com',
    taxId: 'RC-123456'
  });

  const [branding, setBranding] = useState({
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    logoUrl: '',
    companyName: 'Your Company Name'
  });

  const [notifications, setNotifications] = useState({
    emailBookingConfirmation: true,
    emailApprovalRequest: true,
    emailPolicyViolation: true,
    emailBudgetAlert: true,
    smsBookingUpdates: false,
    smsUrgentApprovals: true
  });

  const [integrations, setIntegrations] = useState({
    slackNotifications: true,
    microsoftTeams: false,
    quickbooksSync: true,
    sapIntegration: false
  });

  const handleSaveCompanyInfo = () => {
    toast.success('Company information updated successfully');
  };

  const handleSaveBranding = () => {
    toast.success('Branding settings updated successfully');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences updated successfully');
  };

  const handleSaveIntegrations = () => {
    toast.success('Integration settings updated successfully');
  };

  const handleLogoUpload = () => {
    toast.success('Logo uploaded successfully');
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
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Company Settings</h1>
                <p className="text-sm text-gray-600">Configure system settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="branding" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100">
            <TabsTrigger value="branding">
              <Palette className="w-4 h-4 mr-2" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="company">
              <Building2 className="w-4 h-4 mr-2" />
              Company Info
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <Globe className="w-4 h-4 mr-2" />
              Integrations
            </TabsTrigger>
          </TabsList>

          {/* Branding */}
          <TabsContent value="branding">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Branding & Appearance</CardTitle>
                <CardDescription className="text-gray-600">
                  Customize the look and feel of your booking system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-gray-700">Company Name</Label>
                  <Input
                    value={branding.companyName}
                    onChange={(e) => setBranding({...branding, companyName: e.target.value})}
                    placeholder="Your Company Name"
                    className="bg-white border-gray-300 text-gray-900"
                  />
                  <p className="text-sm text-gray-500">This will appear throughout the application</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Company Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      {branding.logoUrl ? (
                        <img src={branding.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Button
                        onClick={handleLogoUpload}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-100"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Logo
                      </Button>
                      <p className="text-sm text-gray-500 mt-2">
                        Recommended: PNG or SVG, 200x200px minimum
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={branding.primaryColor}
                        onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                        className="w-20 h-10 p-1 border-gray-300"
                      />
                      <Input
                        value={branding.primaryColor}
                        onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                        placeholder="#3B82F6"
                        className="flex-1 bg-white border-gray-300 text-gray-900"
                      />
                    </div>
                    <p className="text-sm text-gray-500">Used for buttons and primary elements</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={branding.secondaryColor}
                        onChange={(e) => setBranding({...branding, secondaryColor: e.target.value})}
                        className="w-20 h-10 p-1 border-gray-300"
                      />
                      <Input
                        value={branding.secondaryColor}
                        onChange={(e) => setBranding({...branding, secondaryColor: e.target.value})}
                        placeholder="#1E40AF"
                        className="flex-1 bg-white border-gray-300 text-gray-900"
                      />
                    </div>
                    <p className="text-sm text-gray-500">Used for accents and hover states</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Preview</h4>
                  <div className="flex gap-3">
                    <Button style={{ backgroundColor: branding.primaryColor }} className="text-white">
                      Primary Button
                    </Button>
                    <Button style={{ backgroundColor: branding.secondaryColor }} className="text-white">
                      Secondary Button
                    </Button>
                    <Button variant="outline" className="border-gray-300 text-gray-700">
                      Outline Button
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSaveBranding}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Branding
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Information */}
          <TabsContent value="company">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Company Information</CardTitle>
                <CardDescription className="text-gray-600">
                  Update your company details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Company Name</Label>
                    <Input
                      value={companyInfo.name}
                      onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700">Tax ID / RC Number</Label>
                    <Input
                      value={companyInfo.taxId}
                      onChange={(e) => setCompanyInfo({...companyInfo, taxId: e.target.value})}
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label className="text-gray-700">Business Address</Label>
                    <Textarea
                      value={companyInfo.address}
                      onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                      className="bg-white border-gray-300 text-gray-900"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700">Phone Number</Label>
                    <Input
                      value={companyInfo.phone}
                      onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700">Email Address</Label>
                    <Input
                      type="email"
                      value={companyInfo.email}
                      onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700">Website</Label>
                    <Input
                      value={companyInfo.website}
                      onChange={(e) => setCompanyInfo({...companyInfo, website: e.target.value})}
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSaveCompanyInfo}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Notification Preferences</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage how you receive system notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <Label className="text-gray-900">Booking Confirmations</Label>
                      <p className="text-sm text-gray-600">Receive email when bookings are confirmed</p>
                    </div>
                    <Switch
                      checked={notifications.emailBookingConfirmation}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailBookingConfirmation: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <Label className="text-gray-900">Approval Requests</Label>
                      <p className="text-sm text-gray-600">Get notified of pending approvals</p>
                    </div>
                    <Switch
                      checked={notifications.emailApprovalRequest}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailApprovalRequest: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <Label className="text-gray-900">Policy Violations</Label>
                      <p className="text-sm text-gray-600">Alert when policies are violated</p>
                    </div>
                    <Switch
                      checked={notifications.emailPolicyViolation}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailPolicyViolation: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <Label className="text-gray-900">Budget Alerts</Label>
                      <p className="text-sm text-gray-600">Notify when budgets are exceeded</p>
                    </div>
                    <Switch
                      checked={notifications.emailBudgetAlert}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailBudgetAlert: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">SMS Notifications</h3>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <Label className="text-gray-900">Booking Updates</Label>
                      <p className="text-sm text-gray-600">SMS for booking status changes</p>
                    </div>
                    <Switch
                      checked={notifications.smsBookingUpdates}
                      onCheckedChange={(checked) => setNotifications({...notifications, smsBookingUpdates: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <Label className="text-gray-900">Urgent Approvals</Label>
                      <p className="text-sm text-gray-600">SMS for high-priority approvals</p>
                    </div>
                    <Switch
                      checked={notifications.smsUrgentApprovals}
                      onCheckedChange={(checked) => setNotifications({...notifications, smsUrgentApprovals: checked})}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSaveNotifications}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Third-Party Integrations</CardTitle>
                <CardDescription className="text-gray-600">
                  Connect with external services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <Label className="text-gray-900">Slack Notifications</Label>
                        <p className="text-sm text-gray-600">Send notifications to Slack channels</p>
                      </div>
                    </div>
                    <Switch
                      checked={integrations.slackNotifications}
                      onCheckedChange={(checked) => setIntegrations({...integrations, slackNotifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <Label className="text-gray-900">Microsoft Teams</Label>
                        <p className="text-sm text-gray-600">Integrate with Teams messaging</p>
                      </div>
                    </div>
                    <Switch
                      checked={integrations.microsoftTeams}
                      onCheckedChange={(checked) => setIntegrations({...integrations, microsoftTeams: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <Label className="text-gray-900">QuickBooks Sync</Label>
                        <p className="text-sm text-gray-600">Sync expenses with QuickBooks</p>
                      </div>
                    </div>
                    <Switch
                      checked={integrations.quickbooksSync}
                      onCheckedChange={(checked) => setIntegrations({...integrations, quickbooksSync: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <Label className="text-gray-900">SAP Integration</Label>
                        <p className="text-sm text-gray-600">Connect with SAP ERP system</p>
                      </div>
                    </div>
                    <Switch
                      checked={integrations.sapIntegration}
                      onCheckedChange={(checked) => setIntegrations({...integrations, sapIntegration: checked})}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSaveIntegrations}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}