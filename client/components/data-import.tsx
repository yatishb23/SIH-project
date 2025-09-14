"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, AlertCircle, CheckCircle, X, Loader2 } from "lucide-react"
import { parseStudentCSV, parseAttendanceCSV, parseAssessmentCSV } from "@/lib/csv-parser"
import { useAuth } from "@/hooks/use-auth"

interface ApiResult {
  success: boolean;
  message: string;
  error?: string;
  importedCount?: number;
}

export function DataImport() {
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ApiResult | null>(null)
  const [activeTab, setActiveTab] = useState("students")
  const { user } = useAuth()

  const [studentsData, setStudentsData] = useState<any[]>([])
  const [attendanceData, setAttendanceData] = useState<any[]>([])
  const [assessmentsData, setAssessmentsData] = useState<any[]>([])
  const [fileErrors, setFileErrors] = useState<string[]>([])

  const expectedHeaders: Record<string, string[]> = {
    students: ["id", "name", "email", "grade", "enrollmentDate", "mentorId", "guardianEmail"],
    attendance: ["id", "studentId", "date", "status", "notes"],
    assessments: ["id", "studentId", "subject", "assessmentType", "score", "maxScore", "date", "weight"],
  }

  // This function remains the same as your version
  const handleFileChange = async (file: File, type: "students" | "attendance" | "assessments") => {
    setResult(null);
    setFileErrors([]);
    const text = await file.text();
    let parseResult;

    const headers = text.split('\n')[0].trim().split(',').map(h => h.replace(/"/g, ''));
    const missingHeaders = expectedHeaders[type].filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      setFileErrors([`Invalid file for ${type}. Missing headers: ${missingHeaders.join(", ")}`]);
      return;
    }

    switch (type) {
      case "students":
        parseResult = parseStudentCSV(text);
        setStudentsData(parseResult.data);
        break;
      case "attendance":
        parseResult = parseAttendanceCSV(text);
        setAttendanceData(parseResult.data);
        break;
      case "assessments":
        parseResult = parseAssessmentCSV(text);
        setAssessmentsData(parseResult.data);
        break;
    }
    
    if (parseResult.errors.length > 0) {
      setFileErrors(parseResult.errors.map((e: any) => `Error in ${type} file: ${e.message} on row ${e.row}`));
    }
  }

  const handleSubmit = async () => {
    if (!user?.id) {
        setResult({ success: false, message: "You must be logged in to import data." });
        return;
    }
    setImporting(true);
    setResult(null);

    try {
      // *** KEY CHANGE IS HERE: Ensure all IDs are numbers ***
      const payload = {
        students: studentsData.map((s) => ({
          ...s,
          id: parseInt(s.id, 10), // Ensure CSV ID is a number
          teacherId: user.id,
        })),
        attendance: attendanceData.map((a) => ({
          ...a,
          studentId: parseInt(a.studentId, 10), // Ensure studentId is a number
          teacherId: user.id,
        })),
        assessments: assessmentsData.map((a) => ({
          ...a,
          studentId: parseInt(a.studentId, 10), // Ensure studentId is a number
          score: parseFloat(a.score),
          maxScore: parseFloat(a.maxScore),
          teacherId: user.id,
        })),
      };

      // Filter out any records where parsing failed and resulted in NaN
      payload.students = payload.students.filter(s => !isNaN(s.id));
      payload.attendance = payload.attendance.filter(a => !isNaN(a.studentId));
      payload.assessments = payload.assessments.filter(a => !isNaN(a.studentId));

      const res = await fetch("/api/data-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const apiResult: ApiResult = await res.json();
      setResult(apiResult);

      if(apiResult.success) {
        setStudentsData([]);
        setAttendanceData([]);
        setAssessmentsData([]);
      }
    } catch (err) {
      setResult({
        success: false,
        message: "A network or unknown error occurred.",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setImporting(false);
    }
  }
  
  // The rest of your component's JSX remains the same...
  const totalRecords = studentsData.length + attendanceData.length + assessmentsData.length;

  const FileUploadSection = ({ type, title, data }: { type: "students" | "attendance" | "assessments"; title: string; data: any[] }) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />{title}</CardTitle>
          {data.length > 0 && <Badge variant="secondary">{data.length} records staged</Badge>}
        </div>
        <CardDescription>Required columns: {expectedHeaders[type].join(", ")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          id={`${type}-file`}
          type="file"
          accept=".csv"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileChange(file, type);
            e.target.value = "";
          }}
          disabled={importing}
        />
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Data Import</h2>
      <p className="text-muted-foreground">
        Upload CSV files to bulk import students, attendance, and assessments. All files will be processed in a single transaction.
      </p>

      {result && (
        <Alert variant={result.success ? "default" : "destructive"}>
          {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{result.success ? "Import Successful" : "Import Failed"}</AlertTitle>
          <AlertDescription>{result.message}</AlertDescription>
          <X className="absolute top-2 right-2 h-4 w-4 cursor-pointer" onClick={() => setResult(null)} />
        </Alert>
      )}

      {fileErrors.length > 0 && (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>File Validation Error</AlertTitle>
            <AlertDescription>
                <ul className="list-disc pl-5">
                    {fileErrors.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
            </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
        </TabsList>
        <TabsContent value="students">
          <FileUploadSection type="students" title="Import Students" data={studentsData} />
        </TabsContent>
        <TabsContent value="attendance">
          <FileUploadSection type="attendance" title="Import Attendance" data={attendanceData} />
        </TabsContent>
        <TabsContent value="assessments">
          <FileUploadSection type="assessments" title="Import Assessments" data={assessmentsData} />
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-4">
        <Button onClick={handleSubmit} disabled={importing || totalRecords === 0 || fileErrors.length > 0}>
          {importing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : `Import ${totalRecords} Records`}
        </Button>
        {totalRecords > 0 && <Button variant="outline" onClick={() => { setStudentsData([]); setAttendanceData([]); setAssessmentsData([]); setResult(null); setFileErrors([]); }}>Clear All</Button>}
      </div>
    </div>
  )
}