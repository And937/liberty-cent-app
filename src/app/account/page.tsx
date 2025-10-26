
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { getUserBalance } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Mail, Copy, Gift, Link as LinkIcon, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { DailyBonusCard } from "@/components/daily-bonus-card";
import { useLanguage } from "@/context/language-context";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AccountPage() {
  const { user, loading: authLoading, idToken, sendVerificationEmail } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [balance, setBalance] = useState<number | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchAccountData = async () => {
      if (user && user.emailVerified && idToken) {
        setIsBalanceLoading(true);
        setError(null);
        try {
          const result = await getUserBalance({ idToken });
          if (result.success) {
            setBalance(result.balance ?? 0);
            setReferralCode(result.referralCode ?? null);
          } else {
            setError(result.error ?? t('account_error_data'));
            setBalance(0);
          }
        } catch (e) {
          setError(t('account_error_unexpected'));
          setBalance(0);
        } finally {
          setIsBalanceLoading(false);
        }
      } else if (user && !user.emailVerified) {
        setIsBalanceLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchAccountData();
    }
  }, [user, authLoading, idToken, t]);
  
  const handleResendVerification = async () => {
    setIsSendingVerification(true);
    try {
      await sendVerificationEmail();
      toast({
        title: "Verification Email Sent",
        description: "A new verification link has been sent to your email address.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error Sending Email",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSendingVerification(false);
    }
  };

  const copyToClipboard = (text: string, subject: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('account_toast_copied_title', { subject }),
      description: t('account_toast_copied_desc', { text }),
    });
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user.emailVerified) {
    return (
       <div className="container mx-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center items-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                      <Mail className="h-10 w-10 text-primary" />
                  </div>
              </div>
              <CardTitle className="text-2xl">Verify Your Email</CardTitle>
              <CardDescription>
                Your account has been created, but you need to verify your email address to continue.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                A verification link has been sent to <strong className="text-foreground">{user.email}</strong>. Please check your inbox (and spam folder) to activate your account.
              </p>
              <Button onClick={handleResendVerification} disabled={isSendingVerification}>
                {isSendingVerification ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Resend Verification Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const siteLink = "https://libertycent.com/";


  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
            <h1 className="text-3xl font-bold mb-2">{t('account_title')}</h1>
            <p className="text-muted-foreground">{t('account_description')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
             <Card className="shadow-lg bg-card/50 backdrop-blur-lg border border-white/10 text-center">
                <CardHeader>
                    <div className="flex justify-center items-center mb-2">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <Mail className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-xl">
                        {t('account_email')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-base font-medium text-foreground break-all">{user.email}</p>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Gift className="h-5 w-5 text-muted-foreground"/>
                        <span>{t('account_referral_title')}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isBalanceLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                    ) : referralCode ? (
                        <div className="space-y-4">
                             <div>
                                <label className="text-sm text-muted-foreground">{t('account_referral_code_label')}</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-sm font-medium p-2 rounded-md bg-muted flex-grow break-all">{referralCode}</p>
                                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(referralCode, t('account_referral_code_subject'))}>
                                        <Copy className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">{t('account_site_link_label')}</label>
                                 <div className="flex items-center gap-2 mt-1">
                                    <p className="text-sm font-medium text-blue-500 p-2 rounded-md bg-muted flex-grow break-all">{siteLink}</p>
                                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(siteLink, t('account_site_link_subject'))}>
                                        <LinkIcon className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                         <p className="text-sm text-muted-foreground">{t('account_referral_not_found')}</p>
                    )}
                </CardContent>
            </Card>
        </div>


        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t('account_balance_title')}</CardTitle>
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
        
        <DailyBonusCard />

      </div>
    </div>
  );
}