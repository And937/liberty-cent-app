
"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail } from "lucide-react";
import { createUser } from "@/app/actions";
import { useLanguage } from "@/context/language-context";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  
  const { signup, user, loading: authLoading, sendVerificationEmail } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (searchParams) {
      const refCode = searchParams.get('ref');
      if (refCode) {
        setReferralCode(refCode);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && user?.emailVerified) {
      router.push('/account');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResendVerification = async () => {
    if (isResending || cooldown > 0) return;

    setIsResending(true);
    try {
        await sendVerificationEmail();
        toast({
            title: t('verify_email_sent_title'),
            description: t('verify_email_sent_desc'),
        });
        setCooldown(60); // Start 60-second cooldown
    } catch (error: any) {
        let errorMessage = error.message;
        if (error.code === 'auth/too-many-requests') {
            errorMessage = "Вы отправили слишком много запросов. Попробуйте позже.";
        }
        toast({
            variant: "destructive",
            title: t('verify_email_error_title'),
            description: errorMessage,
        });
    } finally {
        setIsResending(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 1. Create user in Firebase Auth & send email
      const userCredential = await signup(email, password);
      
      // 2. Create user document in Firestore via Server Action
      const createDbUserResult = await createUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        referralCode: referralCode || null,
      });

      if (!createDbUserResult.success) {
        throw new Error(createDbUserResult.error || t('signup_toast_partial_desc'));
      }
      
      setSignupSuccess(true);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('signup_toast_failed_title'),
        description: error.message || t('signup_toast_failed_desc'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
     return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (signupSuccess || (user && !user.emailVerified)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent -mt-16">
        <Card className="w-full max-w-md shadow-2xl text-center bg-card/50 backdrop-blur-lg border border-white/10">
           <CardHeader>
              <div className="flex justify-center items-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                      <Mail className="h-10 w-10 text-primary" />
                  </div>
              </div>
            <CardTitle className="text-2xl">{t('signup_success_title')}</CardTitle>
            <CardDescription className="px-4" dangerouslySetInnerHTML={{ __html: t('signup_success_message', { email }) }}/>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4">
                <Button onClick={handleResendVerification} disabled={isResending || cooldown > 0} variant="secondary" className="w-full">
                    {isResending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isResending ? t('bonus_button_claiming') : (cooldown > 0 ? `Повторить через ${cooldown} с.` : t('verify_email_resend_button'))}
                </Button>
                <Button onClick={() => router.push('/login')} variant="default" className="w-full">
                    {t('signup_success_button')}
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent -mt-16">
      <Card className="w-full max-w-md shadow-2xl bg-card/50 backdrop-blur-lg border border-white/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('signup_title')}</CardTitle>
          <CardDescription>{t('signup_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{t('signup_email_label')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('signup_password_label')}</Label>              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="referral">{t('signup_referral_label')}</Label>
              <Input
                id="referral"
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder={t('signup_referral_placeholder')}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? t('signup_button_loading') : t('signup_button')}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            {t('signup_login_prompt')}{" "}
            <Link href="/login" className="underline text-primary">
              {t('signup_login_link')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
      <SignupForm />
    </Suspense>
  );
}