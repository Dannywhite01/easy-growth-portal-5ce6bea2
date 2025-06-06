
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Shield, DollarSign, TrendingUp, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  const profileData = [
    {
      label: 'Full Name',
      value: user?.name || 'N/A',
      icon: User,
    },
    {
      label: 'Email Address',
      value: user?.email || 'N/A',
      icon: Mail,
    },
    {
      label: 'Account Type',
      value: user?.isAdmin ? 'Administrator' : 'Investor',
      icon: Shield,
    },
  ];

  const investmentStats = [
    {
      label: 'Current Balance',
      value: `$${user?.balance?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      label: 'Total Invested',
      value: `$${user?.totalInvested?.toFixed(2) || '0.00'}`,
      icon: TrendingUp,
      color: 'text-blue-600',
    },
    {
      label: 'Total Profit Earned',
      value: `$${user?.totalProfit?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <CardTitle className="text-2xl">{user?.name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                {user?.email}
                {user?.isAdmin && (
                  <Badge variant="secondary" className="ml-2">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Your account details and information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {profileData.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Icon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">{item.label}</p>
                    <p className="text-lg font-semibold">{item.value}</p>
                  </div>
                </div>
              );
            })}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Member Since</p>
                <p className="text-lg font-semibold">Today</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Summary</CardTitle>
          <CardDescription>
            Overview of your investment performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {investmentStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-6 bg-white border rounded-lg">
                  <Icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Account Features */}
      <Card>
        <CardHeader>
          <CardTitle>Account Features</CardTitle>
          <CardDescription>
            Available features and limits for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <span className="font-medium">Investment Range</span>
              <Badge variant="secondary">$5 - $30</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="font-medium">Profit Rate</span>
              <Badge variant="secondary">2% Guaranteed</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <span className="font-medium">Withdrawal Day</span>
              <Badge variant="secondary">Saturday 10 PM</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <span className="font-medium">Approval Required</span>
              <Badge variant="secondary">Admin Approved</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
