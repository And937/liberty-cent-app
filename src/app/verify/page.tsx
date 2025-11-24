
"use client";

import { VerifyForm } from "@/components/verify-form";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function VerifyPage() {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

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
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">{t('verification_page_title')}</h1>
            <p className="text-muted-foreground">{t('verification_page_description')}</p>
        </div>
        
        {!user.emailVerified ? (
            <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>{t('verification_email_first_title')}</AlertTitle>
                <AlertDescription>
                    {t('verification_email_first_desc')}
                    <Button asChild variant="link" className="p-0 h-auto font-semibold">
                      <Link href="/account">{t('go_to_account')}</Link>
                    </Button>
                </AlertDescription>
            </Alert>
        ) : (
            <VerifyForm />
        )}
      </div>
    </div>
  );
}