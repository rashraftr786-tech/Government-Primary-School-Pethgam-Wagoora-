export type AppRole = "HOI_ADMIN" | "TEACHER" | "SCHOOL_AAYA" | "SCHOOL_COOK";

export type Permission =
  | "dashboard.read"
  | "students.read"
  | "students.write"
  | "attendance.read"
  | "attendance.write"
  | "grades.read"
  | "grades.write"
  | "poshan.read"
  | "poshan.write"
  | "schemes.read"
  | "schemes.write"
  | "staff.write"
  | "reports.approve"
  | "logs.manage";

const permissions: Record<AppRole, Permission[]> = {
  HOI_ADMIN: [
    "dashboard.read", "students.read", "students.write", "attendance.read",
    "attendance.write", "grades.read", "grades.write", "poshan.read",
    "poshan.write", "schemes.read", "schemes.write", "staff.write",
    "reports.approve", "logs.manage"
  ],
  TEACHER: [
    "dashboard.read", "students.read", "attendance.read", "attendance.write",
    "grades.read", "grades.write", "schemes.read", "schemes.write"
  ],
  SCHOOL_AAYA: ["dashboard.read", "attendance.read"],
  SCHOOL_COOK: ["dashboard.read", "poshan.read", "poshan.write"]
};

export function can(role: AppRole, permission: Permission) {
  return permissions[role]?.includes(permission) ?? false;
}
