"use client"

import { useEffect, useState } from "react"
import { DataImport } from "@/components/data-import"
import { Navigation } from "@/components/navigation"

interface Student {
  id: number
  name: string
  email: string
  createdAt: string
}

export default function DataImportPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/student-data")
        const data = await res.json()
        setStudents(data)
      } catch (error) {
        console.error("Failed to fetch students:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="md:pl-64">
        <main className="p-4 md:p-8 space-y-6">
          <DataImport />

          <section>
            <h2 className="text-xl font-semibold mb-4">Student Records</h2>
            {loading ? (
              <p>Loading...</p>
            ) : students.length === 0 ? (
              <p>No students found.</p>
            ) : (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="border p-2">{student.id}</td>
                      <td className="border p-2">{student.name}</td>
                      <td className="border p-2">{student.email}</td>
                      <td className="border p-2">
                        {new Date(student.createdAt).toLocaleString()}
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
