import { PrismaClient, RoleCode } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const school = await prisma.schoolProfile.upsert({
    where: { udiseCode: "01022202207" },
    update: {
      name: "Government Primary School Pethgam Wagoora",
      address: "Wagoora Babareshi Road, Near Zonal Education Office Wagoora, Pin: 193109",
      contactEmail: "pspethgam@gmail.com",
      contactPhone: "+91-9596449881"
    },
    create: {
      name: "Government Primary School Pethgam Wagoora",
      address: "Wagoora Babareshi Road, Near Zonal Education Office Wagoora, Pin: 193109",
      udiseCode: "01022202207",
      contactEmail: "pspethgam@gmail.com",
      contactPhone: "+91-9596449881"
    }
  });

  const staff = [
    { name: "Mohammad Ashraf Rather", role: RoleCode.HOI_ADMIN, email: "pspethgam@gmail.com" },
    { name: "Mohammad Iqbal Rather", role: RoleCode.TEACHER },
    { name: "Zamrooda Bano", role: RoleCode.TEACHER },
    { name: "Masrat Begum", role: RoleCode.SCHOOL_AAYA },
    { name: "Shaheena Bano", role: RoleCode.SCHOOL_COOK }
  ];

  for (const person of staff) {
    await prisma.user.upsert({
      where: { email: person.email ?? `${person.name.toLowerCase().replace(/\s+/g, ".")}@local.school` },
      update: { name: person.name, role: person.role, schoolId: school.id, active: true },
      create: {
        name: person.name,
        email: person.email ?? `${person.name.toLowerCase().replace(/\s+/g, ".")}@local.school`,
        role: person.role,
        schoolId: school.id
      }
    });
  }

  console.log(`Seeded ${school.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
