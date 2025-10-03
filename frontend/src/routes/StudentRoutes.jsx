import { Route, Routes } from "react-router-dom"
import ManagementStudents from "../components/pages/students/ManagementStudents"
import ManagementCoursesStudents from "../components/pages/students/ManagementCoursesStudents"
import ManagementDisciplinesStudents from "../components/pages/students/ManagementDisciplinesStudents"

export default function StudentRoutes() {
  return (
    <Routes>
      <Route path="home" element={<ManagementStudents />} />
      <Route path="courses/list" element={<ManagementCoursesStudents />} />
      <Route path="disciplines/view" element={<ManagementDisciplinesStudents />} />
    </Routes>
  )
}
