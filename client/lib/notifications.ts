// Notification system for sending alerts to mentors and guardians
export interface NotificationTemplate {
  id: string
  name: string
  subject: string
  body: string
  type: "email" | "sms"
  triggers: string[]
}

export interface NotificationSchedule {
  id: string
  studentId: string
  recipientType: "mentor" | "guardian" | "both"
  frequency: "immediate" | "daily" | "weekly"
  enabled: boolean
  lastSent?: string
  nextSend?: string
}

export interface NotificationLog {
  id: string
  studentId: string
  recipientEmail: string
  recipientType: "mentor" | "guardian"
  templateId: string
  sentAt: string
  status: "sent" | "failed" | "pending"
  errorMessage?: string
}

// Default notification templates
export const defaultTemplates: NotificationTemplate[] = [
  {
    id: "critical_risk_alert",
    name: "Critical Risk Alert",
    subject: "URGENT: {{studentName}} requires immediate attention",
    body: `Dear {{recipientName}},

This is an urgent notification regarding {{studentName}} ({{studentGrade}}).

Our early warning system has identified critical risk factors that require immediate intervention:

{{riskFactors}}

Current Risk Score: {{riskScore}}/100

Recommended Actions:
- Schedule an immediate meeting with the student
- Contact the student's guardian if you haven't already
- Review recent attendance and academic performance
- Consider additional support resources

Please acknowledge this alert and take appropriate action within 24 hours.

Best regards,
EduWatch Alert System`,
    type: "email",
    triggers: ["critical_risk", "multiple_absences", "failing_grades"],
  },
  {
    id: "high_risk_warning",
    name: "High Risk Warning",
    subject: "Action Required: {{studentName}} showing warning signs",
    body: `Dear {{recipientName}},

We wanted to alert you that {{studentName}} ({{studentGrade}}) is showing warning signs that may indicate they are at risk.

Risk Factors Identified:
{{riskFactors}}

Current Risk Score: {{riskScore}}/100

We recommend:
- Scheduling a check-in meeting within 48 hours
- Reviewing their recent performance and attendance
- Offering additional support or resources as needed

Early intervention can make a significant difference in student outcomes.

Best regards,
EduWatch Alert System`,
    type: "email",
    triggers: ["high_risk", "declining_performance", "attendance_issues"],
  },
  {
    id: "weekly_summary",
    name: "Weekly Risk Summary",
    subject: "Weekly Student Risk Summary - {{date}}",
    body: `Dear {{recipientName}},

Here's your weekly summary of student risk assessments:

Students Under Your Mentorship:
{{studentSummary}}

Key Concerns This Week:
{{weeklyConcerns}}

Students Showing Improvement:
{{improvements}}

Please review these updates and take appropriate action where needed.

Best regards,
EduWatch Alert System`,
    type: "email",
    triggers: ["weekly_summary"],
  },
  {
    id: "payment_overdue",
    name: "Payment Overdue Alert",
    subject: "Payment Overdue: {{studentName}}",
    body: "Dear {{recipientName}},\n\nThis is to inform you that {{studentName}} has overdue payments that may affect their enrollment status.\n\nPayment Details:\n- Amount Due: ${{amount}}\n- Days Overdue: {{daysOverdue}}\n- Payment Type: {{paymentType}}\n\nPlease contact the finance office to resolve this matter promptly.\n\nBest regards,\nEduWatch Alert System",
    type: "email",
    triggers: ["payment_overdue"],
  },
]

// Mock notification logs
export const mockNotificationLogs: NotificationLog[] = [
  {
    id: "1",
    studentId: "3",
    recipientEmail: "michael.torres@school.edu",
    recipientType: "mentor",
    templateId: "critical_risk_alert",
    sentAt: "2024-12-11T10:30:00Z",
    status: "sent",
  },
  {
    id: "2",
    studentId: "3",
    recipientEmail: "rodriguez.home@email.com",
    recipientType: "guardian",
    templateId: "critical_risk_alert",
    sentAt: "2024-12-11T10:31:00Z",
    status: "sent",
  },
  {
    id: "3",
    studentId: "1",
    recipientEmail: "sarah.mitchell@school.edu",
    recipientType: "mentor",
    templateId: "high_risk_warning",
    sentAt: "2024-12-10T15:00:00Z",
    status: "sent",
  },
]

// Template variable replacement
export function processTemplate(template: NotificationTemplate, variables: Record<string, string>): string {
  let processed = template.body

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, "g")
    processed = processed.replace(regex, value)
  })

  return processed
}

// Generate notification variables for a student
export function generateNotificationVariables(
  studentId: string,
  recipientName: string,
  riskFactors: string[],
  riskScore: number,
  additionalData?: {
    amount?: string
    daysOverdue?: string
    paymentType?: string
  },
): Record<string, string> {
  // In a real app, you'd fetch this data from your database
  const student = { name: "Student Name", grade: "10th", email: "student@school.edu" }

  const amount = additionalData?.amount || "0"
  const daysOverdue = additionalData?.daysOverdue || "0"
  const paymentType = additionalData?.paymentType || "N/A"

  return {
    studentName: student.name,
    studentGrade: student.grade,
    studentEmail: student.email,
    recipientName,
    riskFactors: riskFactors.join("\n- "),
    riskScore: riskScore.toString(),
    date: new Date().toLocaleDateString(),
    amount,
    daysOverdue,
    paymentType,
  }
}

// Simulate sending notification
export async function sendNotification(
  templateId: string,
  recipientEmail: string,
  variables: Record<string, string>,
): Promise<{ success: boolean; error?: string }> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simulate occasional failures
  if (Math.random() < 0.1) {
    return { success: false, error: "Failed to send email" }
  }

  console.log(`[v0] Notification sent to ${recipientEmail}`)
  return { success: true }
}
