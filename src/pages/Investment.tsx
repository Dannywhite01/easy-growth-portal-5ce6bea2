
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, TrendingUp, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Investment = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();

  const handleInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    const investmentAmount = parseFloat(amount);

    if (isNaN(investmentAmount) || investmentAmount < 5 || investmentAmount > 30) {
      toast({
        title: "Invalid amount",
        description: "Investment amount must be between $5 and $30.",
        variant: "destructive",
      });
      return;
    }

    if (investmentAmount > (profile?.balance || 0)) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance for this investment. Please deposit funds first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const profit = investmentAmount * 0.02; // 2% profit
      
      // Start a transaction
      const { error: investmentError } = await supabase
        .from('investments')
        .insert({
          user_id: profile?.id,
          amount: investmentAmount,
          profit: profit,
          status: 'active'
        });

      if (investmentError) throw investmentError;

      // Record investment transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: profile?.id,
          type: 'investment',
          amount: investmentAmount,
          status: 'approved'
        });

      if (transactionError) throw transactionError;

      // Record profit transaction
      const { error: profitError } = await supabase
        .from('transactions')
        .insert({
          user_id: profile?.id,
          type: 'profit',
          amount: profit,
          status: 'approved'
        });

      if (profitError) throw profitError;

      // Update user profile
      const newBalance = (profile?.balance || 0) - investmentAmount + profit;
      const newTotalInvested = (profile?.total_invested || 0) + investmentAmount;
      const newTotalProfit = (profile?.total_profit || 0) + profit;

      await updateProfile({
        balance: newBalance,
        total_invested: newTotalInvested,
        total_profit: newTotalProfit,
      });

      toast({
        title: "Investment successful!",
        description: `You invested $${investmentAmount.toFixed(2)} and earned $${profit.toFixed(2)} profit (2%).`,
      });

      setAmount('');
    } catch (error: any) {
      console.error('Investment error:', error);
      toast({
        title: "Investment failed",
        description: error.message || "An error occurred while processing your investment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateProfit = () => {
    const investmentAmount = parseFloat(amount);
    if (isNaN(investmentAmount)) return 0;
    return investmentAmount * 0.02;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Investment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Make Investment
          </CardTitle>
          <CardDescription>
            Invest between $5 - $30 and earn guaranteed 2% returns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Available Balance:</strong> ${profile?.balance?.toFixed(2) || '0.00'}
            </p>
          </div>

          <form onSubmit={handleInvestment} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Investment Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                min="5"
                max="30"
                step="0.01"
                placeholder="Enter amount (5-30)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <p className="text-sm text-gray-600">
                Minimum: $5.00 | Maximum: $30.00
              </p>
            </div>

            {amount && parseFloat(amount) >= 5 && parseFloat(amount) <= 30 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                  <span className="font-medium text-green-800">Profit Calculation</span>
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  <p>Investment: ${parseFloat(amount).toFixed(2)}</p>
                  <p>Profit (2%): ${calculateProfit().toFixed(2)}</p>
                  <p className="font-medium">Total Return: ${(parseFloat(amount) + calculateProfit()).toFixed(2)}</p>
                  <p className="text-xs">Net gain: ${calculateProfit().toFixed(2)}</p>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing Investment...' : 'Invest Now'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Investment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="mr-2 h-5 w-5" />
            Investment Terms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Minimum Investment</span>
              <span className="text-green-600 font-bold">$5.00</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Maximum Investment</span>
              <span className="text-blue-600 font-bold">$30.00</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Guaranteed Return</span>
              <span className="text-purple-600 font-bold">2% Profit</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Withdrawal Window</span>
              <span className="text-orange-600 font-bold">Saturday 10 PM</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400">
            <h4 className="font-medium text-blue-800 mb-2">Important Notes:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Returns are calculated immediately upon investment</li>
              <li>• Profits are added to your balance automatically</li>
              <li>• You need sufficient balance to make investments</li>
              <li>• Withdrawals are only available on Saturdays at 10 PM</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Investment;
