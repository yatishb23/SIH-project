import { type RiskFactor, riskThresholds } from "./types"
import { mockAttendance, mockAssessments, mockPayments } from "./mock-data"

// Calculate attendance percentage for a student
export function calculateAttendanceRate(studentId: string, days = 30): number {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  const studentAttendance = mockAttendance.filter(
    (record) => record.studentId === studentId && new Date(record.date) >= cutoffDate,
  )

  if (studentAttendance.length === 0) return 100

  const presentDays = studentAttendance.filter(
    (record) => record.status === "present" || record.status === "late",
  ).length

  return (presentDays / studentAttendance.length) * 100
}

// Calculate academic performance average
export function calculateAcademicPerformance(studentId: string): number {
  const studentAssessments = mockAssessments.filter((assessment) => assessment.studentId === studentId)

  if (studentAssessments.length === 0) return 100

  const weightedSum = studentAssessments.reduce((sum, assessment) => {
    const percentage = (assessment.score / assessment.maxScore) * 100
    return sum + percentage * assessment.weight
  }, 0)

  const totalWeight = studentAssessments.reduce((sum, assessment) => sum + assessment.weight, 0)

  return totalWeight > 0 ? weightedSum / totalWeight : 100
}

// Calculate days overdue for payments
export function calculatePaymentOverdue(studentId: string): number {
  const overduePayments = mockPayments.filter(
    (payment) => payment.studentId === studentId && payment.status === "overdue",
  )

  if (overduePayments.length === 0) return 0

  const maxOverdue = Math.max(
    ...overduePayments.map((payment) => {
      const dueDate = new Date(payment.dueDate)
      const today = new Date()
      return Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
    }),
  )

  return maxOverdue
}

// Assess risk factors for a student
export function assessRiskFactors(studentId: string): RiskFactor[] {
  const factors: RiskFactor[] = []

  // Attendance risk
  const attendanceRate = calculateAttendanceRate(studentId)
  let attendanceSeverity: "low" | "medium" | "high" | "critical" = "low"

  if (attendanceRate < riskThresholds.attendance.critical) {
    attendanceSeverity = "critical"
  } else if (attendanceRate < riskThresholds.attendance.high) {
    attendanceSeverity = "high"
  } else if (attendanceRate < riskThresholds.attendance.medium) {
    attendanceSeverity = "medium"
  }

  factors.push({
    type: "attendance",
    severity: attendanceSeverity,
    description: `Attendance rate: ${attendanceRate.toFixed(1)}%`,
    value: attendanceRate,
    threshold: riskThresholds.attendance.medium,
  })

  // Academic risk
  const academicPerformance = calculateAcademicPerformance(studentId)
  let academicSeverity: "low" | "medium" | "high" | "critical" = "low"

  if (academicPerformance < riskThresholds.academic.critical) {
    academicSeverity = "critical"
  } else if (academicPerformance < riskThresholds.academic.high) {
    academicSeverity = "high"
  } else if (academicPerformance < riskThresholds.academic.medium) {
    academicSeverity = "medium"
  }

  factors.push({
    type: "academic",
    severity: academicSeverity,
    description: `Academic average: ${academicPerformance.toFixed(1)}%`,
    value: academicPerformance,
    threshold: riskThresholds.academic.medium,
  })

  // Financial risk
  const daysOverdue = calculatePaymentOverdue(studentId)
  let financialSeverity: "low" | "medium" | "high" | "critical" = "low"

  if (daysOverdue > riskThresholds.financial.critical) {
    financialSeverity = "critical"
  } else if (daysOverdue > riskThresholds.financial.high) {
    financialSeverity = "high"
  } else if (daysOverdue > riskThresholds.financial.medium) {
    financialSeverity = "medium"
  }

  factors.push({
    type: "financial",
    severity: financialSeverity,
    description: daysOverdue > 0 ? `Payment overdue: ${daysOverdue} days` : "Payments up to date",
    value: daysOverdue,
    threshold: riskThresholds.financial.medium,
  })

  return factors
}

// Calculate overall risk score (0-100)
export function calculateRiskScore(studentId: string): number {
  const factors = assessRiskFactors(studentId)

  const severityWeights = {
    low: 0,
    medium: 25,
    high: 50,
    critical: 100,
  }

  const typeWeights = {
    attendance: 0.4,
    academic: 0.4,
    financial: 0.2,
  }

  const weightedScore = factors.reduce((score, factor) => {
    return score + severityWeights[factor.severity] * typeWeights[factor.type]
  }, 0)

  return Math.min(100, Math.max(0, weightedScore))
}

// Determine risk level from score
export function getRiskLevel(score: number): "low" | "medium" | "high" | "critical" {
  if (score >= 80) return "critical"
  if (score >= 60) return "high"
  if (score >= 30) return "medium"
  return "low"
}
