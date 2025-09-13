"use client"

import { DashboardOverview } from "@/components/dashboard-overview"
import { Navigation } from "@/components/navigation"
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="md:pl-64">
          <main className="p-4 md:p-8">
            <DashboardOverview />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
