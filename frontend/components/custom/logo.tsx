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
        <Image
            className="m-4"
            src="/ethereum-eth-logo-diamond-purple.svg"
            alt="Logo"
            width={size ?? 64}
            height={size ?? 64}
        />
    )
}
