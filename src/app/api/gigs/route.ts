import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCached, redis } from '@/lib/redis';
import { checkRateLimit } from '@/lib/rateLimit';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') ?? '1';
  const category = searchParams.get('category') ?? 'all';

  const cacheKey = `gigs:page:${page}:category:${category}`;

  const gigs = await getCached(
    cacheKey,
    async () => {
      const where = category !== 'all' ? { category } : {};
      const skip = (parseInt(page, 10) - 1) * 20;
      return prisma.gig.findMany({
        where,
        take: 20,
        skip,
        orderBy: { createdAt: 'desc' },
      });
    },
    300 // 5 minutes TTL
  );

  return NextResponse.json({ gigs });
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { allowed, remaining } = await checkRateLimit(`gigs_write:${ip}`, 5, 900000);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again in 15 minutes.' },
      { status: 429, headers: { 'X-RateLimit-Remaining': remaining.toString() } }
    );
  }

  try {
    const body = await request.json();
    const { title, description, price, category, tags } = body;

    if (!title || !description || !price) {
      return NextResponse.json({ error: 'Missing required gig fields' }, { status: 400 });
    }

    const newGig = await prisma.gig.create({
      data: {
        title,
        description,
        price: Number(price),
        category: category ?? 'all',
        tags: tags ?? 'react,web',
      },
    });

    // Cache invalidation: Delete listing caches
    if (redis) {
      try {
        await redis.del(`gigs:page:1:category:${newGig.category}`);
        await redis.del(`gigs:page:1:category:all`);
      } catch (err) {
        console.warn('[Redis Invalidation] Failed to delete cache:', err);
      }
    }

    return NextResponse.json({ gig: newGig }, { status: 201 });
  } catch (err) {
    console.error('Error creating gig:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
