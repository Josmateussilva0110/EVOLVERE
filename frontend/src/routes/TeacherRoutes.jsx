import { Routes, Route } from "react-router-dom"
import DisciplineManagement from "../components/pages/teacher/DisciplineManagement"
import ViewDiscipline from "../components/pages/teacher/ViewDiscipline"
import RegisterMaterial from "../components/pages/teacher/RegisterMaterial"
import ViewClass from "../components/pages/teacher/ViewClass"
import RegisterSimulated from "../components/pages/teacher/RegisterSimulated"
import ListSimulated from "../components/pages/teacher/ListSimulated"
import ResponseList from "../components/pages/teacher/ResponseList"

export default function TeacherRoutes() {
  return (
    <Routes>
      <Route path="discipline/manage" element={<DisciplineManagement />} />
      <Route path="discipline/list" element={<ViewDiscipline />} />
      <Route path="material/register" element={<RegisterMaterial />} />
      <Route path="class/view" element={<ViewClass />} />
      <Route path="simulated/register" element={<RegisterSimulated />} />
      <Route path="simulated/list" element={<ListSimulated />} />
      <Route path="simulated/response/list" element={<ResponseList />} />
    </Routes>
  )
}
