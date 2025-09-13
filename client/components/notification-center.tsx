"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Mail, Send, Clock, CheckCircle, AlertCircle, Settings, Plus, Edit, Eye, Calendar } from "lucide-react"
import { defaultTemplates, mockNotificationLogs, processTemplate, sendNotification } from "@/lib/notifications"
import { mockStudents } from "@/lib/mock-data"
import type { NotificationTemplate, NotificationLog, NotificationSchedule } from "@/lib/notifications"

export function NotificationCenter() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>(defaultTemplates)
  const [logs, setLogs] = useState<NotificationLog[]>(mockNotificationLogs)
  const [schedules, setSchedules] = useState<NotificationSchedule[]>([])
  const [sending, setSending] = useState(false)

  const sendTestNotification = async (templateId: string, recipientEmail: string) => {
    setSending(true)
    try {
      const template = templates.find((t) => t.id === templateId)
      if (!template) return

      const variables = {
        studentName: "John Doe",
        studentGrade: "10th",
        recipientName: "Test Recipient",
        riskFactors: "- Low attendance rate: 65%\n- Academic average: 58%",
        riskScore: "75",
        date: new Date().toLocaleDateString(),
      }

      const result = await sendNotification(templateId, recipientEmail, variables)

      const newLog: NotificationLog = {
        id: `log_${Date.now()}`,
        studentId: "test",
        recipientEmail,
        recipientType: "mentor",
        templateId,
        sentAt: new Date().toISOString(),
        status: result.success ? "sent" : "failed",
        errorMessage: result.error,
      }

      setLogs([newLog, ...logs])
    } finally {
      setSending(false)
    }
  }

  const TemplatePreview = ({ template }: { template: NotificationTemplate }) => {
    const sampleVariables = {
      studentName: "Emma Johnson",
      studentGrade: "10th Grade",
      recipientName: "Dr. Sarah Mitchell",
      riskFactors: "- Attendance rate: 65% (below 80% threshold)\n- Academic average: 58% (below 70% threshold)",
      riskScore: "75",
      date: new Date().toLocaleDateString(),
      amount: "1,200",
      daysOverdue: "42",
      paymentType: "Tuition",
    }

    const processedBody = processTemplate(template, sampleVariables)

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Template Preview: {template.name}</DialogTitle>
            <DialogDescription>Preview of how the notification will appear to recipients</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Subject:</Label>
              <p className="text-sm bg-muted p-2 rounded mt-1">
                {processTemplate({ ...template, body: template.subject }, sampleVariables)}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Body:</Label>
              <div className="text-sm bg-muted p-4 rounded mt-1 whitespace-pre-line max-h-96 overflow-y-auto">
                {processedBody}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const TestNotificationDialog = ({ template }: { template: NotificationTemplate }) => {
    const [open, setOpen] = useState(false)
    const [email, setEmail] = useState("")

    const handleSend = async () => {
      if (email) {
        await sendTestNotification(template.id, email)
        setEmail("")
        setOpen(false)
      }
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Send className="h-4 w-4 mr-2" />
            Test
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Test Notification</DialogTitle>
            <DialogDescription>Send a test notification using the "{template.name}" template</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="test-email">Recipient Email</Label>
              <Input
                id="test-email"
                type="email"
                placeholder="test@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSend} disabled={!email || sending}>
                {sending ? "Sending..." : "Send Test"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const recentLogs = logs.slice(0, 10)
  const sentCount = logs.filter((log) => log.status === "sent").length
  const failedCount = logs.filter((log) => log.status === "failed").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Notification Center</h2>
          <p className="text-muted-foreground">Manage notification templates and delivery settings</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Notification Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Templates</span>
            </div>
            <p className="text-2xl font-bold mt-2">{templates.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Sent Today</span>
            </div>
            <p className="text-2xl font-bold mt-2">{sentCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Failed</span>
            </div>
            <p className="text-2xl font-bold mt-2">{failedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Scheduled</span>
            </div>
            <p className="text-2xl font-bold mt-2">{schedules.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="logs">Delivery Logs</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="mt-1">
                        <Badge variant="outline" className="mr-2">
                          {template.type.toUpperCase()}
                        </Badge>
                        Triggers: {template.triggers.join(", ")}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <TemplatePreview template={template} />
                      <TestNotificationDialog template={template} />
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium">Subject:</Label>
                      <p className="text-sm text-muted-foreground">{template.subject}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Preview:</Label>
                      <p className="text-sm text-muted-foreground line-clamp-2">{template.body.substring(0, 150)}...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>History of sent notifications and their delivery status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLogs.map((log) => {
                  const student = mockStudents.find((s) => s.id === log.studentId)
                  const template = templates.find((t) => t.id === log.templateId)

                  return (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            log.status === "sent"
                              ? "bg-green-500"
                              : log.status === "failed"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium">
                            {template?.name} → {log.recipientEmail}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {student?.name || "Test"} • {new Date(log.sentAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={log.status === "sent" ? "default" : "destructive"}>{log.status}</Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Schedules</CardTitle>
              <CardDescription>Configure automatic notification delivery schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Schedules Configured</h3>
                <p className="text-muted-foreground mb-4">
                  Set up automatic notification schedules for mentors and guardians.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure global notification preferences and delivery options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Enable Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Send notifications via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Enable SMS Notifications</Label>
                    <p className="text-xs text-muted-foreground">Send notifications via SMS (requires setup)</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Batch Notifications</Label>
                    <p className="text-xs text-muted-foreground">Group similar notifications together</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sender-email">Sender Email Address</Label>
                <Input id="sender-email" placeholder="noreply@school.edu" defaultValue="alerts@eduwatch.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sender-name">Sender Name</Label>
                <Input id="sender-name" placeholder="EduWatch Alert System" defaultValue="EduWatch Alert System" />
              </div>

              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
