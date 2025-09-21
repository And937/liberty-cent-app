
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Gift, TrendingUp, Users, Rocket, Target } from "lucide-react";

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
            <div className="max-w-4xl mx-auto space-y-10">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-primary">Информация о LibertyCent</h1>
                    <p className="mt-2 text-lg text-muted-foreground">Ваш путь к финансовой свободе начинается здесь</p>
                </div>

                <Card className="shadow-lg border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <Rocket className="text-primary"/>
                            Наше видение — Сила в Единстве
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                        <p>LibertyCent — это не просто токен. Это движение к созданию децентрализованной финансовой экосистемы, доступной каждому. Мы верим, что будущее финансов — за прозрачными, быстрыми и справедливыми технологиями.</p>
                        <p className="font-semibold text-foreground">Почему стоит накапливать CENT уже сегодня?</p>
                         <ul className="space-y-3 list-disc pl-5">
                            <li><span className="font-medium">Планы на листинг:</span> Наша команда активно работает над тем, чтобы токен CENT был размещен на ведущих криптовалютных биржах. Чем раньше вы начнете накапливать, тем выгоднее может оказаться ваша позиция в будущем.</li>
                            <li><span className="font-medium">Развитие платформы:</span> Все собранные средства направляются на разработку новых функций, маркетинг и обеспечение стабильности сети. Ваш вклад напрямую влияет на успех и рост всего проекта.</li>
                            <li><span className="font-medium">Ограниченная эмиссия:</span> Общее количество токенов ограничено, что создает потенциал для роста их стоимости по мере увеличения спроса.</li>
                        </ul>
                         <p className="font-semibold text-foreground pt-2">Держать CENT — значит верить в будущее, где у каждого есть контроль над своими финансами. Мы строим его вместе.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <TrendingUp className="text-primary"/>
                             Стейкинг CENT — Ваш пассивный доход
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                         <p>Мы хотим, чтобы ваши активы работали на вас. Программа стейкинга — это наш способ вознаградить вас за доверие и долгосрочную поддержку. Всё происходит полностью автоматически, без блокировок и сложных действий.</p>
                         <p className="font-semibold text-foreground">Как это работает?</p>
                        <ul className="space-y-3 list-disc pl-5">
                            <li><span className="font-medium">Еженедельный доход:</span> Каждое воскресенье система начисляет вам **10%** от вашего текущего баланса.</li>
                            <li><span className="font-medium">Сила сложного процента:</span> Бонусы прибавляются к основному балансу, и уже на следующей неделе ваше вознаграждение будет еще больше.</li>
                             <li><span className="font-medium">Полная свобода:</span> Ваши токены не замораживаются и всегда доступны.</li>
                        </ul>
                         <p>Просто держите CENT на балансе и наблюдайте, как ваш капитал растет каждую неделю.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <Gift className="text-primary"/>
                            Бонусы за Активность
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Zap className="h-5 w-5"/> Ежедневный бонус за вход</h3>
                            <p className="text-muted-foreground mb-4">Заходите в свой аккаунт каждый день, чтобы получать бесплатные токены. Чем дольше ваша серия входов, тем выше награда!</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                               {dailyBonuses.map(bonus => (
                                   <div key={bonus.day} className="p-3 bg-muted rounded-lg">
                                       <p className="text-sm text-muted-foreground">День {bonus.day}</p>
                                       <p className="font-bold text-primary">{bonus.reward}</p>
                                   </div>
                               ))}
                            </div>
                        </div>
                        <div>
                             <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Users className="h-5 w-5"/> Приглашайте друзей — получайте больше</h3>
                             <p className="text-muted-foreground">В вашем личном кабинете есть уникальный реферальный код. Поделитесь им с друзьями и получайте вознаграждения вместе!</p>
                             <ul className="mt-3 space-y-2 list-disc pl-5">
                                 <li><span className="font-medium">Ваш друг</span> получит приветственный бонус **10 CENT** при регистрации.</li>
                                 <li><span className="font-medium">Вы</span> моментально получите **300 CENT** на свой баланс за каждого приглашенного пользователя.</li>
                             </ul>
                             <p className="mt-3 text-sm text-muted-foreground">Это самый быстрый способ значительно увеличить ваш баланс и помочь нашему сообществу расти!</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}