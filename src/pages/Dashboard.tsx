
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Wallet, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Balance',
      value: `$${profile?.balance?.toFixed(2) || '0.00'}`,
      icon: Wallet,
      description: 'Available for investment',
      color: 'text-green-600',
    },
    {
      title: 'Total Invested',
      value: `$${profile?.total_invested?.toFixed(2) || '0.00'}`,
      icon: TrendingUp,
      description: 'Currently invested',
      color: 'text-blue-600',
    },
    {
      title: 'Total Profit',
      value: `$${profile?.total_profit?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      description: '2% return earned',
      color: 'text-purple-600',
    },
    {
      title: 'Next Withdrawal',
      value: 'Saturday 10 PM',
      icon: Calendar,
      description: 'Weekly withdrawal window',
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {profile?.full_name || 'Investor'}!</h1>
        <p className="text-blue-100">
          Track your investments and grow your wealth with InvestPro.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
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
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Make Deposit</CardTitle>
            <CardDescription>
              Add funds to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/deposit">
              <Button className="w-full bg-green-600 hover:bg-green-700">Add Funds</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Investment</CardTitle>
            <CardDescription>
              Start investing with as little as $5
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/investment">
              <Button className="w-full">Make Investment</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Withdrawal</CardTitle>
            <CardDescription>
              Next withdrawal window: Saturday 10 PM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/withdraw">
              <Button variant="outline" className="w-full">
                Request Withdrawal
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest transactions and investments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No recent activity</p>
            <p className="text-sm">Start investing to see your transaction history</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
