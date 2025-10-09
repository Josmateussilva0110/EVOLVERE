import { Routes, Route } from "react-router-dom"
import PrivateRoute from "../context/PrivateRouter"
import CoordinatorRoute from "../context/CoordinatorRoute"
import CoordinatorProfile from "../components/pages/coordinator/CoordinatorProfile"
import CoordinatorSettings from "../components/pages/coordinator/CoordinatorSettings"

import PublicRoutes from "./PublicRoutes"
import CoordinatorRoutes from "./CoordinatorRoutes"
import TeacherRoutes from "./TeacherRoutes"
import StudentRoutes from "./StudentRoutes"

export default function AppRoutes() {
    return (
        <Routes>
        {/* Rotas públicas */}
        <Route path="/*" element={<PublicRoutes />} />

        {/* Rotas privadas */}
        <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<CoordinatorProfile />} />
            <Route path="/settings" element={<CoordinatorSettings />} />
            <Route path="/teacher/*" element={<TeacherRoutes />} />
            <Route path="/student/*" element={<StudentRoutes />} />
            
            <Route element={<CoordinatorRoute />}>
                <Route path="/coordinator/*" element={<CoordinatorRoutes />} />
            </Route>
        </Route>
        </Routes>
    )
}
