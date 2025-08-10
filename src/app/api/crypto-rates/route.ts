import { NextResponse } from 'next/server';

const COINGECKO_API_KEY = 'CG-uWZwjmVzQhaMd82C3wawcX3s';
const API_URL = 'https://api.coingecko.com/api/v3/simple/price';

// The IDs of the coins we want to get prices for.
const COIN_IDS = [
  "tether",
  "solana",
  "bitcoin",
  "tron",
  "algorand",
  "ethereum",
  "toncoin",
].join(',');

export async function GET() {
  if (!COINGECKO_API_KEY) {
    // Return mock data if API key is not configured
     return NextResponse.json({
        'tether': 1.00,
        'solana': 150.00,
        'bitcoin': 65000.00,
        'tron': 0.12,
        'algorand': 0.18,
        'ethereum': 3500.00,
        'toncoin': 7.50,
    });
  }

  try {
    const response = await fetch(`${API_URL}?ids=${COIN_IDS}&vs_currencies=usd`, {
        headers: {
            'x-cg-demo-api-key': COINGECKO_API_KEY
        }
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('CoinGecko API Error:', errorText);
        return NextResponse.json({ error: `Failed to fetch data from CoinGecko: ${response.statusText}` }, { status: response.status });
    }

    const data: any = await response.json();

    // Transform the data to a simple key-value pair of id: rate
    const rates: Record<string, number> = {};
    for (const key in data) {
        if (data[key] && typeof data[key].usd === 'number') {
            rates[key] = data[key].usd;
        }
    }

    return NextResponse.json(rates);

  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}