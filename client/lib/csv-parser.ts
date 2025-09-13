// CSV parsing utilities for importing student data
export interface CSVParseResult<T> {
  data: T[]
  errors: string[]
  skipped: number
}

// Parse CSV text into array of objects
export function parseCSV(csvText: string): string[][] {
  const lines = csvText.trim().split("\n")
  const result: string[][] = []

  for (const line of lines) {
    // Simple CSV parsing - handles basic cases
    const row = line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, ""))
    result.push(row)
  }

  return result
}

// Parse student data from CSV
export function parseStudentCSV(csvText: string): CSVParseResult<any> {
  const errors: string[] = []
  const data: any[] = []
  let skipped = 0

  try {
    const rows = parseCSV(csvText)
    if (rows.length === 0) {
      errors.push("CSV file is empty")
      return { data, errors, skipped }
    }

    const headers = rows[0].map((h) => h.toLowerCase())
    const requiredFields = ["name", "email", "grade"]

    // Validate headers
    const missingFields = requiredFields.filter((field) => !headers.includes(field))
    if (missingFields.length > 0) {
      errors.push(`Missing required columns: ${missingFields.join(", ")}`)
      return { data, errors, skipped }
    }

    // Process data rows
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      if (row.length !== headers.length) {
        errors.push(`Row ${i + 1}: Column count mismatch`)
        skipped++
        continue
      }

      const student: any = {}
      headers.forEach((header, index) => {
        student[header] = row[index]
      })

      // Validate required fields
      if (!student.name || !student.email || !student.grade) {
        errors.push(`Row ${i + 1}: Missing required data`)
        skipped++
        continue
      }

      // Generate ID and set defaults
      student.id = `student_${Date.now()}_${i}`
      student.enrollmentDate = student.enrollmentdate || new Date().toISOString().split("T")[0]
      student.riskLevel = "low"
      student.riskScore = 0
      student.lastUpdated = new Date().toISOString()

      data.push(student)
    }
  } catch (error) {
    errors.push(`Parse error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }

  return { data, errors, skipped }
}

// Parse attendance data from CSV
export function parseAttendanceCSV(csvText: string): CSVParseResult<any> {
  const errors: string[] = []
  const data: any[] = []
  let skipped = 0

  try {
    const rows = parseCSV(csvText)
    if (rows.length === 0) {
      errors.push("CSV file is empty")
      return { data, errors, skipped }
    }

    const headers = rows[0].map((h) => h.toLowerCase())
    const requiredFields = ["studentid", "date", "status"]

    // Validate headers
    const missingFields = requiredFields.filter((field) => !headers.includes(field))
    if (missingFields.length > 0) {
      errors.push(`Missing required columns: ${missingFields.join(", ")}`)
      return { data, errors, skipped }
    }

    // Process data rows
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      if (row.length !== headers.length) {
        errors.push(`Row ${i + 1}: Column count mismatch`)
        skipped++
        continue
      }

      const attendance: any = {}
      headers.forEach((header, index) => {
        attendance[header] = row[index]
      })

      // Validate required fields and status values
      const validStatuses = ["present", "absent", "late", "excused"]
      if (!attendance.studentid || !attendance.date || !attendance.status) {
        errors.push(`Row ${i + 1}: Missing required data`)
        skipped++
        continue
      }

      if (!validStatuses.includes(attendance.status.toLowerCase())) {
        errors.push(`Row ${i + 1}: Invalid status '${attendance.status}'. Must be: ${validStatuses.join(", ")}`)
        skipped++
        continue
      }

      // Generate ID and normalize data
      attendance.id = `attendance_${Date.now()}_${i}`
      attendance.studentId = attendance.studentid
      attendance.status = attendance.status.toLowerCase()

      data.push(attendance)
    }
  } catch (error) {
    errors.push(`Parse error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }

  return { data, errors, skipped }
}

// Parse assessment data from CSV
export function parseAssessmentCSV(csvText: string): CSVParseResult<any> {
  const errors: string[] = []
  const data: any[] = []
  let skipped = 0

  try {
    const rows = parseCSV(csvText)
    if (rows.length === 0) {
      errors.push("CSV file is empty")
      return { data, errors, skipped }
    }

    const headers = rows[0].map((h) => h.toLowerCase())
    const requiredFields = ["studentid", "subject", "score", "maxscore", "date"]

    // Validate headers
    const missingFields = requiredFields.filter((field) => !headers.includes(field))
    if (missingFields.length > 0) {
      errors.push(`Missing required columns: ${missingFields.join(", ")}`)
      return { data, errors, skipped }
    }

    // Process data rows
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      if (row.length !== headers.length) {
        errors.push(`Row ${i + 1}: Column count mismatch`)
        skipped++
        continue
      }

      const assessment: any = {}
      headers.forEach((header, index) => {
        assessment[header] = row[index]
      })

      // Validate required fields
      if (
        !assessment.studentid ||
        !assessment.subject ||
        !assessment.score ||
        !assessment.maxscore ||
        !assessment.date
      ) {
        errors.push(`Row ${i + 1}: Missing required data`)
        skipped++
        continue
      }

      // Validate numeric fields
      const score = Number.parseFloat(assessment.score)
      const maxScore = Number.parseFloat(assessment.maxscore)

      if (isNaN(score) || isNaN(maxScore)) {
        errors.push(`Row ${i + 1}: Score and max score must be numbers`)
        skipped++
        continue
      }

      if (score < 0 || maxScore <= 0 || score > maxScore) {
        errors.push(`Row ${i + 1}: Invalid score values`)
        skipped++
        continue
      }

      // Generate ID and normalize data
      assessment.id = `assessment_${Date.now()}_${i}`
      assessment.studentId = assessment.studentid
      assessment.score = score
      assessment.maxScore = maxScore
      assessment.assessmentType = assessment.assessmenttype || "test"
      assessment.weight = Number.parseFloat(assessment.weight) || 1.0

      data.push(assessment)
    }
  } catch (error) {
    errors.push(`Parse error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }

  return { data, errors, skipped }
}
