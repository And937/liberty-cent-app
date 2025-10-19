
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { getDailyBonusStatus, claimDailyBonus } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Gift, CalendarCheck, Timer } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import Link from 'next/link';
import { useLanguage } from "@/context/language-context";

function Countdown({ nextClaimTime, onFinish }: { nextClaimTime: number, onFinish: () => void }) {  
  const calculateTimeLeft = useCallback(() => {
    const difference = nextClaimTime - new Date().getTime();
    let timeLeft = {
      hours: "00",
      minutes: "00",
      seconds: "00",
      isFinished: difference <= 0,
    };

    if (difference > 0) {
      timeLeft = {
        ...timeLeft,
        hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
        minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0'),
        seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, '0'),
      };
    }
    return timeLeft;
  }, [nextClaimTime]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (timeLeft.isFinished) {
      onFinish();
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="flex items-center gap-2 text-lg font-mono tracking-widest">
      <span>{timeLeft.hours}</span>:<span>{timeLeft.minutes}</span>:<span>{timeLeft.seconds}</span>
    </div>
  );
}

export function DailyBonusCard() {
  const { user, loading: authLoading, idToken } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [status, setStatus] = useState<{
    canClaim?: boolean;
    streak?: number;
    bonusAmount?: number;
    nextClaimTime?: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (user && idToken) {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getDailyBonusStatus({ idToken });
        if (result.success) {
          setStatus(result);
        } else {
          setError(result.error ?? "Could not retrieve daily bonus status.");
        }
      } catch (e) {
        setError("An unexpected error occurred while fetching bonus status.");
      } finally {
        setIsLoading(false);
      }
    } else {
        setIsLoading(false);
    }
  }, [user, idToken]);

  useEffect(() => {
    if (!authLoading) {
      fetchStatus();
    }
  }, [user, authLoading, fetchStatus]);
  
  const handleClaim = async () => {
    if (!user || !idToken) return;

    setIsClaiming(true);
    try {
        const result = await claimDailyBonus({ idToken });
        if (result.success && result.newStreak !== undefined) {
            toast({
                title: "Bonus Claimed!",
                description: `You've received ${result.claimedAmount} CENT. Your new streak is ${result.newStreak} days!`
            });
            // Immediately update the state on the client side
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            setStatus({
              canClaim: false,
              streak: result.newStreak,
              bonusAmount: getBonusAmount(result.newStreak),
              nextClaimTime: tomorrow.getTime(),
            });
        } else {
            throw new Error(result.error || "Failed to claim bonus.");
        }
    } catch(e: any) {
        toast({
            variant: "destructive",
            title: "Error Claiming Bonus",
            description: e.message || "An unexpected error occurred."
        });
        // Re-fetch status on error to get the true state from the server
        fetchStatus();
    } finally {
        setIsClaiming(false);
    }
  }

  const getBonusAmount = (streak: number): number => {
    const s = streak ?? 0;
    if (s <= 0) return 10;
    if (s === 1) return 20;
    if (s === 2) return 30;
    if (s === 3) return 40;
    if (s === 4) return 50;
    if (s === 5) return 60;
    return 100;
  };

  const renderContent = () => {
    if (authLoading || (isLoading && !status)) {
      return (
        <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-10 w-full" />
        </div>
      );
    }
    
    if (!user) {
        return (
            <div className="text-center text-muted-foreground py-6">
                <p className="mb-4">Log in to claim your daily bonus and start a streak!</p>
                <Button asChild>
                    <Link href="/login">Login to Claim</Link>
                </Button>
            </div>
        )
    }

    if (error) {
        return <p className="text-destructive-foreground bg-destructive p-3 rounded-md">{error}</p>
    }

    if (status?.canClaim) {
        return (
            <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                    You have a login streak of <span className="font-bold text-primary">{status.streak ?? 0} days</span>.
                    Your bonus for today is ready!
                </p>
                <div className="flex justify-center items-baseline gap-2">
                    <span className="text-5xl font-bold text-primary">{status.bonusAmount ?? 10}</span>
                    <span className="text-xl font-semibold text-muted-foreground">CENT</span>
                </div>
                <Button size="lg" className="w-full sm:w-auto" onClick={handleClaim} disabled={isClaiming}>
                    {isClaiming ? <Loader2 className="animate-spin mr-2"/> : <Gift className="mr-2"/>}
                    {isClaiming ? 'Claiming...' : 'Claim Your Bonus'}
                </Button>
            </div>
        )
    }

    if (status && !status.canClaim && status.nextClaimTime) {
        return (
             <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                    You have a login streak of <span className="font-bold text-primary">{status.streak ?? 0} days</span>.
                    Come back tomorrow for your next bonus!
                </p>
                <div className="p-4 bg-muted rounded-lg inline-flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Timer className="h-4 w-4"/>
                        <span>Next claim in</span>
                    </div>
                    <Countdown nextClaimTime={status.nextClaimTime} onFinish={fetchStatus}/>
                </div>
             </div>
        )
    }

    return <p className="text-muted-foreground text-center">No bonus information available.</p>;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-2">
            <div className="p-3 bg-primary/10 rounded-full">
                <CalendarCheck className="h-8 w-8 text-primary" />
            </div>
        </div>
        <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            Daily Login Bonus
        </CardTitle>
        <CardDescription>
            Log in every day to increase your reward. Don't break the streak!
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}