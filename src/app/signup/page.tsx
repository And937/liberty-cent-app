
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
import { Loader2 } from "lucide-react";
import { createUser } from "@/app/actions";
import { useLanguage } from "@/context/language-context";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  
  useEffect(() => {
    if (searchParams) {
      const refCode = searchParams.get('ref');
      if (refCode) {
        setReferralCode(refCode);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/account');
    }
  }, [user, authLoading, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 1. Create user in Firebase Auth
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
      
      router.push('/account');
      
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

  if (authLoading || user) {
     return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
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