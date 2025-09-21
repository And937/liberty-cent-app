"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { getUserBalance } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Mail, Copy, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const { user, loading: authLoading, idToken } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [balance, setBalance] = useState<number | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchAccountData() {
      if (user && idToken) {
        setIsBalanceLoading(true);
        setError(null);
        try {
          const result = await getUserBalance({ idToken });
          if (result.success) {
            setBalance(result.balance ?? 0);
            setReferralCode(result.referralCode ?? null);
          } else {
            setError(result.error ?? "Could not retrieve account data.");
            setBalance(0);
          }
        } catch (e) {
          setError("An unexpected error occurred while fetching account data.");
          setBalance(0);
        } finally {
          setIsBalanceLoading(false);
        }
      }
    }

    if (!authLoading && user) {
      fetchAccountData();
    }
  }, [user, authLoading, idToken]);

  const copyToClipboard = (text: string, subject: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${subject} Copied!`,
      description: `Copied ${text} to clipboard.`,
    });
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
            <h1 className="text-3xl font-bold mb-2">Personal Account</h1>
            <p className="text-muted-foreground">This is your personal account page. You can view your current balance here.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Mail className="h-5 w-5 text-muted-foreground"/>
                        <span>Account Email</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg font-medium text-foreground break-all">{user.email}</p>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Gift className="h-5 w-5 text-muted-foreground"/>
                        <span>Your Referral Code</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isBalanceLoading ? (
                        <Skeleton className="h-10 w-32" />
                    ) : referralCode ? (
                        <div className="flex items-center gap-2">
                            <p className="text-lg font-mono text-foreground bg-muted px-3 py-2 rounded-md">{referralCode}</p>
                            <Button variant="outline" size="icon" onClick={() => copyToClipboard(referralCode, 'Referral Code')}>
                                <Copy className="h-4 w-4"/>
                            </Button>
                        </div>
                    ) : (
                         <p className="text-sm text-muted-foreground">No referral code found.</p>
                    )}
                </CardContent>
            </Card>
        </div>


        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Your CENT Balance:</CardTitle>
          </CardHeader>
          <CardContent>
            {isBalanceLoading ? (
              <Skeleton className="h-12 w-48" />
            ) : error ? (
              <p className="text-destructive-foreground bg-destructive p-3 rounded-md">{error}</p>
            ) : (
              <p className="text-4xl font-bold text-primary">
                {(balance ?? 0).toLocaleString()} CENT
              </p>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}