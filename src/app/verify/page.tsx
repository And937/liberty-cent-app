
import { VerifyForm } from "@/components/verify-form";
import { useLanguage } from "@/context/language-context";


export default function VerifyPage() {

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Account Verification</h1>
            <p className="text-muted-foreground">Secure your account and unlock all features by verifying your identity.</p>
        </div>
        <VerifyForm />
      </div>
    </div>
  );
}
