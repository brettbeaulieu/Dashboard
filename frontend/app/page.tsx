import { Logo, LogoLink } from '@/components/custom/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


const LaunchAppButton = () => {
  return (
    <Button className="rounded-full font-bold tracking-tighter text-xl p-6 border" asChild>
      <Link href={'/dashboard'} >
        Launch App
      </Link>
    </Button>
  )
}

export default function page() {
  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-b from-transparent to-zinc-900">
      {/* Header */}
      <div id="header" className="w-full flex flex-row items-center justify-between p-4">
        <LogoLink size={32} />
        <LaunchAppButton />
      </div>
      {/* Hero */}
      <div className="flex flex-col w-full h-full gap-8 flex-grow justify-center items-center">
        <Logo size={200} />
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tighter bg-gradient-to-b from-white to-zinc-400 text-transparent bg-clip-text">
          Ethereum Dashboard.
        </h1>
        <div className="flex gap-4 items-center flex-col justify-center sm:flex-row">
          <Button className="rounded-full text-xl p-6 border bg-transparent">Learn More</Button>
          <LaunchAppButton />
        </div>
      </div>

      {/* Footer */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
