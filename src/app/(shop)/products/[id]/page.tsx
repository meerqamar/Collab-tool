import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { category: true }
  });

  if (!product) notFound();

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
      <p className="text-2xl text-blue-600 font-bold mb-6">${product.price.toFixed(2)}</p>
      <div className="bg-gray-50 p-6 rounded-lg">
        <p className="text-gray-700">This is a full page view of the product. The description and other details would go here.</p>
        <p className="mt-4 text-sm text-gray-500">Category: {product.category?.name}</p>
        <p className="mt-2 text-sm text-gray-500">Stock: {product.stock}</p>
      </div>
    </div>
  );
}
