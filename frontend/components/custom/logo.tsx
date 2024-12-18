import Image from 'next/image'
import Link from 'next/link'

export const LogoLink = ({ size }: { size?: number }) => {
    return (
        <Link href="/">
            <Logo size={size} />
        </Link>
    )
}

export const Logo = ({ size }: { size?: number }) => {
    return (
        <div className={`flex rounded-full aspect-square w-[${size}px] h-[${size}px] border-r-${size} bg-zinc-300 items-center justify-center`}>
            <Image
                className="m-4"
                src="/ethereum-eth-logo-diamond-purple.svg"
                alt="Logo"
                width={Math.floor((size??0)/2)}
                height={Math.floor((size??0)/2)}
            />
        </div>
    )
}
