
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { getUserBalance } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Mail, Copy, Gift, Link as LinkIcon, ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { DailyBonusCard } from "@/components/daily-bonus-card";
import { useLanguage } from "@/context/language-context";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function AccountPage() {
  const { user, loading: authLoading, idToken } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [balance, setBalance] = useState<number | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !user.emailVerified)) {
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
            setVerificationStatus(result.verificationStatus ?? 'unverified');
          } else {
            setError(result.error ?? t('account_error_data'));
            toast({
              variant: "destructive",
              title: t('toast_error_title'),
              description: result.error,
            })
            setBalance(0);
          }
        } catch (e: any) {
          setError(t('account_error_unexpected'));
          setBalance(0);
        } finally {
          setIsBalanceLoading(false);
        }
      }
    };

    if (!authLoading && user && user.emailVerified) {
      fetchAccountData();
    }
  }, [user, authLoading, idToken, t, toast]);
  
  const copyToClipboard = (text: string, subject: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('account_toast_copied_title', { subject }),
      description: t('account_toast_copied_desc', { text }),
    });
  };

  if (authLoading || !user || !user.emailVerified) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const siteLink = "https://libertycent.com/";

  const VerificationStatusCard = () => {
    const getStatusProps = () => {
      switch (verificationStatus) {
        case 'verified':
          return {
            icon: <ShieldCheck className="h-8 w-8 text-green-500" />,
            title: t('verification_status_verified'),
            description: t('verification_status_verified_desc'),
            badge: <Badge variant="default" className="bg-green-500">{t('verified')}</Badge>,
            showButton: false
          };
        case 'pending':
          return {
            icon: <ShieldQuestion className="h-8 w-8 text-yellow-500" />,
            title: t('verification_status_pending'),
            description: t('verification_status_pending_desc'),
            badge: <Badge variant="secondary">{t('pending')}</Badge>,
            showButton: false
          };
        case 'rejected':
          return {
            icon: <ShieldAlert className="h-8 w-8 text-destructive" />,
            title: t('verification_status_rejected'),
            description: t('verification_status_rejected_desc'),
            badge: <Badge variant="destructive">{t('rejected')}</Badge>,
            showButton: true
          };
        default:
          return {
            icon: <ShieldAlert className="h-8 w-8 text-destructive" />,
            title: t('verification_status_unverified'),
            description: t('verification_status_unverified_desc'),
            badge: <Badge variant="destructive">{t('unverified')}</Badge>,
            showButton: true
          };
      }
    };
    const props = getStatusProps();
  
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{t('account_verification_title')}</CardTitle>
            {isBalanceLoading ? <Skeleton className="h-6 w-20"/> : props.badge}
          </div>
        </CardHeader>
        <CardContent>
          {isBalanceLoading ? <Skeleton className="h-10 w-full" /> : (
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4">
              <div className="p-3 bg-muted rounded-full">{props.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold">{props.title}</h3>
                <p className="text-sm text-muted-foreground">{props.description}</p>
              </div>
              {props.showButton && (
                <Button asChild className="mt-4 sm:mt-0">
                  <Link href="/verify">{t('go_to_verification')}</Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };


  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
            <h1 className="text-3xl font-bold mb-2">{t('account_title')}</h1>
            <p className="text-muted-foreground">{t('account_description')}</p>
        </div>
        
        <VerificationStatusCard />

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