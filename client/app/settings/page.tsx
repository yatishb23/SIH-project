import { Navigation } from "@/components/navigation"
import { SettingsPanel } from "@/components/setting-panel"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="md:pl-64">
        <main className="p-4 md:p-8">
          <SettingsPanel />
        </main>
      </div>
    </div>
  )
}
