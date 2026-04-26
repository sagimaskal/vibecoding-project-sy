import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./dev.db"
    }
  }
});

async function main() {
  console.log("Seeding degree data...");

  // 1. Create the combined Degree
  const degree = await prisma.degree.create({
    data: {
      name: "Economics + Business Administration",
      totalCredits: 124,
    },
  });

  // --- Business Administration (60 credits) ---
  const baMandatory = await prisma.requirementCategory.create({
    data: {
      name: "BA - Mandatory",
      requiredCredits: 27,
      degreeId: degree.id,
    },
  });

  const baElective = await prisma.requirementCategory.create({
    data: {
      name: "BA - Elective",
      requiredCredits: 17,
      degreeId: degree.id,
    },
  });

  const baRestricted = await prisma.requirementCategory.create({
    data: {
      name: "BA - Restricted Elective",
      requiredCredits: 8,
      degreeId: degree.id,
    },
  });

  const baResearch = await prisma.requirementCategory.create({
    data: {
      name: "BA - Research",
      requiredCredits: 4,
      degreeId: degree.id,
    },
  });

  const baCornerstone = await prisma.requirementCategory.create({
    data: {
      name: "BA - Cornerstone",
      requiredCredits: 4,
      degreeId: degree.id,
    },
  });

  // --- Economics (64 credits) ---
  const econMandatory = await prisma.requirementCategory.create({
    data: {
      name: "Econ - Mandatory",
      requiredCredits: 40,
      degreeId: degree.id,
    },
  });

  const econElective = await prisma.requirementCategory.create({
    data: {
      name: "Econ - Elective",
      requiredCredits: 8,
      degreeId: degree.id,
    },
  });

  const econCore = await prisma.requirementCategory.create({
    data: {
      name: "Econ - Core",
      requiredCredits: 8,
      degreeId: degree.id,
    },
  });

  const econResearch = await prisma.requirementCategory.create({
    data: {
      name: "Econ - Research",
      requiredCredits: 4,
      degreeId: degree.id,
    },
  });

  const econCornerstone = await prisma.requirementCategory.create({
    data: {
      name: "Econ - Cornerstone",
      requiredCredits: 4,
      degreeId: degree.id,
    },
  });

  // --- Create Mock Courses & Link them ---
  // BA Mandatory
  for (let i = 1; i <= 9; i++) {
    await prisma.course.create({
      data: {
        code: `BA_MAND_${i}`,
        name: `BA Mandatory Course ${i}`,
        credits: 3,
        categories: { connect: { id: baMandatory.id } },
      },
    });
  }

  // Econ Mandatory
  for (let i = 1; i <= 10; i++) {
    await prisma.course.create({
      data: {
        code: `ECON_MAND_${i}`,
        name: `Econ Mandatory Course ${i}`,
        credits: 4,
        categories: { connect: { id: econMandatory.id } },
      },
    });
  }

  // Add some electives to the pools
  await prisma.course.create({
    data: {
      code: "BA_ELEC_1",
      name: "Marketing Management",
      credits: 4,
      categories: { connect: { id: baElective.id } },
    },
  });

  await prisma.course.create({
    data: {
      code: "ECON_CORE_1",
      name: "Macroeconomics III",
      credits: 4,
      categories: { connect: { id: econCore.id } },
    },
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
