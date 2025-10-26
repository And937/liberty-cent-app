
"use client";

import { VerifyForm } from "@/components/verify-form";
import { useLanguage } from "@/context/language-context";


export default function VerifyPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">{t('verification_page_title')}</h1>
            <p className="text-muted-foreground">{t('verification_page_description')}</p>
        </div>
        <VerifyForm />
      </div>
    </div>
  );
}
