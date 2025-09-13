"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, TrendingUp, RefreshCw } from "lucide-react"
import { mockStudents } from "@/lib/mock-data"
import { assessRiskFactors, calculateRiskScore, getRiskLevel } from "@/lib/risk-assessment"
import type { Student } from "@/lib/types"

interface MLPrediction {
  studentId: string
  predictedRisk: number
  confidence: number
  factors: string[]
  recommendation: string
}

export function RiskAssessment() {
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [mlPredictions, setMlPredictions] = useState<MLPrediction[]>([])
  const [isRunningML, setIsRunningML] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Simulate ML model predictions
  const runMLAnalysis = async () => {
    setIsRunningML(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const predictions: MLPrediction[] = students.map((student) => {
      const currentRisk = calculateRiskScore(student.id)
      const factors = assessRiskFactors(student.id)

      // Simulate ML prediction with some variance
      const mlRisk = Math.max(0, Math.min(100, currentRisk + (Math.random() - 0.5) * 20))
      const confidence = 0.7 + Math.random() * 0.25 // 70-95% confidence

      const highRiskFactors = factors.filter((f) => f.severity === "high" || f.severity === "critical")

      let recommendation = "Continue monitoring"
      if (mlRisk > 80) {
        recommendation = "Immediate intervention required"
      } else if (mlRisk > 60) {
        recommendation = "Schedule mentor meeting within 48 hours"
      } else if (mlRisk > 30) {
        recommendation = "Increase check-in frequency"
      }

      return {
        studentId: student.id,
        predictedRisk: mlRisk,
        confidence,
        factors: highRiskFactors.map((f) => f.description),
        recommendation,
      }
    })

    setMlPredictions(predictions)
    setIsRunningML(false)
    setLastUpdated(new Date())
  }

  // Update risk scores for all students
  const updateRiskScores = () => {
    const updatedStudents = students.map((student) => ({
      ...student,
      riskScore: calculateRiskScore(student.id),
      riskLevel: getRiskLevel(calculateRiskScore(student.id)),
      lastUpdated: new Date().toISOString(),
    }))
    setStudents(updatedStudents)
    setLastUpdated(new Date())
  }

  useEffect(() => {
    updateRiskScores()
  }, [])

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      default:
        return "bg-green-500"
    }
  }

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      default:
        return "default"
    }
  }

  const RiskFactorCard = ({ student }: { student: Student }) => {
    const factors = assessRiskFactors(student.id)
    const mlPrediction = mlPredictions.find((p) => p.studentId === student.id)

    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{student.name}</CardTitle>
            <Badge variant={getRiskBadgeVariant(student.riskLevel)}>{student.riskLevel.toUpperCase()}</Badge>
          </div>
          <CardDescription>
            {student.grade} Grade • {student.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Risk Score</span>
              <span className="font-medium">{student.riskScore}/100</span>
            </div>
            <Progress value={student.riskScore} className="h-2" />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Risk Factors</h4>
            {factors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="capitalize">{factor.type}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-xs ${getRiskColor(factor.severity)} text-white`}>
                    {factor.severity}
                  </Badge>
                  <span className="text-muted-foreground">{factor.description}</span>
                </div>
              </div>
            ))}
          </div>

          {mlPrediction && (
            <div className="border-t pt-3 space-y-2">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">ML Prediction</span>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Predicted Risk:</span>
                  <span className="font-medium">{mlPrediction.predictedRisk.toFixed(1)}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span className="font-medium">{(mlPrediction.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="mt-2">
                  <span className="text-muted-foreground">Recommendation:</span>
                  <p className="text-sm mt-1">{mlPrediction.recommendation}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const riskCounts = students.reduce(
    (acc, student) => {
      acc[student.riskLevel]++
      return acc
    },
    { low: 0, medium: 0, high: 0, critical: 0 },
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Risk Assessment</h2>
          <p className="text-muted-foreground">AI-powered early warning system for identifying at-risk students</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={updateRiskScores}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Scores
          </Button>
          <Button onClick={runMLAnalysis} disabled={isRunningML}>
            <Brain className="h-4 w-4 mr-2" />
            {isRunningML ? "Running ML Analysis..." : "Run ML Analysis"}
          </Button>
        </div>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm font-medium">Critical Risk</span>
            </div>
            <p className="text-2xl font-bold mt-2">{riskCounts.critical}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm font-medium">High Risk</span>
            </div>
            <p className="text-2xl font-bold mt-2">{riskCounts.high}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-sm font-medium">Medium Risk</span>
            </div>
            <p className="text-2xl font-bold mt-2">{riskCounts.medium}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm font-medium">Low Risk</span>
            </div>
            <p className="text-2xl font-bold mt-2">{riskCounts.low}</p>
          </CardContent>
        </Card>
      </div>

      {mlPredictions.length > 0 && (
        <Alert>
          <TrendingUp className="h-4 w-4" />
          <AlertDescription>
            ML analysis completed at {lastUpdated.toLocaleTimeString()}. Predictions are based on historical patterns
            and current risk factors.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Students</TabsTrigger>
          <TabsTrigger value="critical">Critical Risk</TabsTrigger>
          <TabsTrigger value="high">High Risk</TabsTrigger>
          <TabsTrigger value="medium">Medium Risk</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {students.map((student) => (
              <RiskFactorCard key={student.id} student={student} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {students
              .filter((student) => student.riskLevel === "critical")
              .map((student) => (
                <RiskFactorCard key={student.id} student={student} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="high" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {students
              .filter((student) => student.riskLevel === "high")
              .map((student) => (
                <RiskFactorCard key={student.id} student={student} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="medium" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {students
              .filter((student) => student.riskLevel === "medium")
              .map((student) => (
                <RiskFactorCard key={student.id} student={student} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
