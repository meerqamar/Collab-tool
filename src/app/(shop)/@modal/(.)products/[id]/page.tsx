import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Modal } from '@/app/components/Modal';

export default async function ProductModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) }
  });

  if (!product) notFound();

  return (
    <Modal>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
        <p className="text-xl text-blue-600 mb-6">${product.price.toFixed(2)}</p>
        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Add to Cart
        </button>
      </div>
    </Modal>
  );
}
