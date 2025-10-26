
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  const { login, user, loading: authLoading, sendVerificationEmail } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (!authLoading && user?.emailVerified) {
      router.push('/account');
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowVerificationAlert(false);
    try {
      const userCredential = await login(email, password);
      // Let the useEffect handle the redirect for verified users
      if (!userCredential.user.emailVerified) {
        setShowVerificationAlert(true);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('login_toast_failed_title'),
        description: error.message || t('login_toast_failed_desc'),
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendVerification = async () => {
    setIsSendingVerification(true);
    try {
      await sendVerificationEmail();
      toast({
        title: t('verify_email_sent_title'),
        description: t('verify_email_sent_desc'),
      });
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: t('verify_email_error_title'),
        description: error.message || t('verify_email_error_desc'),
      });
    } finally {
      setIsSendingVerification(false);
    }
  };
  
  if (authLoading || user?.emailVerified) {
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
          <CardTitle className="text-2xl">{t('login_title')}</CardTitle>
          <CardDescription>{t('login_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {showVerificationAlert && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('verify_email_alert_title')}</AlertTitle>
              <AlertDescription>
                {t('verify_email_alert_desc')}
                <Button variant="link" className="p-0 h-auto ml-1 text-destructive-foreground" onClick={handleResendVerification} disabled={isSendingVerification}>
                  {isSendingVerification ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                  {t('verify_email_resend_button')}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{t('login_email_label')}</Label>
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
              <Label htmlFor="password">{t('login_password_label')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? t('login_button_loading') : t('login_button')}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            {t('login_signup_prompt')}{" "}
            <Link href="/signup" className="underline text-primary">
              {t('login_signup_link')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

    