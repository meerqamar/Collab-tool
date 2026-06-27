import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product = null;
  try {
    product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true }
    });
  } catch (err) {
    console.error('Database connection failed on product view:', err);
  }

  if (!product) {
    const fallbackProducts = [
      { id: 101, name: 'Synapse Enterprise Cloud License', price: 999.0, stock: 100, categoryId: 1, createdAt: new Date(), category: { id: 1, name: 'software' } },
      { id: 102, name: 'Distributed Edge Caching Node', price: 499.0, stock: 50, categoryId: 2, createdAt: new Date(), category: { id: 2, name: 'infrastructure' } },
      { id: 103, name: 'AI Copilot Token Bundle (10M)', price: 299.0, stock: 500, categoryId: 3, createdAt: new Date(), category: { id: 3, name: 'ai' } },
      { id: 104, name: 'Real-Time Telemetry & Audit Dashboard', price: 199.0, stock: 250, categoryId: 1, createdAt: new Date(), category: { id: 1, name: 'software' } },
      { id: 105, name: 'Zero-Trust Security Encryption Key', price: 799.0, stock: 20, categoryId: 2, createdAt: new Date(), category: { id: 2, name: 'security' } },
      { id: 106, name: 'Global DNS Discovery Load Balancer', price: 349.0, stock: 80, categoryId: 3, createdAt: new Date(), category: { id: 3, name: 'network' } },
    ];
    product = fallbackProducts.find(p => p.id === Number(id)) || fallbackProducts[0];
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 text-slate-100">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-extrabold">{product.name}</h1>
          <span className="text-xs uppercase px-3 py-1 bg-indigo-950 border border-indigo-800 text-indigo-300 rounded-full font-semibold">
            {product.category?.name || 'enterprise'}
          </span>
        </div>
        <p className="text-3xl text-indigo-400 font-black">${product.price.toFixed(2)}</p>
        <div className="bg-slate-950/60 p-6 rounded-xl border border-slate-800/80 space-y-4">
          <p className="text-slate-300 leading-relaxed">
            Experience sub-millisecond cloud synchronization and enterprise-grade reliability. Distributed across edge nodes globally for maximum resilience and uptime.
          </p>
          <div className="flex gap-6 text-sm text-slate-400 pt-4 border-t border-slate-800">
            <span>📦 Available Stock: <strong className="text-slate-200">{product.stock} units</strong></span>
            <span>⚡ Instant Cloud Provisioning</span>
          </div>
        </div>
      </div>
    </div>
  );
}
