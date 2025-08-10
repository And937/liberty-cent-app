import { InfoCard } from "@/components/info-card";
import { TradeCard } from "@/components/trade-card";

export default function Home() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
          <TradeCard />
          <InfoCard />
      </div>
    </div>
  );
}
