import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const rowSchema = z.object({
  rollNo: z.string().min(1),
  studentName: z.string().min(2),
  classNo: z.number().int().min(1).max(5),
  gender: z.string().optional(),
  category: z.string().optional(),
  bplStatus: z.boolean(),
  aadhaarApaarId: z.string().optional(),
  parentName: z.string().optional(),
  contactNumber: z.string().optional(),
  cwsnStatus: z.boolean()
});

const payloadSchema = z.object({ students: z.array(rowSchema).min(1).max(5000) });

export async function POST(request: Request) {
  try {
    const school = await prisma.schoolProfile.findUnique({ where: { udiseCode: "01022202207" } });
    if (!school) return NextResponse.json({ error: "School not found." }, { status: 404 });

    const body = payloadSchema.parse(await request.json());

    let saved = 0;
    for (const student of body.students) {
      await prisma.student.upsert({
        where: { schoolId_classNo_rollNo: { schoolId: school.id, classNo: student.classNo, rollNo: student.rollNo } },
        update: {
          studentName: student.studentName,
          gender: mapGender(student.gender),
          category: mapCategory(student.category),
          bplStatus: student.bplStatus,
          aadhaarApaarId: student.aadhaarApaarId,
          parentName: student.parentName,
          contactNumber: student.contactNumber,
          cwsnStatus: student.cwsnStatus,
          active: true
        },
        create: {
          schoolId: school.id,
          rollNo: student.rollNo,
          studentName: student.studentName,
          classNo: student.classNo,
          gender: mapGender(student.gender),
          category: mapCategory(student.category),
          bplStatus: student.bplStatus,
          aadhaarApaarId: student.aadhaarApaarId,
          parentName: student.parentName,
          contactNumber: student.contactNumber,
          cwsnStatus: student.cwsnStatus
        }
      });
      saved++;
    }

    return NextResponse.json({ saved });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.flatten() }, { status: 400 });
    console.error(error);
    return NextResponse.json({ error: "Bulk upload failed." }, { status: 500 });
  }
}

function mapGender(value?: string) {
  const v = value?.trim().toUpperCase();
  return v === "MALE" || v === "M" ? "MALE" : v === "FEMALE" || v === "F" ? "FEMALE" : v === "OTHER" ? "OTHER" : undefined;
}

function mapCategory(value?: string) {
  const v = value?.trim().toUpperCase();
  return v === "ST" ? "ST" : v === "SC" ? "SC" : v === "OBC" ? "OBC" : v === "GENERAL" ? "GENERAL" : undefined;
}
