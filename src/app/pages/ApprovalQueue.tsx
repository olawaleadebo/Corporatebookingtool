import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { 
  Plane, 
  Hotel, 
  Car,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Calendar,
  DollarSign,
  User,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

export function ApprovalQueue() {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');

  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 1,
      traveller: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      department: 'Marketing',
      type: 'flight',
      title: 'San Francisco to Tokyo',
      airline: 'United Airlines',
      date: '2026-03-20',
      returnDate: '2026-03-25',
      amount: 2450,
      costCenter: 'Marketing',
      projectCode: 'PRJ-2026-042',
      justification: 'Attending Tokyo Tech Conference to meet with potential clients and present our new product line.',
      submittedDate: '2026-03-01 14:30',
      policyCompliant: true,
      budgetStatus: 'within',
      urgency: 'high',
      details: {
        departure: '08:00 AM',
        arrival: '2:30 PM +1',
        stops: '1 stop',
        duration: '14h 30m',
        class: 'Economy'
      }
    },
    {
      id: 2,
      traveller: 'Michael Chen',
      email: 'michael.chen@company.com',
      department: 'Sales',
      type: 'hotel',
      title: 'Grand Hyatt Tokyo',
      location: 'Tokyo, Japan',
      date: '2026-03-20',
      returnDate: '2026-03-25',
      amount: 1890,
      costCenter: 'Sales',
      projectCode: 'PRJ-2026-042',
      justification: 'Accommodation for Tokyo Tech Conference attendance.',
      submittedDate: '2026-03-01 14:35',
      policyCompliant: false,
      budgetStatus: 'over',
      urgency: 'medium',
      policyViolations: ['Hotel rate exceeds $300/night limit by $78'],
      details: {
        roomType: 'Deluxe King',
        rate: '378/night',
        nights: '5 nights',
        amenities: 'Breakfast included, WiFi, Gym'
      }
    },
    {
      id: 3,
      traveller: 'Emily Davis',
      email: 'emily.davis@company.com',
      department: 'Operations',
      type: 'car',
      title: 'Toyota Camry',
      location: 'Tokyo Airport',
      date: '2026-03-20',
      returnDate: '2026-03-25',
      amount: 450,
      costCenter: 'Operations',
      projectCode: 'PRJ-2026-042',
      justification: 'Ground transportation for Tokyo conference.',
      submittedDate: '2026-03-01 15:00',
      policyCompliant: true,
      budgetStatus: 'within',
      urgency: 'low',
      details: {
        carType: 'Mid-size',
        rate: '$90/day',
        duration: '5 days',
        features: 'Automatic, AC, GPS'
      }
    },
    {
      id: 4,
      traveller: 'Robert Martinez',
      email: 'robert.martinez@company.com',
      department: 'Engineering',
      type: 'flight',
      title: 'Boston to London',
      airline: 'British Airways',
      date: '2026-03-22',
      returnDate: '2026-03-29',
      amount: 1850,
      costCenter: 'Engineering',
      projectCode: 'PRJ-2026-055',
      justification: 'Technical training at London office and collaboration with UK team on infrastructure project.',
      submittedDate: '2026-03-01 16:20',
      policyCompliant: true,
      budgetStatus: 'within',
      urgency: 'medium',
      details: {
        departure: '6:30 PM',
        arrival: '6:00 AM +1',
        stops: 'Direct',
        duration: '7h 30m',
        class: 'Economy'
      }
    },
  ]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'low':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <Plane className="w-5 h-5 text-orange-400" />;
      case 'hotel':
        return <Hotel className="w-5 h-5 text-orange-400" />;
      case 'car':
        return <Car className="w-5 h-5 text-orange-400" />;
      default:
        return null;
    }
  };

  const handleApprove = (booking: any) => {
    setSelectedBooking(booking);
    setShowApproveDialog(true);
  };

  const handleReject = (booking: any) => {
    setSelectedBooking(booking);
    setShowRejectDialog(true);
  };

  const confirmApproval = () => {
    setPendingRequests(pendingRequests.filter(r => r.id !== selectedBooking.id));
    toast.success(`Booking request for ${selectedBooking.traveller} approved`);
    setShowApproveDialog(false);
    setApprovalNotes('');
    setSelectedBooking(null);
  };

  const confirmRejection = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    setPendingRequests(pendingRequests.filter(r => r.id !== selectedBooking.id));
    toast.error(`Booking request for ${selectedBooking.traveller} rejected`);
    setShowRejectDialog(false);
    setRejectionReason('');
    setSelectedBooking(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="bg-black/50 border-b border-gray-800 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
            <Button
              onClick={() => navigate('/arranger')}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-2 rounded-lg">
                <CheckCircle className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Approval Queue</h1>
                <p className="text-sm text-gray-400">{pendingRequests.length} requests pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-orange-500 to-yellow-500 border-0">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-black">{pendingRequests.length}</p>
                <p className="text-sm text-black/70 mt-1">Total Pending</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-400">
                  {pendingRequests.filter(r => r.urgency === 'high').length}
                </p>
                <p className="text-sm text-gray-400 mt-1">High Priority</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-400">
                  {pendingRequests.filter(r => !r.policyCompliant).length}
                </p>
                <p className="text-sm text-gray-400 mt-1">Policy Issues</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  ${pendingRequests.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400 mt-1">Total Value</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white">Pending Approval Requests</CardTitle>
                <CardDescription className="text-gray-400">
                  Review and approve travel bookings
                </CardDescription>
              </div>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-400 hover:bg-gray-700"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="p-5 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-500/10 p-3 rounded-lg">
                      {getTypeIcon(request.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-white text-lg">{request.title}</p>
                        <Badge className={getUrgencyColor(request.urgency)}>
                          {request.urgency} priority
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <User className="w-4 h-4" />
                        <span className="font-medium text-white">{request.traveller}</span>
                        <span>•</span>
                        <span>{request.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>{request.date} - {request.returnDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">${request.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Submitted: {request.submittedDate}</p>
                  </div>
                </div>

                {/* Policy Status */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    {request.policyCompliant ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${request.policyCompliant ? 'text-green-400' : 'text-red-400'}`}>
                      {request.policyCompliant ? 'Policy Compliant' : 'Policy Violation'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {request.budgetStatus === 'within' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    )}
                    <span className={`text-sm font-medium ${request.budgetStatus === 'within' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {request.budgetStatus === 'within' ? 'Within Budget' : 'Over Budget'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    <span>Cost Center: {request.costCenter}</span>
                  </div>
                </div>

                {/* Policy Violations */}
                {!request.policyCompliant && request.policyViolations && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-400 mb-1">Policy Issues:</p>
                        {request.policyViolations.map((violation, idx) => (
                          <p key={idx} className="text-sm text-red-300">• {violation}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-900/50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Project Code</p>
                    <p className="text-sm text-white font-mono">{request.projectCode}</p>
                  </div>
                  {Object.entries(request.details).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-xs text-gray-500 mb-1 capitalize">{key}</p>
                      <p className="text-sm text-white">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Justification */}
                <div className="mb-4 p-3 bg-gray-900/50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Business Justification</p>
                  <p className="text-sm text-gray-300">{request.justification}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(request)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(request)}
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500/10"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-400 hover:bg-gray-700"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Details
                  </Button>
                </div>
              </div>
            ))}

            {pendingRequests.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <p className="text-xl text-white font-semibold mb-2">All caught up!</p>
                <p className="text-gray-400">No pending approval requests</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Approve Booking Request</DialogTitle>
            <DialogDescription className="text-gray-400">
              Confirm approval for {selectedBooking?.traveller}'s booking
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-400">Booking Details</p>
              <p className="text-lg font-semibold text-white mt-1">{selectedBooking?.title}</p>
              <p className="text-2xl font-bold text-green-400 mt-2">${selectedBooking?.amount.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <Label>Approval Notes (Optional)</Label>
              <Textarea
                placeholder="Add any notes for this approval..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproveDialog(false)}
              className="border-gray-600 text-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmApproval}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Reject Booking Request</DialogTitle>
            <DialogDescription className="text-gray-400">
              Provide a reason for rejecting {selectedBooking?.traveller}'s booking
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-400">Booking Details</p>
              <p className="text-lg font-semibold text-white mt-1">{selectedBooking?.title}</p>
              <p className="text-2xl font-bold text-red-400 mt-2">${selectedBooking?.amount.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <Label>Rejection Reason *</Label>
              <Textarea
                placeholder="Explain why this booking is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              className="border-gray-600 text-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRejection}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
