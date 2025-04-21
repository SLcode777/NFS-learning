import { PrismaClient } from "@/lib/generated/client";
import { faker } from "@faker-js/faker";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

// Number of records to create
const NUM_USERS = 10;

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.verification.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("🧹 Cleared existing data");

  // Create users
  const users = [];
  for (let i = 0; i < NUM_USERS; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }),
        emailVerified: faker.datatype.boolean(0.9), // 90% chance of being verified
        image: faker.image.avatar(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
        accounts: {
          create: {
            id: randomUUID(),
            accountId: randomUUID(),
            providerId: "credentials",
            password: faker.internet.password(),
            createdAt: faker.date.past(),
            updatedAt: faker.date.recent(),
          },
        },
      },
    });
    users.push(user);
    console.log(`👤 Created user: ${user.name}`);
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
