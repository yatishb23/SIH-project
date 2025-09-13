import type { Student, AttendanceRecord, AssessmentScore, PaymentRecord, Alert, Mentor } from "./types"

// Mock students data
export const mockStudents: Student[] = [
  {
    id: "1",
    name: "Emma Johnson",
    email: "emma.johnson@school.edu",
    grade: "10th",
    enrollmentDate: "2024-08-15",
    mentorId: "mentor1",
    guardianEmail: "parent.johnson@email.com",
    riskLevel: "high",
    riskScore: 75,
    lastUpdated: "2024-12-13",
  },
  {
    id: "2",
    name: "Marcus Chen",
    email: "marcus.chen@school.edu",
    grade: "11th",
    enrollmentDate: "2024-08-15",
    mentorId: "mentor1",
    guardianEmail: "chen.family@email.com",
    riskLevel: "low",
    riskScore: 25,
    lastUpdated: "2024-12-13",
  },
  {
    id: "3",
    name: "Sophia Rodriguez",
    email: "sophia.rodriguez@school.edu",
    grade: "9th",
    enrollmentDate: "2024-08-15",
    mentorId: "mentor2",
    guardianEmail: "rodriguez.home@email.com",
    riskLevel: "critical",
    riskScore: 92,
    lastUpdated: "2024-12-13",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james.wilson@school.edu",
    grade: "12th",
    enrollmentDate: "2024-08-15",
    mentorId: "mentor2",
    guardianEmail: "wilson.parents@email.com",
    riskLevel: "medium",
    riskScore: 58,
    lastUpdated: "2024-12-13",
  },
  {
    id: "5",
    name: "Aisha Patel",
    email: "aisha.patel@school.edu",
    grade: "10th",
    enrollmentDate: "2024-08-15",
    mentorId: "mentor1",
    guardianEmail: "patel.family@email.com",
    riskLevel: "low",
    riskScore: 18,
    lastUpdated: "2024-12-13",
  },
]

// Mock attendance data
export const mockAttendance: AttendanceRecord[] = [
  { id: "1", studentId: "1", date: "2024-12-09", status: "absent", notes: "Unexcused absence" },
  { id: "2", studentId: "1", date: "2024-12-10", status: "late", notes: "15 minutes late" },
  { id: "3", studentId: "1", date: "2024-12-11", status: "present" },
  { id: "4", studentId: "2", date: "2024-12-09", status: "present" },
  { id: "5", studentId: "2", date: "2024-12-10", status: "present" },
  { id: "6", studentId: "3", date: "2024-12-09", status: "absent", notes: "Family emergency" },
  { id: "7", studentId: "3", date: "2024-12-10", status: "absent", notes: "No contact" },
  { id: "8", studentId: "3", date: "2024-12-11", status: "absent", notes: "No contact" },
]

// Mock assessment scores
export const mockAssessments: AssessmentScore[] = [
  {
    id: "1",
    studentId: "1",
    subject: "Mathematics",
    assessmentType: "test",
    score: 65,
    maxScore: 100,
    date: "2024-12-05",
    weight: 0.3,
  },
  {
    id: "2",
    studentId: "1",
    subject: "English",
    assessmentType: "assignment",
    score: 78,
    maxScore: 100,
    date: "2024-12-03",
    weight: 0.2,
  },
  {
    id: "3",
    studentId: "2",
    subject: "Mathematics",
    assessmentType: "test",
    score: 92,
    maxScore: 100,
    date: "2024-12-05",
    weight: 0.3,
  },
  {
    id: "4",
    studentId: "2",
    subject: "Science",
    assessmentType: "project",
    score: 88,
    maxScore: 100,
    date: "2024-12-01",
    weight: 0.4,
  },
  {
    id: "5",
    studentId: "3",
    subject: "Mathematics",
    assessmentType: "test",
    score: 45,
    maxScore: 100,
    date: "2024-12-05",
    weight: 0.3,
  },
  {
    id: "6",
    studentId: "3",
    subject: "English",
    assessmentType: "quiz",
    score: 32,
    maxScore: 50,
    date: "2024-12-08",
    weight: 0.1,
  },
]

// Mock payment records
export const mockPayments: PaymentRecord[] = [
  { id: "1", studentId: "1", amount: 1200, dueDate: "2024-11-01", status: "overdue", type: "tuition" },
  {
    id: "2",
    studentId: "2",
    amount: 1200,
    dueDate: "2024-12-01",
    paidDate: "2024-11-28",
    status: "paid",
    type: "tuition",
  },
  { id: "3", studentId: "3", amount: 1200, dueDate: "2024-10-01", status: "overdue", type: "tuition" },
  { id: "4", studentId: "3", amount: 150, dueDate: "2024-09-15", status: "overdue", type: "materials" },
  { id: "5", studentId: "4", amount: 1200, dueDate: "2024-12-01", status: "pending", type: "tuition" },
]

// Mock alerts
export const mockAlerts: Alert[] = [
  {
    id: "1",
    studentId: "3",
    type: "attendance",
    severity: "critical",
    message: "Sophia Rodriguez has missed 3 consecutive days without contact",
    createdAt: "2024-12-11T10:00:00Z",
    acknowledged: false,
  },
  {
    id: "2",
    studentId: "1",
    type: "financial",
    severity: "high",
    message: "Emma Johnson has overdue tuition payment (42 days overdue)",
    createdAt: "2024-12-10T14:30:00Z",
    acknowledged: false,
  },
  {
    id: "3",
    studentId: "3",
    type: "academic",
    severity: "high",
    message: "Sophia Rodriguez scored below 50% on recent mathematics test",
    createdAt: "2024-12-06T09:15:00Z",
    acknowledged: true,
    acknowledgedBy: "mentor2",
    acknowledgedAt: "2024-12-06T15:20:00Z",
  },
]

// Mock mentors
export const mockMentors: Mentor[] = [
  {
    id: "mentor1",
    name: "Dr. Sarah Mitchell",
    email: "sarah.mitchell@school.edu",
    students: ["1", "2", "5"],
  },
  {
    id: "mentor2",
    name: "Prof. Michael Torres",
    email: "michael.torres@school.edu",
    students: ["3", "4"],
  },
]
