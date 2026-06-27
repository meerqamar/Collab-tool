import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

// In-memory event listeners fallback for dev
const localSubscribers = new Map<string, Set<(msg: string) => void>>();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ gigId: string }> }
) {
  const resolvedParams = await params;
  const { gigId } = resolvedParams;

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  // Send connected ping
  writer.write(encoder.encode(`data: ${JSON.stringify({ event: 'connected', gigId })}\n\n`));

  // Local listener callback
  const listener = (message: string) => {
    try {
      writer.write(encoder.encode(`data: ${message}\n\n`));
    } catch {
      // Stream closed
    }
  };

  let subs = localSubscribers.get(gigId);
  if (!subs) {
    subs = new Set();
    localSubscribers.set(gigId, subs);
  }
  subs.add(listener);

  // Keep-alive heartbeat interval
  const interval = setInterval(() => {
    try {
      writer.write(encoder.encode(`: heartbeat\n\n`));
    } catch {
      clearInterval(interval);
      subs?.delete(listener);
    }
  }, 15000);

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ gigId: string }> }
) {
  const resolvedParams = await params;
  const { gigId } = resolvedParams;

  try {
    const body = await request.json();
    const payload = JSON.stringify({ ...body, timestamp: Date.now() });

    if (redis) {
      try {
        await redis.publish(`presence:gig:${gigId}`, payload);
      } catch (err) {
        console.warn('[Redis Presence] Publish error:', err);
      }
    }

    // Trigger local SSE subscribers
    const subs = localSubscribers.get(gigId);
    if (subs) {
      subs.forEach((cb) => cb(payload));
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
