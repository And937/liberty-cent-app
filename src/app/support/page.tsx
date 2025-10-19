
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, LifeBuoy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";

export default function SupportPage() {
    const { toast } = useToast();
    const { t } = useLanguage();
    const supportEmail = "help.centswap@gmail.com";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(supportEmail);
        toast({
            title: t('support_toast_title'),
            description: `${t('support_toast_description')} ${supportEmail}`,
        });
    };

    return (
        <div className="container mx-auto p-4 md:p-8 flex justify-center">
            <div className="max-w-2xl w-full">
                 <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">{t('support_title')}</h1>
                    <p className="text-muted-foreground mt-2">{t('support_description')}</p>
                </div>
                
                <Card className="shadow-lg">
                    <CardHeader className="text-center">
                        <div className="flex justify-center items-center mb-4">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <LifeBuoy className="h-10 w-10 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl">{t('support_card_title')}</CardTitle>
                        <CardDescription>{t('support_card_description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="text-lg font-semibold bg-muted p-3 rounded-md w-full text-center">
                            {supportEmail}
                        </div>
                        <Button onClick={copyToClipboard} className="w-full sm:w-auto">
                            <Copy className="mr-2 h-4 w-4" />
                            {t('support_copy_button')}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}