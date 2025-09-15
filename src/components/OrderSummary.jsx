import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import {
      Dialog,
      DialogContent,
      DialogHeader,
      DialogTitle,
      DialogDescription,
      DialogFooter,
    } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Slider } from '@/components/ui/slider';
    import { useToast } from '@/components/ui/use-toast';
    import { Zap } from 'lucide-react';

    const OrderSummary = ({ sto, isOpen, onOpenChange }) => {
      const { toast } = useToast();
      const [amountUsd, setAmountUsd] = useState(sto?.min_investment || 50);
      const [isLoading, setIsLoading] = useState(false);

      useEffect(() => {
        if (isOpen && sto) {
          setAmountUsd(sto.min_investment || 50);
        }
      }, [isOpen, sto]);

      if (!sto || !sto.digital_assets) return null;

      const asset = sto.digital_assets;
      const processingFeeRate = 0.005; // 0.5%
      const tokensToReceive = amountUsd > 0 ? amountUsd / sto.token_price : 0;
      const processingFee = amountUsd * processingFeeRate;
      const totalCost = amountUsd + processingFee;

      const handleConfirm = () => {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          onOpenChange(false);
          toast({
            title: "✅ Trade Successful!",
            description: `You have successfully purchased ${tokensToReceive.toFixed(4)} tokens of ${asset.symbol}.`,
            duration: 5000,
          });
        }, 1500);
      };

      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[480px] glass-effect p-0">
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="text-2xl font-bold flex items-center">
                <Zap className="w-6 h-6 mr-2 gradient-text" />
                Invest in {asset.name} ({asset.symbol})
              </DialogTitle>
              <DialogDescription>
                Review your order to purchase fractional tokens of {asset.name}.
              </DialogDescription>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="px-6 pb-6"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-gray-100/50 p-4 rounded-lg">
                  <span className="font-medium text-gray-700">Token Price</span>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900">${sto.token_price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="amount" className="text-base font-medium">Investment Amount (USD)</Label>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold">$</span>
                    <Input
                      id="amount"
                      type="number"
                      value={amountUsd}
                      onChange={(e) => setAmountUsd(Number(e.target.value))}
                      className="text-2xl font-bold h-12"
                      min={sto.min_investment}
                      max={sto.max_investment}
                    />
                  </div>
                  <Slider
                    value={[amountUsd]}
                    onValueChange={(value) => setAmountUsd(value[0])}
                    min={sto.min_investment || 50}
                    max={sto.max_investment || 10000}
                    step={50}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>${sto.min_investment || 50}</span>
                    <span>${(sto.max_investment || 10000).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3 glass-effect rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Order Summary</h3>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Tokens to receive</span>
                    <span className="font-medium text-gray-900">{tokensToReceive.toFixed(6)} {asset.symbol}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Processing Fee (0.5%)</span>
                    <span className="font-medium text-gray-900">${processingFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total Cost</span>
                    <span>${totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
            <DialogFooter className="p-6 bg-gray-50/50 rounded-b-lg">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
              <Button onClick={handleConfirm} disabled={isLoading || amountUsd < sto.min_investment} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                {isLoading ? 'Processing...' : 'Confirm Purchase'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

    export default OrderSummary;