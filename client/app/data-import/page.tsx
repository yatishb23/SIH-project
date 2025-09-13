import { DataImport } from "@/components/data-import"
import { Navigation } from "@/components/navigation"

export default function DataImportPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="md:pl-64">
        <main className="p-4 md:p-8">
          <DataImport />
        </main>
      </div>
    </div>
  )
}
