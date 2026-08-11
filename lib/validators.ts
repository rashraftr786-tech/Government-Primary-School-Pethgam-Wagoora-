import { z } from "zod";

export const studentUploadSchema = z.object({
  rollNo: z.string().trim().min(1),
  studentName: z.string().trim().min(2),
  classNo: z.coerce.number().int().min(1).max(5),
  gender: z.string().optional(),
  category: z.string().optional(),
  bplStatus: z.boolean().default(false),
  aadhaarApaarId: z.string().optional(),
  parentName: z.string().optional(),
  contactNumber: z.string().optional(),
  cwsnStatus: z.boolean().default(false)
});

export const mealLogSchema = z.object({
  date: z.string().min(10),
  attendanceHeadcount: z.number().int().min(0),
  mealsCooked: z.number().int().min(0),
  riceGrams: z.number().min(0),
  pulsesGrams: z.number().min(0),
  oilGrams: z.number().min(0),
  notes: z.string().max(500).optional()
});
