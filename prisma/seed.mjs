import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userId = process.env.SEED_USER_ID ?? "dev-user";
const email = process.env.SEED_USER_EMAIL ?? process.env.DEV_AUTH_EMAIL ?? "demo@example.com";
const name = process.env.SEED_USER_NAME ?? "Demo User";

const resumeText = `Senior Software Engineer with 10 years of experience building reliable backend systems, cloud platforms, and product-focused web applications.

Experience includes Java, Spring Boot, React, TypeScript, PostgreSQL, AWS, system design, mentoring, and cross-functional delivery.

Led architecture improvements, improved service reliability, partnered with product teams, and shipped features used by customers in production.`;

const jobDescription = `Senior Software Engineer role focused on building reliable product experiences with React, TypeScript, Node.js, PostgreSQL, and cloud services. The team needs someone who can own features end to end, improve system quality, partner with product managers, and communicate tradeoffs clearly. Experience with API design, testing, performance work, and pragmatic architecture decisions is valuable.`;

async function main() {
  await prisma.user.upsert({
    create: {
      email,
      id: userId,
      name,
    },
    update: {
      email,
      name,
    },
    where: { id: userId },
  });

  await prisma.careerProfile.upsert({
    create: {
      currentTitle: "Senior Software Engineer",
      industries: ["Software", "Cloud", "Enterprise SaaS"],
      summary: "Senior engineer focused on reliable backend systems, cloud architecture, and product-minded delivery.",
      userId,
      yearsExperience: 10,
    },
    update: {
      currentTitle: "Senior Software Engineer",
      industries: ["Software", "Cloud", "Enterprise SaaS"],
      summary: "Senior engineer focused on reliable backend systems, cloud architecture, and product-minded delivery.",
      yearsExperience: 10,
    },
    where: { userId },
  });

  await prisma.preference.upsert({
    create: {
      desiredCompensation: 180000,
      employmentTypes: ["Full-time", "Direct hire"],
      minCompensation: 150000,
      preferredLocations: ["Remote US", "Atlanta hybrid"],
      preferredSkills: ["Java", "Spring Boot", "PostgreSQL", "AWS", "System Design"],
      preferredTitles: ["Senior Software Engineer", "Staff Engineer", "Backend Engineer"],
      remotePreference: "Remote preferred",
      userId,
      workAuthorization: "Authorized to work in the United States",
    },
    update: {
      desiredCompensation: 180000,
      employmentTypes: ["Full-time", "Direct hire"],
      minCompensation: 150000,
      preferredLocations: ["Remote US", "Atlanta hybrid"],
      preferredSkills: ["Java", "Spring Boot", "PostgreSQL", "AWS", "System Design"],
      preferredTitles: ["Senior Software Engineer", "Staff Engineer", "Backend Engineer"],
      remotePreference: "Remote preferred",
      workAuthorization: "Authorized to work in the United States",
    },
    where: { userId },
  });

  await prisma.skill.deleteMany({ where: { userId } });
  await prisma.skill.createMany({
    data: [
      { category: "Backend", name: "Java", proficiency: "Advanced", userId, years: 10 },
      { category: "Backend", name: "Spring Boot", proficiency: "Advanced", userId, years: 8 },
      { category: "Frontend", name: "React", proficiency: "Advanced", userId, years: 6 },
      { category: "Database", name: "PostgreSQL", proficiency: "Advanced", userId, years: 7 },
      { category: "Cloud", name: "AWS", proficiency: "Advanced", userId, years: 6 },
    ],
  });

  await prisma.resume.deleteMany({ where: { label: "Seed primary resume", userId } });
  await prisma.resume.create({
    data: {
      isDefault: true,
      label: "Seed primary resume",
      rawText: resumeText,
      userId,
    },
  });

  await prisma.job.deleteMany({ where: { source: "seed", userId } });
  await prisma.job.createMany({
    data: [
      {
        canonicalUrl: "https://jobs.example.com/acme/senior-software-engineer",
        company: "Acme Cloud",
        description: jobDescription,
        descriptionHash: "seed-senior-software-engineer",
        employmentType: "Full-time",
        jobUrl: "https://jobs.example.com/acme/senior-software-engineer",
        location: "Remote US",
        normalizedCompany: "acme cloud",
        normalizedLocation: "remote us",
        normalizedTitle: "senior software engineer",
        remoteStatus: "Remote",
        salaryMax: 190000,
        salaryMin: 140000,
        source: "seed",
        sourceJobId: "acme-sse-1",
        status: "Discovered",
        title: "Senior Software Engineer",
        userId,
      },
      {
        canonicalUrl: "https://jobs.example.com/nova/platform-engineer",
        company: "Nova Systems",
        description:
          "Platform Engineer role working on developer experience, CI/CD, observability, cloud infrastructure, and service reliability for product engineering teams.",
        descriptionHash: "seed-platform-engineer",
        employmentType: "Full-time",
        jobUrl: "https://jobs.example.com/nova/platform-engineer",
        location: "Atlanta hybrid",
        normalizedCompany: "nova systems",
        normalizedLocation: "atlanta hybrid",
        normalizedTitle: "platform engineer",
        remoteStatus: "Hybrid",
        salaryMax: 175000,
        salaryMin: 135000,
        source: "seed",
        sourceJobId: "nova-platform-1",
        status: "Interested",
        title: "Platform Engineer",
        userId,
      },
    ],
  });

  console.log(`Seeded ACA demo data for ${email} (${userId}).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
