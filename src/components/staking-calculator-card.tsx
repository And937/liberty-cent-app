"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Calculator, PiggyBank, CircleDollarSign, Calendar } from "lucide-react";

const WEEKLY_RATE = 0.10; // 10%

export function StakingCalculatorCard() {
  const [initialAmount, setInitialAmount] = useState(1000);
  const [weeks, setWeeks] = useState(52);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty input or a valid number
    if (value === "" || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0) ) {
         setInitialAmount(parseFloat(value) || 0);
    }
  };
  
  const handleSliderChange = (value: number[]) => {
      setWeeks(value[0]);
  }

  const { projectedBalance, totalProfit } = useMemo(() => {
    if (initialAmount <= 0 || weeks <= 0) {
      return { projectedBalance: initialAmount, totalProfit: 0 };
    }
    
    let balance = initialAmount;
    for (let i = 0; i < weeks; i++) {
        balance += balance * WEEKLY_RATE;
    }

    return {
      projectedBalance: balance,
      totalProfit: balance - initialAmount
    };
  }, [initialAmount, weeks]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-center items-center mb-2">
            <div className="p-3 bg-primary/10 rounded-full">
                <Calculator className="h-8 w-8 text-primary" />
            </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">Staking Profit Calculator</CardTitle>
        <CardDescription className="text-center">
            Estimate your potential earnings with compound interest.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6 items-end">
             <div className="space-y-2">
                <label htmlFor="initial-amount" className="text-sm font-medium flex items-center gap-2">
                    <PiggyBank className="h-4 w-4 text-muted-foreground"/>
                    Initial Amount (CENT)
                </label>
                <Input
                  id="initial-amount"
                  type="number"
                  placeholder="e.g., 1000"
                  value={initialAmount || ""}
                  onChange={handleAmountChange}
                  className="text-lg"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="weeks" className="text-sm font-medium flex items-center gap-2">
                     <Calendar className="h-4 w-4 text-muted-foreground"/>
                    Time Period ({weeks} {weeks === 1 ? 'week' : 'weeks'})
                </label>
                <Slider
                    id="weeks"
                    min={1}
                    max={156} // 3 years
                    step={1}
                    value={[weeks]}
                    onValueChange={handleSliderChange}
                />
            </div>
        </div>
        
        <div className="p-6 bg-muted rounded-xl space-y-4">
            <h3 className="font-semibold text-center text-foreground">Projected Results</h3>
            <div className="flex justify-around text-center">
                <div>
                    <p className="text-sm text-muted-foreground">Total Profit</p>
                    <p className="text-2xl font-bold text-green-500">
                        +{totalProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })} CENT
                    </p>
                </div>
                 <div>
                    <p className="text-sm text-muted-foreground">New Balance</p>
                    <p className="text-2xl font-bold text-primary">
                        {projectedBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })} CENT
                    </p>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}