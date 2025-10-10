import { Route, Routes } from "react-router-dom"
import Coordinator from "../components/pages/coordinator/Coordinator"
import DashboardCoordinator from "../components/pages/coordinator/DashboardCoordinator"
import ManagementDisciplines from "../components/pages/coordinator/DisciplineManagement"
import DisciplineList from "../components/pages/coordinator/ListDisciplines"
import ListStudents from "../components/pages/coordinator/ListStudents"
import ManageTeachers from "../components/pages/coordinator/ManageTeachers"
import RequestsTeachers from "../components/pages/coordinator/Requests"


/**
 * Define todas as rotas do painel do coordenador.
 *
 * Este componente agrupa as páginas específicas do coordenador,
 * como o dashboard, gerenciamento de disciplinas, listagem de alunos,
 * gerenciamento de professores e requisições pendentes.
 *
 * @component
 * @example
 * // Uso dentro de um roteador principal
 * <BrowserRouter>
 *   <CoordinatorRoutes />
 * </BrowserRouter>
 *
 * @returns {JSX.Element} Um conjunto de rotas para o módulo de coordenação.
 */
export default function CoordinatorRoutes() {
  return (
    <Routes>
      {/**
       * Página inicial do coordenador.
       * @route /
       * @element Coordinator
      */}
      <Route index element={<Coordinator />} /> 
      {/**
       * Página principal de dashboard do coordenador.
       * @route /dashboard
       * @element DashboardCoordinator
      */}
      <Route path="dashboard" element={<DashboardCoordinator />} />
      {/**
       * Página de cadastro de disciplinas.
       * @route /discipline/register
       * @element ManagementDisciplines
       */}
      <Route path="discipline/register" element={<ManagementDisciplines />} />
      {/**
       * Página de listagem de disciplinas.
       * @route /discipline/list
       * @element DisciplineList
       */}
      <Route path="discipline/list" element={<DisciplineList />} />
      {/**
       * Página de edição de uma disciplina específica.
       * @route /discipline/edit/:id
       * @element ManagementDisciplines
       */}
      <Route path="discipline/edit/:id" element={<ManagementDisciplines />} />
      {/**
       * Página de listagem de alunos.
       * @route /student/list
       * @element ListStudents
       */}
      <Route path="student/list" element={<ListStudents />} />
      {/**
       * Página de gerenciamento de professores.
       * @route /teacher/manage
       * @element ManageTeachers
       */}
      <Route path="teacher/manage" element={<ManageTeachers />} />
      {/**
       * Página de requisições de professores.
       * @route /requests
       * @element RequestsTeachers
       */}
      <Route path="requests" element={<RequestsTeachers />} />
    </Routes>
  )
}
