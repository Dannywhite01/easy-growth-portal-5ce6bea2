
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, CreditCard, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

const Deposit = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);

    if (isNaN(depositAmount) || depositAmount < 5) {
      toast({
        title: "Invalid amount",
        description: "Minimum deposit amount is $5.00.",
        variant: "destructive",
      });
      return;
    }

    if (depositAmount > 10000) {
      toast({
        title: "Amount too large",
        description: "Maximum deposit amount is $10,000.00.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create deposit transaction
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          type: 'deposit',
          amount: depositAmount,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Deposit request submitted!",
        description: `Your deposit of $${depositAmount.toFixed(2)} is pending admin approval.`,
      });

      setAmount('');
    } catch (error: any) {
      toast({
        title: "Deposit failed",
        description: error.message || "An error occurred while processing your deposit.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Deposit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Make Deposit
          </CardTitle>
          <CardDescription>
            Add funds to your investment account (minimum $5.00)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDeposit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Deposit Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                min="5"
                max="10000"
                step="0.01"
                placeholder="Enter amount (minimum $5.00)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <p className="text-sm text-gray-600">
                Minimum: $5.00 | Maximum: $10,000.00
              </p>
            </div>

            {amount && parseFloat(amount) >= 5 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <DollarSign className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="font-medium text-blue-800">Deposit Summary</span>
                </div>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>Deposit Amount: ${parseFloat(amount).toFixed(2)}</p>
                  <p className="font-medium">Available for Investment: ${parseFloat(amount).toFixed(2)}</p>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing Deposit...' : 'Submit Deposit Request'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-orange-600" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
              <h4 className="font-medium text-orange-800 mb-2">Deposit Processing:</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• All deposits require admin approval</li>
                <li>• Processing time: 1-24 hours</li>
                <li>• You will receive a notification once approved</li>
                <li>• Approved funds will be added to your balance</li>
              </ul>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Minimum Deposit</p>
                <p className="text-2xl font-bold text-green-600">$5.00</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Maximum Deposit</p>
                <p className="text-2xl font-bold text-blue-600">$10,000</p>
              </div>
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

export default Deposit;
