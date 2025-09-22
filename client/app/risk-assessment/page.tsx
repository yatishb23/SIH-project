"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"

interface RiskAssessment {
  id: number
  studentName: string
  riskLevel: string
  comments?: string
  createdAt: string
}

export default function RiskAssessmentPage() {
  const [risks, setRisks] = useState<RiskAssessment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRisks = async () => {
      try {
        const res = await fetch("/api/risk-assessment")
        const data = await res.json()
        setRisks(data)
      } catch (error) {
        console.error("Failed to fetch risk assessments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRisks()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="md:pl-64">
        <main className="p-4 md:p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">Risk Assessments</h2>
            {loading ? (
              <p>Loading...</p>
            ) : risks.length === 0 ? (
              <p>No risk assessments found.</p>
            ) : (
              <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Student</th>
                    <th className="border p-2">Risk Level</th>
                    <th className="border p-2">Comments</th>
                    <th className="border p-2">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {risks.map((risk) => (
                    <tr key={risk.id} className="hover:bg-gray-50">
                      <td className="border p-2">{risk.id}</td>
                      <td className="border p-2">{risk.studentName}</td>
                      <td
                        className={`border p-2 font-medium ${
                          risk.riskLevel === "High"
                            ? "text-red-600"
                            : risk.riskLevel === "Medium"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {risk.riskLevel}
                      </td>
                      <td className="border p-2">{risk.comments || "-"}</td>
                      <td className="border p-2">
                        {new Date(risk.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
