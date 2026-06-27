import { prisma } from '@/lib/prisma';
import { AddProductForm } from './AddProductForm';
import { ProductList } from './ProductList';

export default async function AdminPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });
  
  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
            <AddProductForm categoryId={1} />
        </div>
        <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Manage Products</h2>
            <p className="text-gray-500 text-sm mb-6">Click delete to see optimistic UI updates in action!</p>
            <ProductList products={products} />
        </div>
      </div>
    </div>
  );
}
