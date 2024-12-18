import { SignIn } from '@/components/custom/sign-in';

export default function page(props: Readonly<{
    searchParams: { callbackUrl: string | undefined }
}>) {
    return (
        <div>
            <SignIn callbackUrl={props?.searchParams?.callbackUrl}/>
        </div>
    )
}