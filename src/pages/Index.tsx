
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Shield, DollarSign, Clock } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">InvestPro</h1>
            </div>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Invest Smart, <span className="text-blue-600">Earn More</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Start your investment journey with as little as $5. Enjoy guaranteed 2% returns on your deposits with our secure and transparent platform.
          </p>
          <Link to="/register">
            <Button size="lg" className="text-lg px-8 py-3">
              Start Investing Today
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Low Minimum</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Start investing with just $5. Maximum deposit of $30 to keep it accessible for everyone.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>2% Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Guaranteed 2% profit on all your investments. Watch your money grow steadily.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Secure Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Admin-approved withdrawals and secure transactions. Your investments are safe with us.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Clock className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Weekly Withdrawals</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Withdraw your profits every Saturday at 10 PM. Consistent and reliable payouts.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Investing?</h2>
          <p className="text-xl mb-6 text-blue-100">
            Join thousands of investors who trust InvestPro with their financial growth.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Create Your Account
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;
