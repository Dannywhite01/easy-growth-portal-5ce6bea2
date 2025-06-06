
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, DollarSign, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
}

const AdminPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInvestments: 0,
    totalProfitsPaid: 0,
    pendingWithdrawals: 0,
  });

  useEffect(() => {
    // Load mock data for demonstration
    const mockRequests: WithdrawalRequest[] = [
      {
        id: '1',
        userId: '1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        amount: 50.50,
        status: 'pending',
        requestDate: new Date().toISOString(),
      },
      {
        id: '2',
        userId: '2',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        amount: 75.25,
        status: 'pending',
        requestDate: new Date().toISOString(),
      },
    ];

    setWithdrawalRequests(mockRequests);
    setStats({
      totalUsers: 156,
      totalInvestments: 4580.50,
      totalProfitsPaid: 916.10,
      pendingWithdrawals: 2,
    });
  }, []);

  const handleWithdrawalAction = (requestId: string, action: 'approved' | 'rejected') => {
    setWithdrawalRequests(prev =>
      prev.map(request =>
        request.id === requestId ? { ...request, status: action } : request
      )
    );

    toast({
      title: `Withdrawal ${action}`,
      description: `The withdrawal request has been ${action}.`,
      variant: action === 'approved' ? 'default' : 'destructive',
    });
  };

  const adminStats = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Total Investments',
      value: `$${stats.totalInvestments.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Profits Paid',
      value: `$${stats.totalProfitsPaid.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-purple-600',
    },
    {
      title: 'Pending Withdrawals',
      value: stats.pendingWithdrawals.toString(),
      icon: Clock,
      color: 'text-orange-600',
    },
  ];

  if (!user?.isAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-center">
          <Shield className="h-8 w-8 mr-3" />
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-red-100">Platform management and oversight</p>
          </div>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Withdrawal Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Withdrawal Requests</CardTitle>
          <CardDescription>
            Review and approve withdrawal requests from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {withdrawalRequests.filter(req => req.status === 'pending').length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No pending withdrawal requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {withdrawalRequests
                .filter(req => req.status === 'pending')
                .map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="font-medium">{request.userName}</p>
                          <p className="text-sm text-gray-500">{request.userEmail}</p>
                        </div>
                        <Badge variant="outline">
                          ${request.amount.toFixed(2)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Requested: {new Date(request.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleWithdrawalAction(request.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleWithdrawalAction(request.id, 'rejected')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Administrative Actions</CardTitle>
          <CardDescription>
            History of recent admin decisions and platform activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {withdrawalRequests
              .filter(req => req.status !== 'pending')
              .slice(0, 5)
              .map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      request.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">
                        Withdrawal {request.status} for {request.userName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Amount: ${request.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={request.status === 'approved' ? 'default' : 'destructive'}>
                    {request.status}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
