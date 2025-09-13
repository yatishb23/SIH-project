"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, AlertCircle, CheckCircle, X } from "lucide-react"
import { parseStudentCSV, parseAttendanceCSV, parseAssessmentCSV } from "@/lib/csv-parser"

interface ImportResult {
  success: boolean
  imported: number
  errors: string[]
  skipped: number
}

export function DataImport() {
  const [importing, setImporting] = useState(false)
  const [results, setResults] = useState<ImportResult | null>(null)
  const [activeTab, setActiveTab] = useState("students")

  const handleFileUpload = async (file: File, type: string) => {
    setImporting(true)
    setResults(null)

    try {
      const text = await file.text()
      let parseResult

      switch (type) {
        case "students":
          parseResult = parseStudentCSV(text)
          break
        case "attendance":
          parseResult = parseAttendanceCSV(text)
          break
        case "assessments":
          parseResult = parseAssessmentCSV(text)
          break
        default:
          throw new Error("Invalid import type")
      }

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setResults({
        success: parseResult.errors.length === 0,
        imported: parseResult.data.length,
        errors: parseResult.errors,
        skipped: parseResult.skipped,
      })

      // In a real app, you would save the data to your database here
      console.log(`[v0] Imported ${type} data:`, parseResult.data)
    } catch (error) {
      setResults({
        success: false,
        imported: 0,
        errors: [error instanceof Error ? error.message : "Unknown error occurred"],
        skipped: 0,
      })
    } finally {
      setImporting(false)
    }
  }

  const FileUploadSection = ({
    type,
    title,
    description,
    sampleHeaders,
  }: {
    type: string
    title: string
    description: string
    sampleHeaders: string[]
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`${type}-file`}>CSV File</Label>
          <Input
            id={`${type}-file`}
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                handleFileUpload(file, type)
              }
            }}
            disabled={importing}
          />
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-2">Required columns:</p>
          <div className="flex flex-wrap gap-1">
            {sampleHeaders.map((header) => (
              <Badge key={header} variant="outline" className="text-xs">
                {header}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Data Import</h2>
        <p className="text-muted-foreground">
          Upload CSV files to import student data, attendance records, and assessment scores.
        </p>
      </div>

      {results && (
        <Alert className={results.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <div className="flex items-center gap-2">
            {results.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription>
              {results.success ? (
                <span className="text-green-800">
                  Successfully imported {results.imported} records
                  {results.skipped > 0 && ` (${results.skipped} skipped)`}
                </span>
              ) : (
                <div className="text-red-800">
                  <p className="font-medium">Import failed:</p>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    {results.errors.map((error, index) => (
                      <li key={index} className="text-sm">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </AlertDescription>
          </div>
          <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => setResults(null)}>
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <FileUploadSection
            type="students"
            title="Import Students"
            description="Upload a CSV file containing student information"
            sampleHeaders={["name", "email", "grade", "enrollmentdate", "mentorid", "guardianemail"]}
          />
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <FileUploadSection
            type="attendance"
            title="Import Attendance"
            description="Upload a CSV file containing attendance records"
            sampleHeaders={["studentid", "date", "status", "notes"]}
          />
        </TabsContent>

        <TabsContent value="assessments" className="space-y-4">
          <FileUploadSection
            type="assessments"
            title="Import Assessments"
            description="Upload a CSV file containing assessment scores"
            sampleHeaders={["studentid", "subject", "assessmenttype", "score", "maxscore", "date", "weight"]}
          />
        </TabsContent>
      </Tabs>

      {importing && (
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Upload className="h-4 w-4 animate-pulse" />
            <span>Processing file...</span>
          </div>
        </div>
      )}
    </div>
  )
}
