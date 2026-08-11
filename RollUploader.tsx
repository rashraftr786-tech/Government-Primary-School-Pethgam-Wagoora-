"use client";

import { ChangeEvent, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { AlertCircle, CheckCircle2, FileSpreadsheet, UploadCloud } from "lucide-react";
import { queueMutation } from "@/lib/offlineQueue";

type StudentRow = {
  rollNo: string;
  studentName: string;
  classNo: number;
  gender?: string;
  category?: string;
  bplStatus: boolean;
  aadhaarApaarId?: string;
  parentName?: string;
  contactNumber?: string;
  cwsnStatus: boolean;
};

type ErrorRow = { row: number; message: string };

const aliases: Record<string, keyof StudentRow> = {
  roll_no: "rollNo", rollno: "rollNo",
  student_name: "studentName", studentname: "studentName",
  class: "classNo", class_no: "classNo", classno: "classNo",
  gender: "gender", category: "category", bpl_status: "bplStatus", bplstatus: "bplStatus",
  aadhaar_apaar_id: "aadhaarApaarId", aadhaarapaarid: "aadhaarApaarId",
  parent_name: "parentName", parentname: "parentName",
  contact_number: "contactNumber", contactnumber: "contactNumber",
  cwsn_status: "cwsnStatus", cwsnstatus: "cwsnStatus"
};

function normalizeBoolean(value: unknown) {
  return ["yes", "y", "true", "1", "present"].includes(String(value ?? "").trim().toLowerCase());
}

function normalizeHeader(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, "_");
}

function parseRows(rawRows: Record<string, unknown>[]) {
  const errors: ErrorRow[] = [];
  const valid: StudentRow[] = [];
  const seen = new Set<string>();

  rawRows.forEach((raw, index) => {
    const normalized: Record<string, unknown> = {};
    Object.entries(raw).forEach(([key, value]) => {
      const mapped = aliases[normalizeHeader(key)];
      if (mapped) normalized[mapped] = value;
    });

    const rowNumber = index + 2;
    const rollNo = String(normalized.rollNo ?? "").trim();
    const studentName = String(normalized.studentName ?? "").trim();
    const classNo = Number(normalized.classNo);

    if (!rollNo || !studentName || !Number.isInteger(classNo) || classNo < 1 || classNo > 5) {
      errors.push({ row: rowNumber, message: "Roll No, Student Name and Class (1–5) are required." });
      return;
    }

    const key = `${classNo}:${rollNo}`;
    if (seen.has(key)) {
      errors.push({ row: rowNumber, message: `Duplicate Roll No ${rollNo} in Class ${classNo}.` });
      return;
    }
    seen.add(key);

    valid.push({
      rollNo,
      studentName,
      classNo,
      gender: String(normalized.gender ?? "").trim() || undefined,
      category: String(normalized.category ?? "").trim() || undefined,
      bplStatus: normalizeBoolean(normalized.bplStatus),
      aadhaarApaarId: String(normalized.aadhaarApaarId ?? "").trim() || undefined,
      parentName: String(normalized.parentName ?? "").trim() || undefined,
      contactNumber: String(normalized.contactNumber ?? "").trim() || undefined,
      cwsnStatus: normalizeBoolean(normalized.cwsnStatus)
    });
  });

  return { valid, errors };
}

export default function RollUploader() {
  const [rows, setRows] = useState<StudentRow[]>([]);
  const [errors, setErrors] = useState<ErrorRow[]>([]);
  const [status, setStatus] = useState("");

  const counts = useMemo(() => {
    const result: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    rows.forEach(r => { result[r.classNo] += 1; });
    return result;
  }, [rows]);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let raw: Record<string, unknown>[] = [];
      if (file.name.toLowerCase().endsWith(".csv")) {
        const text = await file.text();
        const parsed = Papa.parse<Record<string, unknown>>(text, { header: true, skipEmptyLines: true });
        if (parsed.errors.length) throw new Error(parsed.errors[0].message);
        raw = parsed.data;
      } else {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
      }

      const result = parseRows(raw);
      setRows(result.valid);
      setErrors(result.errors);
      setStatus(`Validated ${result.valid.length} students. ${result.errors.length} row(s) need correction.`);
    } catch (error) {
      setRows([]);
      setErrors([{ row: 1, message: error instanceof Error ? error.message : "Unable to read file." }]);
      setStatus("Upload failed.");
    }
  }

  async function saveRows() {
    if (!rows.length) return;
    const payload = { students: rows };
    setStatus("Saving…");
    try {
      const response = await fetch("/api/students/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(await response.text());
      setStatus(`Saved ${rows.length} students successfully.`);
    } catch {
      await queueMutation({
        endpoint: "/api/students/bulk",
        method: "POST",
        body: payload,
        createdAt: new Date().toISOString()
      });
      setStatus("Offline: students queued locally and will sync when connection returns.");
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-school-600">MODULE A</p>
        <h2 className="text-2xl font-bold">Dynamic Student Roll</h2>
        <p className="mt-1 text-sm text-slate-500">Upload XLSX or CSV, validate rows, then commit the clean dataset.</p>
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-center hover:border-school-600">
        <UploadCloud className="mb-3 text-school-600" size={32} />
        <span className="font-semibold">Choose Student Roll .xlsx or .csv</span>
        <span className="mt-1 text-xs text-slate-500">Columns: Roll_No, Student_Name, Class, Gender, Category, BPL_Status, Aadhaar_APAAR_ID, Parent_Name, Contact_Number, CWSN_Status</span>
        <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFile} />
      </label>

      {status && <div className="rounded-lg bg-slate-100 px-4 py-3 text-sm">{status}</div>}

      <div className="grid grid-cols-5 gap-2">
        {Object.entries(counts).map(([classNo, count]) => (
          <div key={classNo} className="rounded-lg border bg-white p-3 text-center">
            <div className="text-xs text-slate-500">Class {classNo}</div>
            <div className="text-xl font-bold">{count}</div>
          </div>
        ))}
      </div>

      {errors.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <div className="flex items-center gap-2 font-bold text-rose-800"><AlertCircle size={18} /> Validation errors</div>
          <div className="mt-2 max-h-48 overflow-auto text-sm text-rose-700">
            {errors.map(e => <div key={`${e.row}-${e.message}`}>Row {e.row}: {e.message}</div>)}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button disabled={!rows.length} onClick={() => void saveRows()} className="inline-flex items-center gap-2 rounded-lg bg-school-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
          <CheckCircle2 size={17} /> Save Valid Rows
        </button>
        <div className="text-sm text-slate-500"><FileSpreadsheet className="mr-1 inline" size={16} /> {rows.length} valid rows</div>
      </div>

      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr><th className="px-3 py-3">Roll</th><th className="px-3 py-3">Student</th><th className="px-3 py-3">Class</th><th className="px-3 py-3">Gender</th><th className="px-3 py-3">Category</th></tr>
            </thead>
            <tbody className="divide-y">
              {rows.slice(0, 100).map(r => (
                <tr key={`${r.classNo}-${r.rollNo}`}>
                  <td className="px-3 py-2">{r.rollNo}</td><td className="px-3 py-2 font-medium">{r.studentName}</td><td className="px-3 py-2">{r.classNo}</td><td className="px-3 py-2">{r.gender || "—"}</td><td className="px-3 py-2">{r.category || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
