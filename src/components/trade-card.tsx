
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { logTransaction } from "@/app/actions";
import { useLanguage } from "@/context/language-context";

const CENT_PRICE_USD = 0.01;

type PaymentOption = {
  id: string;
  crypto: string;
  address: string;
  memo?: string;
  precision: number;
  rate?: number;
};

const initialPaymentOptions: Omit<PaymentOption, 'rate'>[] = [
  { id: "tether", crypto: "USDT (TRC20)", address: "THuRNy38JPW4fe9z6qc34LhkXiJd7UvHny", precision: 2 },
  { id: "solana", crypto: "SOL", address: "399AqeZBEhTs7r3uShHtMVRFP5FQadD12Lwmhuw9LsHc", precision: 6 },
  { id: "bitcoin", crypto: "BTC", address: "3MK993syjw1juTKGkCjv33eEMEMNR5RHCv", precision: 8 },
  { id: "tron", crypto: "TRX", address: "THuRNy38JPW4fe9z6qc34LhkXiJd7UvHny", precision: 2 },
  { id: "algorand", crypto: "ALGO", address: "IQS5NE36Y34JLJR2NJZ6IACSGUWEI3ZMASDRQHYVKAUS6MSKG3AR6XGLSY", precision: 4 },
  { id: "ethereum", crypto: "ETH (ERC20)", address: "0xc4e52389696914b38feec3fa64cb9dc3e8f17f7a", precision: 6 },
  { id: "toncoin", crypto: "TON", address: "EQCA1BI4QRZ8qYmskSRDzJmkucGodYRTZCf_b9hckjla6dZl", memo: "1891580463", precision: 4 },
];

async function getCryptoRates(): Promise<Record<string, number>> {
  try {
    const response = await fetch('/api/crypto-rates');
    if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
  } catch (error) {
      console.error("Failed to fetch crypto rates from local API, falling back to mock data.", error);
      return {
        'tether': 1.00,
        'solana': 150.00,
        'bitcoin': 65000.00,
        'tron': 0.12,
        'algorand': 0.18,
        'ethereum': 3500.00,
        'toncoin': 7.50,
    };
  }
}

type DialogStep = 'selection' | 'details';


export function TradeCard() {
  const { toast } = useToast();
  const { user, idToken } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  const [buyAmount, setBuyAmount] = useState("");
  const [usdCost, setUsdCost] = useState(0);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption | null>(null);
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([]);
  const [isLoadingRates, setIsLoadingRates] = useState(true);
  const [dialogStep, setDialogStep] = useState<DialogStep>('selection');

  const fetchRates = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) {
        setIsLoadingRates(true);
    }
    const rates = await getCryptoRates();
    const updatedOptions = initialPaymentOptions.map(option => ({
      ...option,
      rate: rates[option.id],
    }));
    setPaymentOptions(updatedOptions as PaymentOption[]);
    if (isInitialLoad) {
        setIsLoadingRates(false);
    }
  }, []);

  useEffect(() => {
    fetchRates(true);
    const intervalId = setInterval(() => {
        fetchRates(false);
    }, 60000);
    return () => clearInterval(intervalId);
  }, [fetchRates]);


  useEffect(() => {
    const amount = parseFloat(buyAmount);
    if (!isNaN(amount) && amount > 0) {
      setUsdCost(amount * CENT_PRICE_USD);
    } else {
      setUsdCost(0);
    }
  }, [buyAmount]);

  const cryptoEquivalents = useMemo(() => {
    if (usdCost === 0 || paymentOptions.length === 0 || isLoadingRates) return [];
    return paymentOptions.map(option => ({
      ...option,
      value: option.rate ? (usdCost / option.rate).toFixed(option.precision) : 'N/A'
    }));
  }, [usdCost, paymentOptions, isLoadingRates]);

  const handleBuyClick = () => {
    if (!user) {
        router.push('/login');
        return;
    }
    if (parseFloat(buyAmount) > 0) {
      setDialogStep('selection');
      setIsPaymentDialogOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: t('toast_invalid_amount_title'),
        description: t('toast_invalid_amount_desc'),
      });
    }
  };
  
  const handleDialogClose = () => {
    setIsPaymentDialogOpen(false);
    setTimeout(() => {
        setSelectedPayment(null);
        setDialogStep('selection');
    }, 300);
  };
  
  const handlePaymentPaid = async () => {
    if (!idToken || !selectedPayment) return;

    setIsSubmitting(true);
    try {
        const result = await logTransaction({
            idToken,
            centAmount: parseFloat(buyAmount),
            usdCost,
            paymentMethod: selectedPayment.crypto,
            paymentAmount: selectedCryptoAmount,
            paymentAddress: selectedPayment.address,
            paymentMemo: selectedPayment.memo,
        });

        if (result.success) {
            handleDialogClose();
            toast({
                title: t('toast_payment_success_title'),
                description: t('toast_payment_success_desc'),
            });
        } else {
            throw new Error(result.error || "Failed to log transaction.");
        }
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: t('toast_error_title'),
            description: error.message || t('toast_error_desc'),
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('toast_copied_title'),
      description: `${t('toast_copied_desc')} ${text}`,
    });
  };

  const selectedCryptoAmount = useMemo(() => {
    if (!selectedPayment) return "0";
    return cryptoEquivalents.find(c => c.id === selectedPayment.id)?.value || "0";
  }, [selectedPayment, cryptoEquivalents]);
  
  const handleSelectPayment = (option: PaymentOption) => {
    setSelectedPayment(option);
    setDialogStep('details');
  }
  
  const handleBackToSelection = () => {
    setSelectedPayment(null);
    setDialogStep('selection');
  }

  const renderDialogContent = () => {
    switch (dialogStep) {
      case 'selection':
        return (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('dialog_complete_purchase_title')}</AlertDialogTitle>
              <AlertDialogDescription>{t('dialog_complete_purchase_desc')}</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
              {paymentOptions.map((option) => (
                <Button key={option.id} variant="outline" className="w-full justify-between" onClick={() => handleSelectPayment(option)} disabled={isLoadingRates || !option.rate}>
                  <span>{option.crypto}</span>
                  {isLoadingRates ? <Loader2 className="h-4 w-4 animate-spin"/> : <ChevronRight className="h-4 w-4"/>}
                </Button>
              ))}
            </div>
            <AlertDialogFooter className="mt-4">
              <Button variant="outline" onClick={handleDialogClose}>{t('close')}</Button>
            </AlertDialogFooter>
          </>
        );
      case 'details':
        if (!selectedPayment) return null;
        return (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('dialog_pay_with')} {selectedPayment.crypto}</AlertDialogTitle>
              <AlertDialogDescription>{t('dialog_pay_with_desc_1')} {buyAmount} {t('dialog_pay_with_desc_2')}</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg bg-muted/50 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{t('dialog_amount_to_pay')}</p>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <Input readOnly value={`${selectedCryptoAmount} ${selectedPayment.crypto.split(' ')[0]}`} className="text-sm text-muted-foreground font-mono" />
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(selectedCryptoAmount)}><Copy className="h-4 w-4"/></Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t('dialog_address')}</p>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <Input readOnly value={selectedPayment.address} className="text-sm text-muted-foreground truncate" />
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(selectedPayment.address)}><Copy className="h-4 w-4"/></Button>
                  </div>
                </div>
                {selectedPayment.memo && (
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t('dialog_memo')}</p>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <Input readOnly value={selectedPayment.memo} className="text-sm text-muted-foreground" />
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard(selectedPayment.memo!)}><Copy className="h-4 w-4"/></Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <AlertDialogFooter className="mt-4">
              <Button variant="ghost" onClick={handleBackToSelection} disabled={isSubmitting}><ChevronLeft className="h-4 w-4 mr-2"/>{t('back')}</Button>
              <div className="flex-grow"></div>
              <Button onClick={handlePaymentPaid} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                {t('i_paid')}
              </Button>
            </AlertDialogFooter>
          </>
        );
    }
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">{t('trade_card_title')}</CardTitle>
              <CardDescription>
                {t('trade_card_description')}
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{t('trade_card_price')}</p>
              <p className="text-2xl font-bold text-primary">
                ${CENT_PRICE_USD.toFixed(4)}
                <span className="text-sm text-muted-foreground ml-1">/CENT</span>
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label htmlFor="buy-amount" className="text-sm font-medium">
                  {t('trade_card_amount')}
                </label>
                <Input
                  id="buy-amount"
                  type="number"
                  placeholder="0.00"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  className="text-lg"
                />
              </div>
              
              {usdCost > 0 && (
                <div className="text-sm">
                  <p>
                    {t('trade_card_cost')}{" "}
                    <span className="font-bold text-foreground">
                      ${usdCost.toFixed(2)}
                    </span>
                  </p>
                </div>
              )}
                
              <Button
                size="lg"
                className="w-full text-lg mt-4"
                onClick={handleBuyClick}
                disabled={isLoadingRates && paymentOptions.length === 0}
              >
                {isLoadingRates && paymentOptions.length === 0 ? <Loader2 className="animate-spin mr-2" /> : null}
                {t('trade_card_buy_button')}
              </Button>
            </div>
        </CardContent>
        {usdCost > 0 && (
            <>
                <Separator className="my-4"/>
                <CardFooter className="flex-col items-start space-y-2">
                     <h3 className="text-sm font-semibold text-foreground">{t('trade_card_equivalents')}</h3>
                     {isLoadingRates && paymentOptions.length === 0 ? (
                         <div className="flex items-center justify-center w-full p-4">
                             <Loader2 className="h-6 w-6 animate-spin text-primary"/>
                         </div>
                     ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full text-xs">
                            {cryptoEquivalents.map(c => (
                                <div key={c.id}>
                                    <span className="font-mono text-muted-foreground">{c.value}</span>
                                    <span className="ml-1 font-semibold">{c.crypto.split(' ')[0]}</span>
                                </div>
                            ))}
                        </div>
                     )}
                </CardFooter>
            </>
        )}
      </Card>
      
      <AlertDialog open={isPaymentDialogOpen} onOpenChange={handleDialogClose}>
        <AlertDialogContent className="max-w-md">
            {renderDialogContent()}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}