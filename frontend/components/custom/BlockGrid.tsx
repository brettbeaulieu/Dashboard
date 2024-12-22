'use client';

import { useEffect, useState, type ReactNode } from 'react';
import type { EthereumBlock } from '@/lib/types';

import { EthereumBlockChart } from './EthereumBlockChart';
import { EthereumBlockTable } from './EthereumBlockTable';

// get host url from .env
const host = process.env.NEXT_PUBLIC_HOST_DOMAIN ?? 'XXXXXXXXXXXXXXXXXXXXX';
const CustomCard = ({ children }: { children: ReactNode }) => {
    return (
        <div className="w-full h-full rounded-xl items-start justify-center p-4 sm:p-6 gap-6 border shadow">
            {children}
        </div>
    )
}

const setBlockHelper = (blockData: EthereumBlock[], newBlock: EthereumBlock) => {
    // Avoid adding the same block twice
    if (blockData[blockData.length - 1].block_number !== newBlock.block_number) {
        // Pop the first value and append newBlock
        return [...(blockData.slice(1)), newBlock];
    }

    return blockData;
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

export function BlockGrid(props: Readonly<{ blockData: EthereumBlock[] }>) {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [blockData, setBlockData] = useState<EthereumBlock[]>(props.blockData);

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
                setBlockData(prevBlockData => setBlockHelper(prevBlockData, newBlock));
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
        <div className="flex flex-col-reverse w-full h-full items-start gap-4">
            <EthereumBlockTable data={blockData} />
            <div className="flex flex-col xl:flex-row w-full h-full gap-4">
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
                        color="#20F5fa"
                        tickFormatter={value => formatLargeNumber(value, 2)}
                    />
                </CustomCard>
            </div>
        </div>
    )
}
