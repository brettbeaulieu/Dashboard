'use client';

import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { EthereumBlock } from '@/lib/types';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

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

interface EthereumChartProps {
  data: EthereumBlock[];
  dataKey: keyof EthereumBlock;
  label: string;
  color: string;
  tickFormatter?: (value: number) => string;
  rounding?: number;
}

export function EthereumBlockChart({
  data,
  dataKey,
  label,
  color,
  tickFormatter,
  rounding = 2,
}: Readonly<EthereumChartProps>) {
  const chartConfig: ChartConfig = {
    [dataKey]: {
      label,
      color,
    },
  };

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <XAxis
          dataKey="block_number"
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          dataKey={dataKey}
          tickLine={false}
          tickFormatter={tickFormatter || ((value: number) => formatLargeNumber(value, rounding))}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey={dataKey} radius={2} fill={`var(--color-${dataKey}`} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  );
}
