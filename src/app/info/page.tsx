import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Gift, Rocket, ShieldCheck } from "lucide-react";

export default function InfoPage() {
    const benefits = [
        { key: 'benefit1', text: "Early Access: The opportunity to purchase tokens before they are available to the general public." },
        { key: 'benefit2', text: "Direct Support: Your funds directly contribute to the platform's development, marketing, and future listings." },
    ];

    const steps = [
        { key: 'step1', text: "Define the amount: Specify how many CENT you want to purchase." },
        { key: 'step2', text: "Choose the currency: Pay for the purchase using one of the popular cryptocurrencies." },
        { key: 'step3', text: "Make the transfer: Send the exact amount to the specified wallet address." },
        { key: 'step4', text: "Your tokens are safe: After the transfer is confirmed, the CENT tokens will be credited to your balance in your personal account. (Crediting can take from 5 minutes to 24 hours)" },
    ];

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-primary">Information</h1>
                    <p className="mt-2 text-lg text-muted-foreground">Exclusive pre-sale of the CENT token</p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <Rocket className="text-primary"/>
                            Welcome to LibertyCent!
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                        <p>You are on the page for the exclusive pre-listing sale of the CENT token. This is a unique opportunity to purchase our project's tokens before their official listing on cryptocurrency exchanges.</p>
                        <p>We have made the process as simple and transparent as possible. The entire procedure is based on direct cryptocurrency transfers, which ensures security and reliability.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <Gift className="text-primary"/>
                            Why a Pre-Listing?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">Pre-listing is an exclusive period when our CENT tokens are available for purchase directly from the team before they are publicly traded. By participating in the pre-sale, you get:</p>
                        <ul className="space-y-3">
                            {benefits.map(item => (
                                <li key={item.key} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <ShieldCheck className="text-primary"/>
                            How to Purchase
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ol className="space-y-4 list-decimal list-inside text-muted-foreground">
                            {steps.map(item => (
                                <li key={item.key}>{item.text}</li>
                            ))}
                        </ol>
                         <p className="text-xs text-center text-muted-foreground/80 mt-4">(Crediting can take from 5 minutes to 24 hours)</p>
                    </CardContent>
                </Card>

                <div className="text-center space-y-2 pt-4">
                    <h3 className="text-xl font-semibold">Our Vision</h3>
                    <p className="text-muted-foreground">We believe in a future where finance is open and accessible to everyone. LibertyCent aims to be a key part of this new era. Your participation today is an investment in this vision.</p>
                    <p className="text-lg font-bold text-primary pt-2">Join us. Become part of the LibertyCent story.</p>
                </div>
            </div>
        </div>
    );
}
