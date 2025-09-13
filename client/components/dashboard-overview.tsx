"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Users, AlertTriangle, Calendar, BookOpen, ArrowRight, Clock, Target } from "lucide-react"
import { mockStudents, mockAlerts } from "@/lib/mock-data"
import { calculateAttendanceRate, calculateAcademicPerformance } from "@/lib/risk-assessment"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

export function DashboardOverview() {
  const { user } = useAuth()
  const totalStudents = mockStudents.length
  const criticalRisk = mockStudents.filter((s) => s.riskLevel === "critical").length
  const highRisk = mockStudents.filter((s) => s.riskLevel === "high").length
  const activeAlerts = mockAlerts.filter((a) => !a.acknowledged).length

  // Calculate overall metrics
  const overallAttendance =
    mockStudents.reduce((sum, student) => sum + calculateAttendanceRate(student.id), 0) / totalStudents

  const overallAcademic =
    mockStudents.reduce((sum, student) => sum + calculateAcademicPerformance(student.id), 0) / totalStudents

  const recentAlerts = mockAlerts.slice(0, 3)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {getGreeting()}, {user?.name?.split(" ")[0] || "Educator"}
            </h1>
            <p className="text-lg text-muted-foreground">Here's your student risk overview for today</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Active enrollments</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">High Risk Students</CardTitle>
            <AlertTriangle className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{criticalRisk + highRisk}</div>
            <p className="text-xs text-muted-foreground">
              {criticalRisk} critical, {highRisk} high risk
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">{activeAlerts}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{overallAttendance.toFixed(1)}%</div>
            <Progress value={overallAttendance} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BookOpen className="h-5 w-5 text-primary" />
              Academic Performance
            </CardTitle>
            <CardDescription>Average academic performance across all students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Overall Average</span>
                <span className="text-2xl font-bold text-foreground">{overallAcademic.toFixed(1)}%</span>
              </div>
              <Progress value={overallAcademic} className="h-3" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Above 80%:</span>
                  <div className="text-lg font-semibold text-primary">
                    {mockStudents.filter((s) => calculateAcademicPerformance(s.id) >= 80).length}
                  </div>
                  <span className="text-xs text-muted-foreground">students</span>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Below 60%:</span>
                  <div className="text-lg font-semibold text-chart-2">
                    {mockStudents.filter((s) => calculateAcademicPerformance(s.id) < 60).length}
                  </div>
                  <span className="text-xs text-muted-foreground">students</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-chart-3" />
              Recent Alerts
            </CardTitle>
            <CardDescription>Latest alerts requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert) => {
                const student = mockStudents.find((s) => s.id === alert.studentId)
                return (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={alert.severity === "critical" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {alert.severity}
                        </Badge>
                        <span className="text-sm font-medium text-foreground">{student?.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                )
              })}
              <Link href="/alerts">
                <Button variant="outline" className="w-full bg-transparent hover:bg-accent" size="sm">
                  View All Alerts
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Distribution */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Target className="h-5 w-5 text-primary" />
            Risk Distribution
          </CardTitle>
          <CardDescription>Current risk levels across all students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { level: "low", color: "bg-green-500", textColor: "text-green-600" },
              { level: "medium", color: "bg-yellow-500", textColor: "text-yellow-600" },
              { level: "high", color: "bg-orange-500", textColor: "text-orange-600" },
              { level: "critical", color: "bg-red-500", textColor: "text-red-600" },
            ].map(({ level, color, textColor }) => {
              const count = mockStudents.filter((s) => s.riskLevel === level).length
              const percentage = (count / totalStudents) * 100

              return (
                <div key={level} className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize text-foreground">{level} Risk</span>
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                  </div>
                  <div className="space-y-2">
                    <div className={`text-2xl font-bold ${textColor}`}>{count}</div>
                    <Progress value={percentage} className="h-2" />
                    <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}% of total students</div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/data-import">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex flex-col items-center space-y-2 hover:bg-accent bg-transparent"
              >
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="font-medium">Import Data</span>
                <span className="text-xs text-muted-foreground text-center">Upload student records</span>
              </Button>
            </Link>
            <Link href="/risk-assessment">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex flex-col items-center space-y-2 hover:bg-accent bg-transparent"
              >
                <Target className="h-6 w-6 text-primary" />
                <span className="font-medium">Run Assessment</span>
                <span className="text-xs text-muted-foreground text-center">Analyze student risk</span>
              </Button>
            </Link>
            <Link href="/alerts">
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex flex-col items-center space-y-2 hover:bg-accent bg-transparent"
              >
                <AlertTriangle className="h-6 w-6 text-primary" />
                <span className="font-medium">Review Alerts</span>
                <span className="text-xs text-muted-foreground text-center">Check notifications</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
