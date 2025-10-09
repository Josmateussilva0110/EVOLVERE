import { Route, Routes } from "react-router-dom"
import ManagementStudents from "../components/pages/students/ManagementStudents"
import ManagementCoursesStudents from "../components/pages/students/ManagementCoursesStudents"
import ManagementDisciplinesStudents from "../components/pages/students/ManagementDisciplinesStudents"
import ManagementClasses from "../components/pages/students/ManagementClasses"
import ManagementMaterials from "../components/pages/students/ManagementMaterials"
import ManagementActivity from "../components/pages/students/ManagementActivity"
import ManagementPerformace from "../components/pages/students/ManagementPerformance"
import ManagementMedals from "../components/pages/students/ManagementMedals"

export default function StudentRoutes() {
  return (
    <Routes>
      <Route path="home" element={<ManagementStudents />} />
      <Route path="courses/list" element={<ManagementCoursesStudents />} />
      <Route path="disciplines/view" element={<ManagementDisciplinesStudents />} />
      <Route path="classes/view" element={<ManagementClasses />} />
      <Route path="materials/view" element={<ManagementMaterials />} />
      <Route path="activities/view" element={<ManagementActivity />} />
      <Route path="performance/view" element={<ManagementPerformace />} />
      <Route path="medals/view" element={<ManagementMedals />} />
    </Routes>
  )
}
