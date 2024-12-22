import { Header } from '@/components/custom/header';
import { SignIn } from '@/components/custom/sign-in';

export default function page(props: Readonly<{
    searchParams: { callbackUrl: string | undefined }
}>) {
    return (
        <div className='flex flex-col w-full h-screen'>
            <Header />
            <div className='flex flex-row w-full h-full justify-center items-center'>
                <SignIn callbackUrl={props?.searchParams?.callbackUrl} />
            </div>
        </div>
    )
}