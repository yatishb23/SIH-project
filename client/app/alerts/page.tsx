import { AlertSystem } from "@/components/alert-system"
import { Navigation } from "@/components/navigation"

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="md:pl-64">
        <main className="p-4 md:p-8">
          <AlertSystem />
        </main>
      </div>
    </div>
  )
}
