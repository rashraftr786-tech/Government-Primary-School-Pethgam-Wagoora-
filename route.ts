import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const school = await prisma.schoolProfile.findUnique({ where: { udiseCode: "01022202207" } });
    if (!school) return NextResponse.json({ error: "School not seeded." }, { status: 404 });

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const [totalStudents, presentStudents, staffTotal, staffPresent, meal] = await Promise.all([
      prisma.student.count({ where: { schoolId: school.id, active: true } }),
      prisma.attendance.count({ where: { schoolId: school.id, date: { gte: start, lt: end }, status: "PRESENT", studentId: { not: null } } }),
      prisma.user.count({ where: { schoolId: school.id, active: true } }),
      prisma.attendance.count({ where: { schoolId: school.id, date: { gte: start, lt: end }, status: "PRESENT", userId: { not: null } } }),
      prisma.mealLog.findUnique({ where: { schoolId_date: { schoolId: school.id, date: start } } })
    ]);

    return NextResponse.json({
      totalStudents,
      presentStudents,
      staffTotal,
      staffPresent,
      mdmCount: meal?.attendanceHeadcount ?? 0
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Dashboard query failed." }, { status: 500 });
  }
}
