import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Capstone database...');

  // Create Base Users for Project 4 Collaboration
  const owner = await prisma.user.upsert({
    where: { email: 'sarah@growurk.com' },
    update: {},
    create: { email: 'sarah@growurk.com', name: 'Sarah (Mentor)' },
  });

  const viewer = await prisma.user.upsert({
    where: { email: 'david@growurk.com' },
    update: {},
    create: { email: 'david@growurk.com', name: 'David (Intern)' },
  });

  // Create Project 4 Initial Document & Permissions
  const doc = await prisma.document.create({
    data: {
      id: 'proj4-doc-1',
      title: 'Project 4: Real-Time Capstone Specs',
      content: '<h2>Welcome to Project 4 Collaborative Editor</h2><p>Start typing here to test live collaborative synchronization, version snapshotting, and presence tracking.</p>',
      ownerId: owner.id,
      permissions: {
        create: [
          { userId: owner.id, role: 'OWNER' },
          { userId: viewer.id, role: 'VIEWER' },
        ],
      },
      versions: {
        create: [
          {
            contentSnapshot: '<p>Initial Base Snapshot</p>',
            commitMessage: 'Base project blueprint v1.0',
          },
        ],
      },
    },
  });

  // Seed Gigs for Lab 3 Full-Text & Faceted Search
  await prisma.gig.createMany({
    data: [
      {
        title: 'Senior Next.js & React System Architecture Design',
        description: 'High performance enterprise frontend architecture using Next.js Turbopack, Tailwind CSS, and Upstash Redis caching.',
        category: 'Design',
        price: 250,
        rating: 4.9,
        tags: 'react,nextjs,design',
        sellerName: 'Sarah Kent',
      },
      {
        title: 'Full-Stack Web App Development with Prisma & Postgres',
        description: 'Complete end to end SaaS development with OWASP security hardening, Sentry error tracking, and CI/CD pipelines.',
        category: 'Development',
        price: 450,
        rating: 5.0,
        tags: 'nextjs,prisma,postgres',
        sellerName: 'Alex Rivers',
      },
      {
        title: 'Modern UI/UX Design System for SaaS Dashboards',
        description: 'Custom glassmorphic design systems in Figma translated into clean React Tailwind components.',
        category: 'Design',
        price: 180,
        rating: 4.8,
        tags: 'design,uiux,figma',
        sellerName: 'Elena Rostova',
      },
      {
        title: 'Technical AI Prompt Engineering & Writing Assistant',
        description: 'Integrate LLMs and custom AI writing assistants into Notion style collaborative markdown editors.',
        category: 'Writing',
        price: 120,
        rating: 4.9,
        tags: 'ai,writing,notion',
        sellerName: 'Marcus Vance',
      },
      {
        title: 'Performance Optimization & Core Web Vitals Audit',
        description: 'Deep dive lighthouse audit and Next.js bundle reduction to achieve sub-50ms search and page load speeds.',
        category: 'Development',
        price: 300,
        rating: 4.9,
        tags: 'performance,react,web',
        sellerName: 'David Chen',
      },
      {
        title: 'Growth Marketing & SEO Strategy for Capstone Apps',
        description: 'Boost search rankings and user retention with structured metadata and fast serverless edge routing.',
        category: 'Marketing',
        price: 150,
        rating: 4.7,
        tags: 'marketing,seo,growth',
        sellerName: 'Chloe Bennet',
      },
    ],
  });

  console.log('✅ Seeded database successfully with Gigs and Project 4 Docs!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
