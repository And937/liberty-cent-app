
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { getUserBalance } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, ShieldAlert, ShieldQuestion, UploadCloud, File, X } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useLanguage } from "@/context/language-context";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export function VerifyForm() {
  const { user, loading: authLoading, idToken } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [docFront, setDocFront] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchStatus = async () => {
      if (user && idToken) {
        setIsLoading(true);
        try {
          const result = await getUserBalance({ idToken });
          if (result.success) {
            setStatus(result.verificationStatus ?? 'unverified');
          } else {
            toast({
              variant: "destructive",
              title: t('toast_error_title'),
              description: result.error,
            });
          }
        } catch (e: any) {
          toast({
            variant: "destructive",
            title: t('toast_error_title'),
            description: e.message,
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (!authLoading && user) {
      fetchStatus();
    }
  }, [user, idToken, authLoading, t, toast]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocFront(file);
    }
  };

  const handleSubmit = async () => {
    // This is a placeholder for the actual submission logic
    if (!docFront) {
      toast({
        variant: "destructive",
        title: t('verification_toast_no_front_title'),
        description: t('verification_toast_no_front_desc'),
      });
      return;
    }
    
    setIsSubmitting(true);
    // In a real app, you would upload files to Firebase Storage here
    // and then call a server action to create the verification request.
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For now, we just simulate a success and update the status locally.
    setStatus('pending');
    toast({
      title: t('verification_toast_success_title'),
      description: t('verification_toast_success_desc'),
    });
    
    setDocFront(null);
    setIsSubmitting(false);
  };


  const renderStatus = () => {
    if (isLoading) {
      return <Skeleton className="h-40 w-full" />;
    }

    switch (status) {
      case 'verified':
        return (
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center items-center mb-2">
                <ShieldCheck className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle>{t('verification_status_verified')}</CardTitle>
              <CardDescription>{t('verification_status_verified_desc_full')}</CardDescription>
            </CardHeader>
          </Card>
        );
      case 'pending':
        return (
          <Card className="text-center">
            <CardHeader>
               <div className="flex justify-center items-center mb-2">
                <ShieldQuestion className="h-12 w-12 text-yellow-500" />
              </div>
              <CardTitle>{t('verification_status_pending')}</CardTitle>
              <CardDescription>{t('verification_status_pending_desc_full')}</CardDescription>
            </CardHeader>
          </Card>
        );
      default: // 'unverified' or 'rejected'
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t('verification_form_title')}</CardTitle>
              <CardDescription>{t('verification_form_desc')}</CardDescription>
               {status === 'rejected' && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm mt-2">
                    {t('verification_status_rejected_desc_full')}
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                  <FileInput id="doc-front" label={t('verification_file_front')} file={docFront} setFile={setDocFront} onChange={handleFileChange} />
                </div>
              <Button size="lg" className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="animate-spin mr-2" />}
                {t('verification_button_submit')}
              </Button>
            </CardContent>
          </Card>
        );
    }
  };
  
    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

  return renderStatus();
}


const FileInput = ({ id, label, file, setFile, onChange }: { id: string, label: string, file: File | null, setFile: (file: File | null) => void, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      {file ? (
        <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
            <div className="flex items-center gap-3">
                <File className="h-5 w-5 text-muted-foreground"/>
                <span className="text-sm font-medium truncate">{file.name}</span>
            </div>
          <Button size="icon" variant="ghost" onClick={() => setFile(null)}><X className="h-4 w-4"/></Button>
        </div>
      ) : (
        <label htmlFor={id} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-muted-foreground">PNG, JPG or PDF (MAX. 5MB)</p>
          </div>
          <input id={id} type="file" className="hidden" onChange={onChange} accept="image/png, image/jpeg, application/pdf" />
        </label>
      )}
    </div>
  );
}
