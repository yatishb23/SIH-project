import { RiskAssessment } from "@/components/risk-assessment"
import { Navigation } from "@/components/navigation"

export default function RiskAssessmentPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="md:pl-64">
        <main className="p-4 md:p-8">
          <RiskAssessment />
        </main>
      </div>
    </div>
  )
}
