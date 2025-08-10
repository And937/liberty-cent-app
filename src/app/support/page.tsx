"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, LifeBuoy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SupportPage() {
    const { toast } = useToast();
    const supportEmail = "help.centswap@gmail.com";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(supportEmail);
        toast({
            title: "Email Copied!",
            description: `Copied ${supportEmail} to clipboard.`,
        });
    };

    return (
        <div className="container mx-auto p-4 md:p-8 flex justify-center">
            <div className="max-w-2xl w-full">
                 <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">Support</h1>
                    <p className="text-muted-foreground mt-2">Having issues? We're here to help.</p>
                </div>
                
                <Card className="shadow-lg">
                    <CardHeader className="text-center">
                        <div className="flex justify-center items-center mb-4">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <LifeBuoy className="h-10 w-10 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl">Contact Us</CardTitle>
                        <CardDescription>For any questions or issues with your transactions, please contact our support team. We will get back to you as soon as possible.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="text-lg font-semibold bg-muted p-3 rounded-md w-full text-center">
                            {supportEmail}
                        </div>
                        <Button onClick={copyToClipboard} className="w-full sm:w-auto">
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Email
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
