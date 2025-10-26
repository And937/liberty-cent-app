
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
import { Loader2, AlertCircle, Mail } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


type VerificationStatus = 'unverified' | 'verified' | 'none';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('none');
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  const { login, user, loading: authLoading, sendVerificationEmail, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    // If auth is done loading and there IS a verified user, redirect them away from login.
    if (!authLoading && user && user.emailVerified) {
      router.push('/account');
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setVerificationStatus('none');
    try {
      const userCredential = await login(email, password);
      if (!userCredential.user.emailVerified) {
        setVerificationStatus('unverified');
        // We don't want to keep the unverified user logged in on this page
        await logout(); 
      } else {
        setVerificationStatus('verified');
        // Let the useEffect handle the redirect
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
    if (!email) {
       toast({
        variant: "destructive",
        title: "Email is required",
        description: "Please enter your email address to resend the verification link.",
      });
      return;
    }
    setIsSendingVerification(true);
    try {
      // We can't use the user object from context as we've logged them out
      // Firebase's sendPasswordResetEmail can be (ab)used to check for an email's existence
      // and sendEmailVerification requires a User object.
      // A better way would be a custom backend function, but for now we'll just log them in temporarily.
      const userCredential = await login(email, password);
      await sendVerificationEmail(userCredential.user);
      await logout();
      toast({
        title: "Verification Email Sent",
        description: "A new verification link has been sent to your email address.",
      });
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Error Sending Email",
        description: error.message || "Could not send verification email. Please check the email and password.",
      });
    } finally {
      setIsSendingVerification(false);
    }
  };
  
  // Show a loader while auth state is being determined or if the user exists and is being redirected.
  if (authLoading || (user && user.emailVerified)) {
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
          {verificationStatus === 'unverified' && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Email Not Verified</AlertTitle>
              <AlertDescription>
                You must verify your email address before you can log in. Check your inbox for a verification link.
                <Button variant="link" className="p-0 h-auto ml-1 text-destructive-foreground" onClick={handleResendVerification} disabled={isSendingVerification}>
                  {isSendingVerification ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                  Resend link
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
