
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Calculator, PiggyBank, CircleDollarSign, Calendar, TrendingUp, Wallet } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const WEEKLY_RATE = 0.10; // 10%

export function StakingCalculatorCard() {
  const [initialAmount, setInitialAmount] = useState(1000);
  const [weeks, setWeeks] = useState(52);
  const { t } = useLanguage();

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
        <CardTitle className="text-2xl font-bold text-center">{t('staking_calculator_title')}</CardTitle>
        <CardDescription className="text-center">
            {t('staking_calculator_description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6 items-end">
             <div className="space-y-2">
                <label htmlFor="initial-amount" className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <PiggyBank className="h-4 w-4"/>
                    {t('staking_calculator_initial_amount')}
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
                <label htmlFor="weeks" className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                     <Calendar className="h-4 w-4"/>
                    {t('staking_calculator_period', { count: weeks })}
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
        
        <div className="p-6 bg-muted rounded-xl space-y-6">
            <h3 className="font-semibold text-center text-foreground">{t('staking_calculator_results')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        {t('staking_calculator_total_profit')}
                    </p>
                    <p className="text-2xl font-bold text-green-500 break-words">
                        +{totalProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })} CENT
                    </p>
                </div>
                 <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                        <Wallet className="h-4 w-4" />
                        {t('staking_calculator_new_balance')}
                    </p>
                    <p className="text-2xl font-bold text-primary break-words">
                        {projectedBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })} CENT
                    </p>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}