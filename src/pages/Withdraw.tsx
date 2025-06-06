
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Calendar, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

const Withdraw = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { profile } = useAuth();
  const { toast } = useToast();

  const isWithdrawalDay = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = now.getHours();
    
    // Saturday (6) around 10 PM (22:00)
    return day === 6 && hour >= 22;
  };

  const getNextWithdrawalTime = () => {
    const now = new Date();
    const nextSaturday = new Date();
    const daysUntilSaturday = (6 - now.getDay() + 7) % 7;
    
    if (daysUntilSaturday === 0 && now.getHours() < 22) {
      // Today is Saturday but before 10 PM
      nextSaturday.setHours(22, 0, 0, 0);
    } else {
      // Next Saturday
      nextSaturday.setDate(now.getDate() + (daysUntilSaturday || 7));
      nextSaturday.setHours(22, 0, 0, 0);
    }
    
    return nextSaturday.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      });
      return;
    }

    if (withdrawAmount > (profile?.balance || 0)) {
      toast({
        title: "Insufficient balance",
        description: `You can only withdraw up to $${profile?.balance?.toFixed(2) || '0.00'}.`,
        variant: "destructive",
      });
      return;
    }

    if (!isWithdrawalDay()) {
      toast({
        title: "Withdrawal not available",
        description: "Withdrawals are only available on Saturdays at 10 PM.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create withdrawal request
      const { error } = await supabase
        .from('withdrawal_requests')
        .insert({
          user_id: profile?.id,
          amount: withdrawAmount,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Withdrawal request submitted!",
        description: `Your withdrawal of $${withdrawAmount.toFixed(2)} is pending admin approval.`,
      });

      setAmount('');
    } catch (error: any) {
      toast({
        title: "Withdrawal failed",
        description: error.message || "An error occurred while processing your withdrawal.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Withdrawal Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Request Withdrawal
          </CardTitle>
          <CardDescription>
            Withdraw funds from your investment account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isWithdrawalDay() && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  <p className="font-medium text-yellow-800">Withdrawal Window Closed</p>
                  <p className="text-sm text-yellow-700">
                    Next withdrawal window: {getNextWithdrawalTime()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleWithdrawal} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Withdrawal Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                min="0.01"
                max={profile?.balance || 0}
                step="0.01"
                placeholder="Enter amount to withdraw"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                disabled={!isWithdrawalDay()}
              />
              <p className="text-sm text-gray-600">
                Available Balance: ${profile?.balance?.toFixed(2) || '0.00'}
              </p>
            </div>

            {amount && parseFloat(amount) > 0 && parseFloat(amount) <= (profile?.balance || 0) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                  <span className="font-medium text-green-800">Withdrawal Summary</span>
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  <p>Withdrawal Amount: ${parseFloat(amount).toFixed(2)}</p>
                  <p>Remaining Balance: ${((profile?.balance || 0) - parseFloat(amount)).toFixed(2)}</p>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !isWithdrawalDay()}
            >
              {loading ? 'Processing...' : 'Submit Withdrawal Request'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Withdrawal Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Withdrawal Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-blue-600" />
              <p className="font-medium text-blue-800 mb-1">Weekly Withdrawal Window</p>
              <p className="text-2xl font-bold text-blue-600">Saturday 10:00 PM</p>
              <p className="text-sm text-blue-700 mt-2">
                Next window: {getNextWithdrawalTime()}
              </p>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
              <h4 className="font-medium text-orange-800 mb-2">Important Notes:</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Withdrawals are only available on Saturdays at 10 PM</li>
                <li>• All withdrawal requests require admin approval</li>
                <li>• Processing time: 1-3 business days after approval</li>
                <li>• You cannot withdraw more than your available balance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-center">
        <Link to="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default Withdraw;
