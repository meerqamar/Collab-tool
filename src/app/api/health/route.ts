import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  const start = Date.now();
  const status: Record<string, unknown> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: 'unknown',
      redis: 'unknown',
    },
  };

  try {
    // Check PostgreSQL connection
    await prisma.$queryRaw`SELECT 1`;
    (status.services as Record<string, string>).database = 'connected';
  } catch (err) {
    console.error('Health Check - Database error:', err);
    (status.services as Record<string, string>).database = 'disconnected';
    return NextResponse.json(
      { ...status, status: 'error', error: 'Database unreachable' },
      { status: 503 }
    );
  }

  try {
    // Check Redis connection if configured
    if (redis) {
      await redis.ping();
      (status.services as Record<string, string>).redis = 'connected';
    } else {
      (status.services as Record<string, string>).redis = 'not_configured';
    }
  } catch (err) {
    console.warn('Health Check - Redis error:', err);
    (status.services as Record<string, string>).redis = 'disconnected';
    // Don't fail health check if Redis is degraded, or make it degraded
  }

  status.latencyMs = Date.now() - start;
  return NextResponse.json(status, { status: 200 });
}
