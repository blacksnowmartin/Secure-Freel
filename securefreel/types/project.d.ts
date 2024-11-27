interface Project {
  id: number
  title: string
  status: "open" | "ongoing" | "completed"
  applicants?: string[]
} 