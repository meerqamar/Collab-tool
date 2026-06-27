import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { template: '%s | Synapse Cloud', default: 'Synapse Cloud | Enterprise Real-Time Architecture' },
  description: 'Enterprise Real-Time Collaboration, Discovery & Distributed Systems Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <nav className='h-16 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 text-slate-100 flex items-center px-8 justify-between shadow-lg shadow-indigo-950/20'>
          <div className='flex items-center gap-8'>
            <Link href='/' className='font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2.5'>
              <span className='w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse shadow-lg shadow-indigo-500/50'></span>
              SYNAPSE
            </Link>
            <div className='flex items-center gap-6 text-sm font-medium text-slate-300'>
              <Link href='/products' className='hover:text-indigo-400 transition-colors'>Products</Link>
              <Link href='/cart' className='hover:text-indigo-400 transition-colors'>Cart</Link>
            </div>
          </div>
        </nav>
        <main className='min-h-screen bg-slate-950'>{children}</main>
      </body>
    </html>
  );
}