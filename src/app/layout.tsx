import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { template: '%s | GROWURK', default: 'GROWURK' },
  description: 'Advanced Real-Time Collaboration & E-Commerce Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <nav className='h-16 border-b border-slate-800 bg-slate-950 text-slate-100 flex items-center px-6 gap-6'>
          <Link href='/' className='font-bold text-lg text-indigo-400'>GROWURK</Link>
          <Link href='/products' className='hover:text-indigo-300'>Products</Link>
          <Link href='/cart' className='hover:text-indigo-300'>Cart</Link>
        </nav>
        <main className='min-h-screen bg-slate-950'>{children}</main>
      </body>
    </html>
  );
}