"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const TOTAL_ISSUED = 1_000_000_000;
const AVAILABLE_FOR_SALE = 400_000_000;
const PURCHASED_AMOUNT = 231_000_000;

const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) {
        return `${(num / 1_000_000_000).toLocaleString('en-US')}B`;
    }
    return `${(num / 1_000_000).toLocaleString('en-US')}M`;
};


export function InfoCard() {
  const [formattedTotalIssued, setFormattedTotalIssued] = useState("");
  const [formattedAvailable, setFormattedAvailable] = useState("");
  const [formattedPurchased, setFormattedPurchased] = useState("");
  const [formattedRemaining, setFormattedRemaining] = useState("");

  useEffect(() => {
    const remainingAmount = AVAILABLE_FOR_SALE - PURCHASED_AMOUNT;
    
    // Format numbers on the client-side to avoid hydration mismatch
    setFormattedTotalIssued(formatNumber(TOTAL_ISSUED));
    setFormattedAvailable(formatNumber(AVAILABLE_FOR_SALE));
    setFormattedPurchased(formatNumber(PURCHASED_AMOUNT));
    setFormattedRemaining(formatNumber(remainingAmount));
  }, []);

  const progressPercentage = (PURCHASED_AMOUNT / AVAILABLE_FOR_SALE) * 100;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Token Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
           <Progress value={progressPercentage} />
           <div className="flex justify-between text-sm text-muted-foreground">
             <span>Purchased</span>
             <span>Remaining</span>
           </div>
        </div>

        <div className="space-y-4">
            <InfoRow label="Total Issued" value={formattedTotalIssued} />
            <InfoRow label="Available for Sale" value={formattedAvailable} />
            <InfoRow label="Purchased" value={formattedPurchased} />
            <InfoRow label="Remaining" value={formattedRemaining} />
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
