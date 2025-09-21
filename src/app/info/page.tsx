
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Gift, TrendingUp, Users, Rocket, Target, Bell } from "lucide-react";

export default function InfoPage() {
    const dailyBonuses = [
        { day: 1, reward: "10 CENT" },
        { day: 2, reward: "20 CENT" },
        { day: 3, reward: "30 CENT" },
        { day: 4, reward: "40 CENT" },
        { day: 5, reward: "50 CENT" },
        { day: 6, reward: "60 CENT" },
        { day: "7+", reward: "100 CENT" },
    ];

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-10">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-primary">About LibertyCent</h1>
                    <p className="mt-2 text-lg text-muted-foreground">Your Path to Financial Freedom Starts Here</p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <Rocket className="text-primary"/>
                            Our Vision — Strength in Unity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                        <p>LibertyCent is more than just a token. It's a movement towards creating a decentralized financial ecosystem accessible to everyone. We believe the future of finance is in transparent, fast, and fair technology.</p>
                        <p className="font-semibold text-foreground">Why should you accumulate CENT today?</p>
                         <ul className="space-y-3 list-disc pl-5">
                            <li><span className="font-medium">Exchange Listing Plans:</span> Our team is actively working to get the CENT token listed on leading cryptocurrency exchanges. The earlier you start accumulating, the more advantageous your position may be in the future.</li>
                            <li><span className="font-medium">Platform Development:</span> All funds raised are directed towards developing new features, marketing, and ensuring network stability. Your contribution directly impacts the success and growth of the entire project.</li>
                            <li><span className="font-medium">Limited Supply:</span> The total number of tokens is limited, which creates the potential for their value to increase as demand grows.</li>
                        </ul>
                         <p className="font-semibold text-foreground pt-2">Holding CENT means believing in a future where everyone has control over their finances. We are building it together.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <TrendingUp className="text-primary"/>
                             CENT Staking — Your Passive Income
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                         <p>We want your assets to work for you. The staking program is our way of rewarding you for your trust and long-term support. Everything happens automatically, with no lock-ups or complicated actions required.</p>
                         <p className="font-semibold text-foreground">How it works:</p>
                        <ul className="space-y-3 list-disc pl-5">
                            <li><span className="font-medium">Weekly Income:</span> Every Sunday, the system automatically credits you with **10%** of your current balance.</li>
                            <li><span className="font-medium">The Power of Compounding:</span> Bonuses are added to your main balance, and the following week's reward will be even larger. This is the power of compound interest.</li>
                             <li><span className="font-medium">Total Freedom:</span> Your tokens are never frozen and are always available to you.</li>
                        </ul>
                         <p>Simply hold CENT in your balance and watch your capital grow every week.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <Gift className="text-primary"/>
                            Bonuses for Your Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Zap className="h-5 w-5"/> Daily Login Bonus</h3>
                            <p className="text-muted-foreground mb-4">Log into your account every day to receive free tokens. The longer your login streak, the bigger the reward!</p>
                            <div className="grid grid-cols-4 md:grid-cols-7 gap-4 text-center">
                               {dailyBonuses.map(bonus => (
                                   <div key={bonus.day} className="p-3 bg-muted rounded-lg">
                                       <p className="text-sm text-muted-foreground">Day {bonus.day}</p>
                                       <p className="font-bold text-primary">{bonus.reward}</p>
                                   </div>
                               ))}
                            </div>
                        </div>
                        <div>
                             <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Users className="h-5 w-5"/> Invite Friends — Earn More</h3>
                             <p className="text-muted-foreground">You have a unique referral code in your personal account. Share it with friends and earn rewards together!</p>
                             <ul className="mt-3 space-y-2 list-disc pl-5">
                                 <li><span className="font-medium">Your friend</span> will receive a welcome bonus of **10 CENT** upon registration.</li>
                                 <li><span className="font-medium">You</span> will instantly receive **300 CENT** in your balance for each invited user.</li>
                             </ul>
                             <p className="mt-3 text-sm text-muted-foreground">This is the fastest way to significantly increase your balance and help our community grow!</p>
                        </div>
                    </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <Bell className="text-primary"/>
                            What's Next? From Accumulation to Utility
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                         <p>We understand the main question on your mind is: "When and how can I use my accumulated CENT?" We are committed to keeping you informed.</p>
                         <p className="font-semibold text-foreground">How you will get news:</p>
                        <p>All key information about the project's development, including announcements about exchange listings and new product launches, will be published **directly on this website**.</p>
                        <p>Additionally, for the most critical updates, we will use **email notifications** sent to the address you provided during registration. This ensures you won't miss any significant events.</p>
                        <p className="pt-2 font-medium">Your patience and support today are the keys to the entire community's success tomorrow. Every CENT accumulated brings us closer to our shared goal.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}