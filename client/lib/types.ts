// Student data types for the risk assessment system
export interface Student {
  id: string
  name: string
  email: string
  grade: string
  enrollmentDate: string
  mentorId?: string
  guardianEmail?: string
  riskLevel: "low" | "medium" | "high" | "critical"
  riskScore: number
  lastUpdated: string
}

export interface AttendanceRecord {
  id: string
  studentId: string
  date: string
  status: "present" | "absent" | "late" | "excused"
  notes?: string
}

export interface AssessmentScore {
  id: string
  studentId: string
  subject: string
  assessmentType: "quiz" | "test" | "assignment" | "project"
  score: number
  maxScore: number
  date: string
  weight: number
}

export interface PaymentRecord {
  id: string
  studentId: string
  amount: number
  dueDate: string
  paidDate?: string
  status: "paid" | "overdue" | "pending"
  type: "tuition" | "fees" | "materials"
}

export interface RiskFactor {
  type: "attendance" | "academic" | "financial"
  severity: "low" | "medium" | "high" | "critical"
  description: string
  value: number
  threshold: number
}

export interface Alert {
  id: string
  studentId: string
  type: "attendance" | "academic" | "financial" | "general"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  createdAt: string
  acknowledged: boolean
  acknowledgedBy?: string
  acknowledgedAt?: string
}

export interface Mentor {
  id: string
  name: string
  email: string
  students: string[]
}

// Risk assessment configuration
export interface RiskThresholds {
  attendance: {
    critical: number // < 60%
    high: number // < 70%
    medium: number // < 80%
  }
  academic: {
    critical: number // < 50%
    high: number // < 60%
    medium: number // < 70%
  }
  financial: {
    critical: number // > 90 days overdue
    high: number // > 60 days overdue
    medium: number // > 30 days overdue
  }
}

export const riskThresholds: RiskThresholds = {
  attendance: {
    critical: 60,
    high: 70,
    medium: 80,
  },
  academic: {
    critical: 50,
    high: 60,
    medium: 70,
  },
  financial: {
    critical: 90,
    high: 60,
    medium: 30,
  },
}
