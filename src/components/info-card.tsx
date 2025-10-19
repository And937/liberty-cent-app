
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, TrendingUp, Gift, CalendarCheck, UserPlus, Bell, HeartHandshake } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export function InfoCard() {
  const { t } = useLanguage();

  const dailyBonuses = [
    { day: 1, amount: 10 },
    { day: 2, amount: 20 },
    { day: 3, amount: 30 },
    { day: 4, amount: 40 },
    { day: 5, amount: 50 },
    { day: 6, amount: 60 },
    { day: "7+", amount: 100 },
  ];


  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-primary">About LibertyCent</h1>
            <p className="text-muted-foreground mt-2 text-lg">Your Path to Financial Freedom Starts Here</p>
        </div>
        <Card className="shadow-lg">
            <CardHeader>
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-2xl font-bold">{t('info_vision_title')}</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">{t('info_vision_p1')}</p>
                
                <h3 className="font-semibold text-lg text-foreground">{t('info_vision_subtitle')}</h3>
                
                <ul className="space-y-2 list-disc list-outside pl-5 text-muted-foreground">
                    <li><span className="font-semibold text-foreground">{t('info_vision_item1_title')}</span>: {t('info_vision_item1_desc')}</li>
                    <li><span className="font-semibold text-foreground">{t('info_vision_item2_title')}</span>: {t('info_vision_item2_desc')}</li>
                    <li><span className="font-semibold text-foreground">{t('info_vision_item3_title')}</span>: {t('info_vision_item3_desc')}</li>
                </ul>

                <p className="font-medium text-foreground pt-2">{t('info_vision_p2')}</p>
            </CardContent>
        </Card>

        <Card className="shadow-lg">
             <CardHeader>
                <div className="flex items-start gap-4">
                     <div className="p-2 bg-primary/10 rounded-full">
                        <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-2xl font-bold">{t('info_purchase_title')}</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <ol className="space-y-3 list-decimal list-outside pl-5 text-muted-foreground">
                    <li><span className="font-medium text-foreground">{t('info_purchase_step1_title')}</span>: {t('info_purchase_step1_desc')}</li>
                    <li><span className="font-medium text-foreground">{t('info_purchase_step2_title')}</span>: {t('info_purchase_step2_desc')}</li>
                    <li><span className="font-medium text-foreground">{t('info_purchase_step3_title')}</span>: {t('info_purchase_step3_desc')}</li>
                    <li><span className="font-medium text-foreground">{t('info_purchase_step4_title')}</span>: {t('info_purchase_step4_desc')}</li>
                </ol>
                 <p className="text-xs text-muted-foreground text-center pt-4">{t('info_purchase_note')}</p>
            </CardContent>
        </Card>

        <Card className="shadow-lg">
            <CardHeader>
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-2xl font-bold">{t('info_staking_title')}</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">{t('info_staking_p1')}</p>
                
                <h3 className="font-semibold text-lg text-foreground">{t('info_staking_subtitle')}</h3>
                
                <ul className="space-y-2 list-disc list-outside pl-5 text-muted-foreground">
                    <li><span className="font-semibold text-foreground">{t('info_staking_item1_title')}</span>: {t('info_staking_item1_desc')}</li>
                    <li><span className="font-semibold text-foreground">{t('info_staking_item2_title')}</span>: {t('info_staking_item2_desc')}</li>
                    <li><span className="font-semibold text-foreground">{t('info_staking_item3_title')}</span>: {t('info_staking_item3_desc')}</li>
                </ul>

                <p className="font-medium text-foreground pt-2">{t('info_staking_p2')}</p>
            </CardContent>
        </Card>

        <Card className="shadow-lg">
             <CardHeader>
                <div className="flex items-start gap-4">
                     <div className="p-2 bg-primary/10 rounded-full">
                        <Gift className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-2xl font-bold">{t('info_bonuses_title')}</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <CalendarCheck className="h-5 w-5 text-primary"/>
                        <h3 className="font-semibold text-lg text-foreground">{t('info_bonuses_daily_title')}</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">{t('info_bonuses_daily_desc')}</p>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center">
                        {dailyBonuses.map(bonus => (
                            <div key={bonus.day} className="p-2 rounded-md bg-muted">
                                <p className="text-xs text-muted-foreground">{t('day')} {bonus.day}</p>
                                <p className="font-bold text-sm text-primary">{bonus.amount} CENT</p>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div>
                     <div className="flex items-center gap-3 mb-2">
                        <UserPlus className="h-5 w-5 text-primary"/>
                        <h3 className="font-semibold text-lg text-foreground">{t('info_bonuses_invite_title')}</h3>
                    </div>
                    <p className="text-muted-foreground">{t('info_bonuses_invite_desc')}</p>
                    <ul className="mt-2 space-y-2 list-disc list-outside pl-5 text-muted-foreground">
                        <li>{t('info_bonuses_invite_item1')}</li>
                        <li>{t('info_bonuses_invite_item2')}</li>
                    </ul>
                     <p className="mt-4 font-medium text-foreground">{t('info_bonuses_invite_p2')}</p>
                </div>

            </CardContent>
        </Card>

        <Card className="shadow-lg">
            <CardHeader>
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <Bell className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-2xl font-bold">{t('info_whats_next_title')}</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <p>{t('info_whats_next_p1')}</p>
                <p><span className="font-semibold text-foreground">{t('info_whats_next_subtitle')}</span> {t('info_whats_next_p2_1')} <span className="font-bold text-foreground">{t('info_whats_next_p2_bold1')}</span>.</p>
                <p>{t('info_whats_next_p3_1')} <span className="font-bold text-foreground">{t('info_whats_next_p3_bold1')}</span> {t('info_whats_next_p3_2')}</p>
                <p>{t('info_whats_next_p4')}</p>
            </CardContent>
        </Card>
        
        <Card className="shadow-lg bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <HeartHandshake className="h-8 w-8 text-primary"/>
                        </div>
                    </div>
                    <p className="text-muted-foreground max-w-md mx-auto">{t('info_closing_p1')}</p>
                    <p className="font-bold text-lg text-foreground">{t('info_closing_p2')}</p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}