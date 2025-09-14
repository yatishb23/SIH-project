import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface StudentImport {
  id: number; // The ID from the CSV is now critical for mapping
  name: string;
  email: string;
  grade: string;
  enrollmentDate: string;
  mentorId?: number | null;
  guardianEmail?: string | null;
  teacherId: number;
}

interface AttendanceImport {
  studentId: number; // This is the ID from the CSV
  date: string;
  status: string;
  notes?: string | null;
  teacherId: number;
}

interface AssessmentImport {
  studentId: number; // This is the ID from the CSV
  subject: string;
  assessmentType?: string;
  score: number;
  maxScore: number;
  date: string;
  weight?: number | null;
  teacherId: number;
}

interface ImportRequest {
  students?: StudentImport[];
  attendance?: AttendanceImport[];
  assessments?: AssessmentImport[];
}

export async function POST(req: NextRequest) {
  try {
    const {
      students = [],
      attendance = [],
      assessments = [],
    }: ImportRequest = await req.json();

    // Use an interactive transaction to handle dependent operations
    const result = await prisma.$transaction(async (tx) => {
      const studentIdMap = new Map<number, number>(); // Map from csv_id -> db_id
      let processedCount = 0;

      // --- 1. Process Students and Create ID Map ---
      for (const student of students) {
        if (!student.email || !student.teacherId || !student.id) continue;

        const createdOrUpdatedStudent = await tx.student.upsert({
          where: { email: student.email },
          update: {
            name: student.name,
            grade: student.grade,
            enrollmentDate: new Date(student.enrollmentDate),
            teacherId: student.teacherId,
          },
          create: {
            name: student.name,
            email: student.email,
            grade: student.grade,
            enrollmentDate: new Date(student.enrollmentDate),
            teacher: { connect: { id: student.teacherId } },
          },
        });
        // Store the mapping from the CSV ID to the actual new database ID
        studentIdMap.set(student.id, createdOrUpdatedStudent.id);
        processedCount++;
      }

      // --- 2. Process Attendance using the ID Map ---
      for (const record of attendance) {
        const dbStudentId = studentIdMap.get(record.studentId);
        if (!dbStudentId || !record.date || !record.teacherId) continue;

        const recordDate = new Date(record.date);
        await tx.attendance.upsert({
          where: { studentDate: { studentId: dbStudentId, date: recordDate } },
          update: { status: record.status, notes: record.notes },
          create: {
            studentId: dbStudentId,
            teacherId: record.teacherId,
            date: recordDate,
            status: record.status,
            notes: record.notes,
          },
        });
        processedCount++;
      }

      // --- 3. Process Assessments using the ID Map ---
      for (const test of assessments) {
        const dbStudentId = studentIdMap.get(test.studentId);
        if (!dbStudentId || !test.subject || !test.date || !test.teacherId) continue;

        const testDate = new Date(test.date);
        await tx.assessment.upsert({
          where: { studentId_subject_date: { studentId: dbStudentId, subject: test.subject, date: testDate } },
          update: { score: test.score, maxScore: test.maxScore },
          create: {
            studentId: dbStudentId,
            teacherId: test.teacherId,
            subject: test.subject,
            assessmentType: test.assessmentType ?? "General",
            score: test.score,
            maxScore: test.maxScore,
            date: testDate,
            weight: test.weight,
          },
        });
        processedCount++;
      }
      
      return { processedCount };
    });

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${result.processedCount} records.`,
      importedCount: result.processedCount,
    });

  } catch (error) {
    console.error("Data import transaction failed:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: errorMessage },
      { status: 500 }
    );
  }
}