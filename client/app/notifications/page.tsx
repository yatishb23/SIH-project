import { NotificationCenter } from "@/components/notification-center"
import { Navigation } from "@/components/navigation"

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="md:pl-64">
        <main className="p-4 md:p-8">
          <NotificationCenter />
        </main>
      </div>
    </div>
  )
}
