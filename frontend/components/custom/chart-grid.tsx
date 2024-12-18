'use client';

import { useEffect, useState, type ReactNode } from 'react';
import type { EthereumBlock, PaginationResult } from '@/lib/types';

import { CoinbasePrice } from './CoinbaseTicker';
import { EthereumBlockChart } from './EthereumBlockChart';

// get host url from .env
const host = process.env.NEXT_PUBLIC_HOST_URL ?? 'XXXXXXXXXXXXXXXXXXXXX';

const CustomCard = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex flex-col w-full sm:w-1/2 h-fit rounded-xl items-start justify-center p-4 sm:p-6 gap-6 border shadow">
            {children}
        </div>
    )
}

const setBlockHelper = (prev: EthereumBlock[], newBlock: EthereumBlock) => {
    // Avoid adding the same block twice, but update tx_count when necessary.
    if (prev.length === 0 || prev[prev.length - 1].block_number !== newBlock.block_number) {
        console.log('adding new block', newBlock.block_number);
        return [...prev.slice(1), newBlock];
    } else if (prev[prev.length - 1].block_number === newBlock.block_number) {
        console.log('updating block', newBlock.block_number, 'from', prev[prev.length - 1].transaction_count, 'to', newBlock.transaction_count);
        prev[prev.length - 1] = newBlock;
    } else {
        // Block data already exists, feel free to do nothing.
    }
    return prev;
}

export function formatLargeNumber(num: number | undefined, rounding: number) {
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

    return `${num.toFixed(rounding)}${units[unitIndex]}`;
}

export function ChartGrid(props: Readonly<{ blockData: PaginationResult<EthereumBlock> }>) {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [blockData, setBlockData] = useState<EthereumBlock[]>(props.blockData.results);

    // WebSocket connection and data update logic
    useEffect(() => {
        const connectWebSocket = () => {
            // Create WebSocket connection only once
            const websocket = new WebSocket(`ws://${host}:8000/ws/ethblock/`);

            // Assign the websocket object to the state to manage it
            setWs(websocket);

            websocket.onopen = () => {
                console.log('connected to websocket');
            };

            websocket.onclose = event => {
                console.log('WebSocket closed with code', event.code);
                // 1000 means normal closure
                if (event.code !== 1000) {
                    console.log('Reconnecting to WebSocket...');
                    // Try reconnecting after 3 seconds
                    const threeSecondsMS = 3000
                    setTimeout(connectWebSocket, threeSecondsMS);
                }
            };

            websocket.onerror = error => {
                console.error('WebSocket error:', error);
                // Close to trigger onclose and attempt reconnect
                websocket.close();
            };

            websocket.onmessage = event => {
                const newBlock = JSON.parse(event.data);
                setBlockData(setBlockHelper(blockData, newBlock));
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
        <div className="flex flex-row w-full h-full justify-center items-center p-6 gap-6">
            <div className="flex flex-col w-full h-full gap-2">
                <div className="flex flex-row w-full gap-2">
                    <CoinbasePrice />
                </div>
                <div className="flex flex-col sm:flex-row w-full gap-2">
                    <CustomCard>
                        <EthereumBlockChart
                            data={blockData}
                            dataKey="transaction_count"
                            label="Transaction Count"
                            color="#60a5fa"
                            tickFormatter={value => formatLargeNumber(value, 0)}
                        />
                    </CustomCard>
                    <CustomCard>
                        <EthereumBlockChart
                            data={blockData}
                            dataKey="gas_used"
                            label="Gas Used"
                            color="#60a5fa"
                            tickFormatter={value => formatLargeNumber(value, 2)}
                        />
                    </CustomCard>
                </div>
            </div>
        </div>
    )
}
