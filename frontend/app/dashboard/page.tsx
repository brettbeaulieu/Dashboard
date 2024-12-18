import { ChartGrid } from '@/components/custom/chart-grid';
import { Header } from '@/components/custom/header';

const getTransactionData = async () => {
    const response = await fetch('http://backend:8000/api/eth/block/');
    return response.json();
}


export default async function page() {

    // get transaction data from /api/eth/block/
    const testData = await getTransactionData()

    return (
        <div className="flex flex-col w-full min-h-screen">
            <Header />
            <ChartGrid blockData={testData} />
        </div>
    )
}
