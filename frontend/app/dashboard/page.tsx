import { BlockGrid } from '@/components/custom/BlockGrid';
import { CoinbasePrice } from '@/components/custom/CoinbaseTicker';
import { Header } from '@/components/custom/header';
import { EthereumBlock, PaginationResult } from '@/lib/types';

const getBlockData = async (): Promise<PaginationResult<EthereumBlock>> => {
    const response = await fetch('http://backend:8000/api/eth/block/?limit=50');
    return response.json();
}


export default async function page() {

    // get transaction data from /api/eth/block/
    const testData = await getBlockData()

    return (
        <div className="flex flex-col w-full h-full min-h-screen">
            <Header />
            <div className='flex flex-col w-full h-full p-4 gap-4'>
                <CoinbasePrice />
                <BlockGrid blockData={testData.results} />
            </div>
        </div>
    )
}
