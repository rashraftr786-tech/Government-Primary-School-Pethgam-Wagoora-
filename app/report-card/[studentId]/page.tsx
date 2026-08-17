import { prisma } from "@/lib/prisma";

export default async function ReportCardPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      grades: {
        orderBy: [
          { subject: "asc" },
          { term: "asc" },
        ],
      },
      school: true,
    },
  });

  if (!student) {
    return <div className="p-8">Student not found.</div>;
  }

  return (
    <main className="mx-auto max-w-3xl bg-white p-8 print:p-4">
      <header className="border-b-2 pb-4 text-center">
        <h1 className="text-xl font-bold">
          {student.school?.name ??
            "Government Primary School Pethgam Wagoora"}
        </h1>

        <p className="text-sm">
          UDISE: {student.school?.udiseCode ?? "01022202207"}
        </p>

        <h2 className="mt-3 text-lg font-bold">
          STUDENT REPORT CARD
        </h2>
      </header>

      <section className="my-5 grid grid-cols-2 gap-2 rounded-lg border p-4 text-sm">
        <div>
          <b>Name:</b> {student.name}
        </div>

        <div>
          <b>Roll No.:</b> {student.rollNo}
        </div>

        <div>
          <b>Class:</b> {student.classLevel}
        </div>

        <div>
          <b>Category:</b> {student.category ?? "—"}
        </div>
      </section>

      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-slate-100">
            <th className="border p-2 text-left">Subject</th>
            <th className="border p-2">Term</th>
            <th className="border p-2">Marks</th>
            <th className="border p-2">Max Marks</th>
          </tr>
        </thead>

        <tbody>
          {student.grades.map((grade) => (
            <tr key={grade.id}>
              <td className="border p-2">
                {grade.subject}
              </td>

              <td className="border p-2 text-center">
                {grade.term}
              </td>

              <td className="border p-2 text-center">
                {grade.marks}
              </td>

              <td className="border p-2 text-center">
                {grade.maxMarks}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-20 flex justify-end">
        <div className="text-center">
          <div className="font-semibold">
            Mohammad Ashraf Rather
          </div>
          <div>Head of Institution</div>
        </div>
      </div>
    </main>
  );
}

