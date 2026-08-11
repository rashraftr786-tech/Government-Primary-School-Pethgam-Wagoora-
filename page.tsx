import { prisma } from "@/lib/prisma";

export default async function RollStatementPage() {
  const school = await prisma.schoolProfile.findUnique({
    where: { udiseCode: "01022202207" },
    include: { students: { where: { active: true }, orderBy: [{ classNo: "asc" }, { rollNo: "asc" }] } }
  });

  if (!school) return <div className="p-8">School data not found.</div>;

  return (
    <main className="mx-auto max-w-5xl bg-white p-6 print:p-0">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold">{school.name}</h1>
        <p>{school.address}</p>
        <p className="font-semibold">UDISE: {school.udiseCode}</p>
        <h2 className="mt-4 text-lg font-bold underline">STUDENT ROLL STATEMENT</h2>
      </div>
      <table className="w-full border-collapse border text-sm">
        <thead><tr className="bg-slate-100"><th className="border p-2">S.No.</th><th className="border p-2">Class</th><th className="border p-2">Roll No.</th><th className="border p-2">Student Name</th><th className="border p-2">Gender</th><th className="border p-2">Category</th></tr></thead>
        <tbody>{school.students.map((s, i) => <tr key={s.id}><td className="border p-2">{i + 1}</td><td className="border p-2">{s.classNo}</td><td className="border p-2">{s.rollNo}</td><td className="border p-2">{s.studentName}</td><td className="border p-2">{s.gender ?? ""}</td><td className="border p-2">{s.category ?? ""}</td></tr>)}</tbody>
      </table>
      <div className="mt-16 flex justify-end">
        <div className="text-center">
          <div className="font-semibold">Mohammad Ashraf Rather</div>
          <div>Head of Institution</div>
        </div>
      </div>
    </main>
  );
}
