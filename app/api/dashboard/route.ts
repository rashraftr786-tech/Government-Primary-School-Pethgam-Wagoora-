import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const school = await prisma.schoolProfile.findFirst();

    if (!school) {
      return NextResponse.json({
        totalStudents: 0,
        presentStudents: 0,
        staffTotal: 5,
        staffPresent: 5,
        mdmCount: 0,
      });
    }

    const totalStudents = await prisma.student.count({
      where: { schoolId: school.id },
    });

    const presentStudents = await prisma.attendance.count({
      where: {
        present: true,
        student: { schoolId: school.id },
      },
    });

    const staffTotal = await prisma.user.count({
      where: { schoolId: school.id },
    });

    const staffPresent = await prisma.staffAttendance.count({
      where: { present: true },
    });

    const todayMeal = await prisma.mealLog.findFirst({
      where: { schoolId: school.id },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({
      totalStudents,
      presentStudents,
      staffTotal,
      staffPresent,
      mdmCount: todayMeal?.studentsFed ?? 0,
    });
  } catch (error) {
    console.error("Dashboard route error:", error);
    return NextResponse.json(
      { error: "Dashboard query failed" },
      { status: 500 }
    );
  }
}

