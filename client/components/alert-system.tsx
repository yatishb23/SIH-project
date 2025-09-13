"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertTriangle, CheckCircle, Clock, User, Calendar, MessageSquare, Plus, Search } from "lucide-react"
import { mockAlerts, mockStudents, mockMentors } from "@/lib/mock-data"
import type { Alert } from "@/lib/types"

export function AlertSystem() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")

  // Filter alerts based on search and filters
  const filteredAlerts = alerts.filter((alert) => {
    const student = mockStudents.find((s) => s.id === alert.studentId)
    const matchesSearch =
      student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = selectedSeverity === "all" || alert.severity === selectedSeverity
    const matchesType = selectedType === "all" || alert.type === selectedType

    return matchesSearch && matchesSeverity && matchesType
  })

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              acknowledged: true,
              acknowledgedBy: "current_user",
              acknowledgedAt: new Date().toISOString(),
            }
          : alert,
      ),
    )
  }

  const createAlert = (newAlert: Omit<Alert, "id" | "createdAt">) => {
    const alert: Alert = {
      ...newAlert,
      id: `alert_${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setAlerts([alert, ...alerts])
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-blue-500" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "attendance":
        return <Calendar className="h-4 w-4" />
      case "academic":
        return <User className="h-4 w-4" />
      case "financial":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const AlertCard = ({ alert }: { alert: Alert }) => {
    const student = mockStudents.find((s) => s.id === alert.studentId)
    const mentor = mockMentors.find((m) => m.id === student?.mentorId)

    return (
      <Card className={`${alert.acknowledged ? "opacity-75" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {getSeverityIcon(alert.severity)}
              <div>
                <CardTitle className="text-lg">{student?.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  {getTypeIcon(alert.type)}
                  <span className="capitalize">{alert.type}</span>
                  <span>•</span>
                  <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getSeverityColor(alert.severity)}>{alert.severity.toUpperCase()}</Badge>
              {alert.acknowledged && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Acknowledged
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{alert.message}</p>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Grade: {student?.grade}</span>
              <span>Mentor: {mentor?.name}</span>
            </div>
            {!alert.acknowledged && (
              <Button size="sm" onClick={() => acknowledgeAlert(alert.id)} className="ml-auto">
                <CheckCircle className="h-4 w-4 mr-2" />
                Acknowledge
              </Button>
            )}
          </div>

          {alert.acknowledged && (
            <div className="text-xs text-muted-foreground border-t pt-2">
              Acknowledged by {alert.acknowledgedBy} on {new Date(alert.acknowledgedAt!).toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const CreateAlertDialog = () => {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
      studentId: "",
      type: "general" as Alert["type"],
      severity: "medium" as Alert["severity"],
      message: "",
      acknowledged: false,
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (formData.studentId && formData.message) {
        createAlert(formData)
        setFormData({
          studentId: "",
          type: "general",
          severity: "medium",
          message: "",
          acknowledged: false,
        })
        setOpen(false)
      }
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Alert</DialogTitle>
            <DialogDescription>Create a manual alert for a student that requires attention.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="student">Student</Label>
              <Select
                value={formData.studentId}
                onValueChange={(value) => setFormData({ ...formData, studentId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {mockStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} - {student.grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: Alert["type"]) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="attendance">Attendance</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value: Alert["severity"]) => setFormData({ ...formData, severity: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Describe the issue or concern..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Alert</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  const activeAlerts = alerts.filter((a) => !a.acknowledged)
  const acknowledgedAlerts = alerts.filter((a) => a.acknowledged)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Alert Management</h2>
          <p className="text-muted-foreground">Monitor and manage alerts for at-risk students</p>
        </div>
        <CreateAlertDialog />
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Active Alerts</span>
            </div>
            <p className="text-2xl font-bold mt-2">{activeAlerts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Critical</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">High Priority</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {alerts.filter((a) => a.severity === "high" && !a.acknowledged).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Resolved</span>
            </div>
            <p className="text-2xl font-bold mt-2">{acknowledgedAlerts.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts or student names..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="attendance">Attendance</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alert Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Alerts ({activeAlerts.length})</TabsTrigger>
          <TabsTrigger value="acknowledged">Acknowledged ({acknowledgedAlerts.length})</TabsTrigger>
          <TabsTrigger value="all">All Alerts ({alerts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {filteredAlerts.filter((a) => !a.acknowledged).length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Active Alerts</h3>
                <p className="text-muted-foreground">
                  All alerts have been acknowledged or no alerts match your filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAlerts
                .filter((a) => !a.acknowledged)
                .sort((a, b) => {
                  const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
                  return (
                    severityOrder[b.severity as keyof typeof severityOrder] -
                    severityOrder[a.severity as keyof typeof severityOrder]
                  )
                })
                .map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="acknowledged" className="space-y-4">
          <div className="space-y-4">
            {filteredAlerts
              .filter((a) => a.acknowledged)
              .map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            {filteredAlerts
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
