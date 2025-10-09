import { Route, Routes } from "react-router-dom"
import Coordinator from "../components/pages/coordinator/Coordinator"
import DashboardCoordinator from "../components/pages/coordinator/DashboardCoordinator"
import ManagementDisciplines from "../components/pages/coordinator/DisciplineManagement"
import DisciplineList from "../components/pages/coordinator/ListDisciplines"
import ListStudents from "../components/pages/coordinator/ListStudents"
import ManageTeachers from "../components/pages/coordinator/ManageTeachers"
import RequestsTeachers from "../components/pages/coordinator/Requests"

export default function CoordinatorRoutes() {
  return (
    <Routes>
      <Route index element={<Coordinator />} /> 
      <Route path="dashboard" element={<DashboardCoordinator />} />
      <Route path="discipline/register" element={<ManagementDisciplines />} />
      <Route path="discipline/list" element={<DisciplineList />} />
      <Route path="discipline/edit/:id" element={<ManagementDisciplines />} />
      <Route path="student/list" element={<ListStudents />} />
      <Route path="teacher/manage" element={<ManageTeachers />} />
      <Route path="requests" element={<RequestsTeachers />} />
    </Routes>
  )
}
