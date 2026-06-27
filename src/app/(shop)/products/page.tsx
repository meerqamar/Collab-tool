import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { ProductGrid, SearchBar } from '@/features/products';
import Loading from './loading';

async function ProductList({ q, category }: { q?: string; category?: string }) {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const products = await prisma.product.findMany({
    where: {
      ...(category && { category: { name: category } }),
      ...(q && { name: { contains: q } }), 
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return <ProductGrid products={products} />;
}

export default async function ProductsPage({
 searchParams,
}: {
 searchParams: Promise<{ category?: string; q?: string }>;
}) {
 const params = await searchParams;

 return (
   <div>
     <h1 className='text-3xl font-bold mb-8'>Products</h1>
     <SearchBar initialQuery={params.q || ''} />
     <Suspense fallback={<Loading />}>
       <ProductList q={params.q} category={params.category} />
     </Suspense>
   </div>
 );
}
