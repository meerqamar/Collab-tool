import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rateLimit';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    let doc = await prisma.document.findUnique({
      where: { id },
      include: {
        versions: { orderBy: { createdAt: 'desc' } },
        permissions: { include: { user: true } },
        owner: true,
      },
    });

    // Auto-create demo doc if not found
    if (!doc) {
      let owner = await prisma.user.findFirst();
      if (!owner) {
        owner = await prisma.user.create({
          data: { email: 'demo@growurk.com', name: 'Alex Intern' },
        });
      }

      doc = await prisma.document.create({
        data: {
          id,
          title: 'Project 4: Real-Time Architecture Capstone',
          content: '<h2>Welcome to Project 4 Collaborative Editor</h2><p>Start typing here to test live collaborative synchronization, version snapshotting, and presence tracking.</p>',
          ownerId: owner.id,
        },
        include: {
          versions: true,
          permissions: { include: { user: true } },
          owner: true,
        },
      });
    }

    return NextResponse.json({ document: doc });
  } catch (err) {
    console.error('Document GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { allowed } = await checkRateLimit(`doc_write:${ip}`, 30, 60000);

  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const { title, content, createVersion, commitMessage } = await request.json();

    const updated = await prisma.document.update({
      where: { id },
      data: {
        title: title ?? undefined,
        content: content ?? undefined,
      },
    });

    // Create version snapshot if requested
    if (createVersion && content) {
      await prisma.documentVersion.create({
        data: {
          documentId: id,
          contentSnapshot: content,
          commitMessage: commitMessage || 'Auto save snapshot',
        },
      });
    }

    return NextResponse.json({ document: updated });
  } catch (err) {
    console.error('Document PUT error:', err);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}
