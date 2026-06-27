import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Modal } from '@/app/components/Modal';

export default async function ProductModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product = null;
  try {
    product = await prisma.product.findUnique({
      where: { id: Number(id) }
    });
  } catch (err) {
    console.error('Database connection failed on modal view:', err);
  }

  if (!product) {
    const fallbackProducts = [
      { id: 101, name: 'Synapse Enterprise Cloud License', price: 999.0, stock: 100 },
      { id: 102, name: 'Distributed Edge Caching Node', price: 499.0, stock: 50 },
      { id: 103, name: 'AI Copilot Token Bundle (10M)', price: 299.0, stock: 500 },
      { id: 104, name: 'Real-Time Telemetry & Audit Dashboard', price: 199.0, stock: 250 },
      { id: 105, name: 'Zero-Trust Security Encryption Key', price: 799.0, stock: 20 },
      { id: 106, name: 'Global DNS Discovery Load Balancer', price: 349.0, stock: 80 },
    ];
    product = fallbackProducts.find(p => p.id === Number(id)) || fallbackProducts[0];
  }

  return (
    <Modal>
      <div className="p-6 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <p className="text-2xl text-indigo-400 font-extrabold">${product.price.toFixed(2)}</p>
        <p className="text-sm text-slate-400">Instant provisioned enterprise cloud resource with automated SLA guarantees.</p>
        <button className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition cursor-pointer text-sm">
          Add to Cart
        </button>
      </div>
    </Modal>
  );
}
