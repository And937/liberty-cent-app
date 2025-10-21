
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { getUserBalance } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Zap, TrendingUp, Wallet, Coins } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

const WEEKLY_RATE = 0.06; // 6%
const APR = ((1 + WEEKLY_RATE) ** 52 - 1); // Compound annual rate

export function StakingCard() {
  const { user, loading: authLoading, idToken } = useAuth();
  const { t } = useLanguage();

  const [balance, setBalance] = useState<number | null>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBalance() {
      if (user && idToken) {
        setIsBalanceLoading(true);
        setError(null);
        try {
          const result = await getUserBalance({ idToken });
          if (result.success) {
            setBalance(result.balance ?? 0);
          } else {
            setError(result.error ?? "Could not retrieve balance.");
            setBalance(0);
          }
        } catch (e) {
          setError("An unexpected error occurred while fetching your balance.");
          setBalance(0);
        } finally {
          setIsBalanceLoading(false);
        }
      } else {
        setIsBalanceLoading(false);
      }
    }

    if (!authLoading) {
      fetchBalance();
    }
  }, [user, authLoading, idToken]);

  const weeklyReward = balance !== null ? balance * WEEKLY_RATE : 0;

  const renderContent = () => {
    if (authLoading) {
        return <div className="flex items-center justify-center h-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (!user) {
        return (
            <div className="text-center text-muted-foreground py-6">
                <p className="mb-4">{t('staking_card_login_prompt')}</p>
                <Button asChild>
                    <Link href="/login">{t('staking_card_login_button')}</Link>
                </Button>
            </div>
        )
    }

    if (isBalanceLoading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t('staking_card_balance')}</span>
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t('staking_card_reward')}</span>
                    <Skeleton className="h-6 w-28" />
                </div>
            </div>
        )
    }

    if (error) {
        return <p className="text-destructive-foreground bg-destructive p-3 rounded-md">{error}</p>
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Wallet className="h-5 w-5" />
                    <span>{t('staking_card_balance')}</span>
                </div>
                <span className="font-bold text-lg text-foreground">{(balance ?? 0).toLocaleString()} CENT</span>
            </div>
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Coins className="h-5 w-5" />
                    <span>{t('staking_card_reward')}</span>
                </div>
                <span className="font-bold text-lg text-green-500">+{weeklyReward.toLocaleString()} CENT</span>
            </div>
        </div>
    )
  }


  return (
    <Card className="shadow-lg bg-gradient-to-br from-card to-muted/30">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Zap className="text-primary"/>
                    {t('staking_card_title')}
                </CardTitle>
                <CardDescription>
                    {t('staking_card_description')}
                </CardDescription>
            </div>
             <div className="text-right flex-shrink-0 ml-4">
                <div className="flex items-center gap-2 justify-end">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <p className="text-sm text-muted-foreground">{t('staking_card_apr')}</p>
                </div>
                <p className="text-2xl font-bold text-primary">
                    {(APR * 100).toLocaleString('en-US', {maximumFractionDigits: 0})}%
                </p>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}