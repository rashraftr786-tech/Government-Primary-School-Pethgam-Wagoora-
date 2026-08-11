import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mealLogSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const school = await prisma.schoolProfile.findUnique({ where: { udiseCode: "01022202207" } });
    if (!school) return NextResponse.json({ error: "School not found." }, { status: 404 });

    const body = mealLogSchema.parse(await request.json());
    const date = new Date(`${body.date}T00:00:00`);

    const cook = await prisma.user.findFirst({
      where: { schoolId: school.id, role: "SCHOOL_COOK", active: true }
    });
    if (!cook) return NextResponse.json({ error: "Cook account not found." }, { status: 404 });

    const meal = await prisma.mealLog.upsert({
      where: { schoolId_date: { schoolId: school.id, date } },
      update: {
        attendanceHeadcount: body.attendanceHeadcount,
        mealsCooked: body.mealsCooked,
        riceGrams: body.riceGrams,
        pulsesGrams: body.pulsesGrams,
        oilGrams: body.oilGrams,
        notes: body.notes,
        recordedById: cook.id
      },
      create: {
        schoolId: school.id,
        date,
        attendanceHeadcount: body.attendanceHeadcount,
        mealsCooked: body.mealsCooked,
        riceGrams: body.riceGrams,
        pulsesGrams: body.pulsesGrams,
        oilGrams: body.oilGrams,
        notes: body.notes,
        recordedById: cook.id
      }
    });

    return NextResponse.json(meal);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Meal log validation/save failed." }, { status: 400 });
  }
}
