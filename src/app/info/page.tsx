import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Gift, TrendingUp, CalendarCheck } from "lucide-react";

export default function InfoPage() {
    const dailyBonuses = [
        { day: 1, reward: "10 CENT" },
        { day: 2, reward: "20 CENT" },
        { day: 3, reward: "30 CENT" },
        { day: 4, reward: "40 CENT" },
        { day: 5, reward: "50 CENT" },
        { day: 6, reward: "60 CENT" },
        { day: 7, reward: "100 CENT (и далее)" },
    ];

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-primary">Информация</h1>
                    <p className="mt-2 text-lg text-muted-foreground">Всё о бонусах и вознаграждениях в LibertyCent</p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <Zap className="text-primary"/>
                            Стейкинг CENT — Пассивный доход
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                        <p>Стейкинг — это процесс получения вознаграждений за то, что вы просто держите токены CENT на своем балансе. Это наш способ поблагодарить вас за поддержку и долгосрочную веру в проект.</p>
                        <p className="font-semibold text-foreground">Как это работает?</p>
                        <ul className="space-y-3 list-disc pl-5">
                            <li><span className="font-medium">Автоматическое начисление:</span> Каждую неделю система автоматически начисляет вам **10%** от вашего текущего баланса.</li>
                            <li><span className="font-medium">Сложный процент:</span> Новые токены добавляются к основному балансу, и на следующей неделе вознаграждение будет рассчитываться уже от новой, увеличенной суммы.</li>
                            <li><span className="font-medium">Без блокировок:</span> Ваши токены всегда остаются на вашем кошельке, они не замораживаются и доступны в любой момент.</li>
                        </ul>
                         <p>Вам не нужно ничего делать — просто держите CENT и наблюдайте, как растет ваш капитал.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <Gift className="text-primary"/>
                            Ежедневный Бонус за Вход
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">Мы ценим каждого активного участника. Заходите в свой аккаунт каждый день, чтобы получать бесплатные токены CENT и увеличивать свою награду!</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                           {dailyBonuses.map(bonus => (
                               <div key={bonus.day} className="p-3 bg-muted rounded-lg">
                                   <p className="text-sm text-muted-foreground">День {bonus.day}</p>
                                   <p className="font-bold text-primary">{bonus.reward}</p>
                               </div>
                           ))}
                        </div>

                        <p className="text-sm text-muted-foreground pt-2">
                           <span className="font-semibold">Что, если я пропущу день?</span> Если вы не получили бонус в течение 24 часов, ваша серия входов прерывается и начинается заново с первого дня.
                        </p>
                         <p className="text-sm text-muted-foreground">
                           <span className="font-semibold">Как получить бонус?</span> На главной странице вы увидите карточку "Ежедневный бонус". Просто нажмите на кнопку, и токены моментально зачислятся на ваш баланс.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}