import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() ?? '';
  const category = searchParams.get('category');
  const minPrice = parseInt(searchParams.get('minPrice') ?? '0', 10);
  const maxPrice = parseInt(searchParams.get('maxPrice') ?? '99999', 10);

  if (q.length < 2 && !category) {
    return NextResponse.json({ results: [], facets: {}, durationMs: 0 });
  }

  const start = Date.now();

  try {
    // Parameterized Prisma search safe against SQL injection
    const whereClause: Record<string, unknown> = {
      price: { gte: minPrice, lte: maxPrice },
    };

    if (category && category !== 'all') {
      whereClause.category = category;
    }

    if (q.length >= 2) {
      whereClause.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { tags: { contains: q } },
      ];
    }

    const results = await prisma.gig.findMany({
      where: whereClause,
      take: 20,
    });

    const durationMs = Date.now() - start;

    // Challenge Task: Log search analytics to Redis hash
    if (redis && q.length >= 2) {
      const normQuery = q.toLowerCase();
      try {
        await redis.hincrby('search:analytics:queries', normQuery, 1);
        if (results.length === 0) {
          await redis.sadd('search:analytics:zero_results', normQuery);
        }
      } catch (err) {
        console.warn('[Search Analytics] Redis logging failed:', err);
      }
    }

    // Facet counts
    const allGigs = await prisma.gig.findMany({ select: { category: true } });
    const facets: Record<string, number> = {};
    allGigs.forEach((g: { category: string }) => {
      facets[g.category] = (facets[g.category] || 0) + 1;
    });

    return NextResponse.json({ results, facets, durationMs });
  } catch (err) {
    console.error('Search API error:', err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
