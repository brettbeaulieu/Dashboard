'use client'

import { ReactNode, useEffect, useState } from 'react';
import BuildNumericTooltip from './BuildNumericTooltip';

type ProductTicker = {
    // ISO 8601 formatted timestamp string
    timestamp: Date;
    // Product ID (e.g., 'ETH-USD')
    product_id: string;
    // Price  (could be a decimal value)
    price: number;
    // Volume over the last 24 hours
    volume_24_h: number;
    // Low price in the last 24 hours
    low_24_h: number;
    // High price in the last 24 hours
    high_24_h: number;
    // Low price in the last 52 weeks
    low_52_w: number;
    // High price in the last 52 weeks
    high_52_w: number;
    // Price percentage change in the last 24 hours
    price_percent_chg_24_h: number;
    // Best bid price
    best_bid: number;
    // Best ask price
    best_ask: number;
    // Best bid quantity
    best_bid_quantity: number;
    // Best ask quantity
    best_ask_quantity: number;
};

const host = process.env.NEXT_PUBLIC_HOST_DOMAIN ?? '';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});
const percentFormatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

function formatLargeNumber(num: number | undefined) {
    if (num === undefined) {
        return 'N/A';
    }

    const units = ['', 'K', 'M', 'B', 'T'];
    let unitIndex = 0;

    // While the number is greater than or equal to 1000, keep dividing it by 1000
    while (num >= 1000 && unitIndex < units.length - 1) {
        num /= 1000;
        unitIndex++;
    }

    // Round to 3 decimal places for readability
    return `$${num.toFixed(3)}${units[unitIndex]}`;
}

const BidAsk = ({ bid, ask }: { bid: number, ask: number }) => {

    const bidDisplay =  <p className="font-bold text-red-500 text-xs sm:text-sm tabular-nums">{currencyFormatter.format(ask)} </p>
    const askDisplay = <p className="font-bold text-green-500 text-xs sm:text-sm tabular-nums">{currencyFormatter.format(bid)}</p>

    return (
    <div>
        {/* Best ask and best bid sidebyside, in respective colorations */}
        <div className="flex flex-row w-fit gap-2">
            <BuildNumericTooltip title={bidDisplay}>
                <p className="font-bold text-red-500 text-xs sm:text-sm tabular-nums">{currencyFormatter.format(ask)} </p>
            </BuildNumericTooltip>
            <BuildNumericTooltip title={askDisplay}>
                <p className="font-bold text-green-500 text-xs sm:text-sm tabular-nums">{currencyFormatter.format(bid)}</p>
            </BuildNumericTooltip>
        </div>
    </div>
    )
}

const PriceChangeComponent = ({ priceChange }: { priceChange: number }) => {
    let textcolor = ''
    if (priceChange > 0) {
        textcolor = 'text-green-500'
    } else if (priceChange < 0) {
        textcolor = 'text-red-500'
    } else {
        // Don't alter the text color if the price change is exactly 0
    }
    return (
        <h1 className={`tracking-tighter text-lg sm:text-xl tabular-nums ${textcolor}`}>
            {percentFormatter.format(priceChange / 100)}
        </h1>
    )
}


const CustomCard = ({ title, children }: { title: string | null, children: ReactNode }) => {
    return (
        <div className="flex flex-col w-fit h-fit rounded-xl items-center justify-start p-2 sm:p-4 border shadow">
            <h1 className="text-nowrap">{title}</h1>
            <p className="font-light justify-center items-center text-center text-nowrap p-1">{children}</p>
        </div>
    )
}

export function CoinbasePrice() {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [productData, setProductData] = useState<ProductTicker | undefined>(undefined);


    // WebSocket connection and data update logic
    useEffect(() => {
        const connectWebSocket = () => {
            // Create WebSocket connection only once
            const websocket = new WebSocket(`ws://${host}:8000/ws/ticker/ETH-USD/`);

            // Assign the websocket object to the state to manage it
            setWs(websocket);

            websocket.onopen = () => {
            };

            websocket.onclose = event => {
                console.log('WebSocket closed with code', event.code);
                // 1000 means normal closure
                if (event.code !== 1000) {
                    // Try reconnecting after 3 seconds
                    const threeSecondsMs = 3000
                    setTimeout(connectWebSocket, threeSecondsMs);
                }
            };

            websocket.onerror = error => {
                console.error('WebSocket error:', error);
                // Close to trigger onclose and attempt reconnect
                websocket.close();
            };

            websocket.onmessage = event => {
                const newProduct = JSON.parse(event.data);
                // convert strings to nums
                newProduct.price = parseFloat(newProduct.price);
                newProduct.volume_24_h = parseFloat(newProduct.volume_24_h);
                newProduct.low_24_h = parseFloat(newProduct.low_24_h);
                newProduct.high_24_h = parseFloat(newProduct.high_24_h);
                newProduct.low_52_w = parseFloat(newProduct.low_52_w);
                newProduct.high_52_w = parseFloat(newProduct.high_52_w);
                newProduct.price_percent_chg_24_h = parseFloat(newProduct.price_percent_chg_24_h);
                newProduct.best_bid = parseFloat(newProduct.best_bid);
                newProduct.best_ask = parseFloat(newProduct.best_ask);
                newProduct.best_bid_quantity = parseFloat(newProduct.best_bid_quantity);
                newProduct.best_ask_quantity = parseFloat(newProduct.best_ask_quantity);
                setProductData(newProduct)
            };
        };

        // Connect the WebSocket on mount
        connectWebSocket();

        // Clean up the WebSocket connection when the component is unmounted
        return () => {
            if (ws) {
                console.log('Closing WebSocket connection...');
                ws.close();
            }
        };
        // Empty dependency array ensures the WebSocket is created only once.
    }, []);

    return (
        <div className="flex flex-col sm:flex-row w-full h-fit rounded-lg border shadow p-4 sm:p-4 gap-2 items-start">
            <div className="flex flex-col">
                <h1 className="tracking-tighter font-bold text-3xl text-nowrap">{productData?.product_id ?? 'NONE'}</h1>
                <div className="flex flex-col sm:flex-col w-full h-full gap-1">
                    <div className="flex flex-row w-full items-center gap-2">
                        <h1 className="tracking-tighter font-bold text-2xl sm:text-4xl tabular-nums">{currencyFormatter.format(productData?.price ?? 0)}</h1>
                        <PriceChangeComponent priceChange={productData?.price_percent_chg_24_h ?? 0} />
                    </div>
                    <BidAsk bid={productData?.best_bid ?? 0} ask={productData?.best_ask ?? 0} />
                    {/* Best ask and best bid sidebyside, in respective colorations */}
                </div>
            </div>

            <div className="flex flex-row w-full gap-2">
                <CustomCard title="24H High">
                    {formatLargeNumber(productData?.high_24_h)}
                </CustomCard>
                <CustomCard title="24H Low">
                    {formatLargeNumber(productData?.low_24_h)}
                </CustomCard>
                <CustomCard title="24H Volume">
                    {formatLargeNumber(productData?.volume_24_h)}
                </CustomCard>
            </div>

        </div>

    )
}
