import { Route, Routes } from "react-router-dom"
import ManagementStudents from "../components/pages/students/ManagementStudents"
import ManagementCoursesStudents from "../components/pages/students/ManagementCoursesStudents"
import ManagementDisciplinesStudents from "../components/pages/students/ManagementDisciplinesStudents"
import ManagementClasses from "../components/pages/students/ManagementClasses"
import ManagementMaterials from "../components/pages/students/ManagementMaterials"
import ManagementActivity from "../components/pages/students/ManagementActivity"
import ManagementPerformace from "../components/pages/students/ManagementPerformance"
import ManagementMedals from "../components/pages/students/ManagementMedals"
import MaterialsClass from "../components/pages/students/MaterialsClass"


/**
 * Define todas as rotas do módulo de alunos.
 *
 * Este componente agrupa as páginas voltadas para o estudante, incluindo
 * gerenciamento de cursos, disciplinas, turmas, materiais, atividades,
 * desempenho e medalhas.  
 *
 * As rotas são protegidas por autenticação e acessíveis apenas para usuários
 * com papel de aluno dentro do sistema.
 *
 * @component
 * @example
 * // Exemplo de uso dentro do roteador principal:
 * <BrowserRouter>
 *   <StudentRoutes />
 * </BrowserRouter>
 *
 * @returns {JSX.Element} Um conjunto de rotas destinadas ao painel do aluno.
 */
export default function StudentRoutes() {
  return (
    <Routes>
      {/**
       * Página inicial do módulo do aluno (painel principal).
       * @route /student/home
       * @element ManagementStudents
       */}
      <Route path="home" element={<ManagementStudents />} />

      {/**
       * Página de listagem e gerenciamento de cursos do aluno.
       * @route /student/courses/list
       * @element ManagementCoursesStudents
       */}
      <Route path="courses/list" element={<ManagementCoursesStudents />} />

      {/**
       * Página de visualização das disciplinas do aluno.
       * @route /student/disciplines/view
       * @element ManagementDisciplinesStudents
       */}
      <Route path="disciplines/view" element={<ManagementDisciplinesStudents />} />

      {/**
       * Página de visualização das turmas em que o aluno está matriculado.
       * @route /student/classes/view
       * @element ManagementClasses
       */}
      <Route path="classes/view" element={<ManagementClasses />} />

      {/**
       * Página de acesso e gerenciamento dos materiais disponibilizados.
       * @route /student/materials/view
       * @element ManagementMaterials
       */}
      <Route path="materials/view" element={<ManagementMaterials />} />

      <Route path="materials/view/:class_id" element={<MaterialsClass />} />

      {/**
       * Página de visualização e submissão de atividades.
       * @route /student/activities/view
       * @element ManagementActivity
       */}
      <Route path="activities/view" element={<ManagementActivity />} />

      {/**
       * Página de acompanhamento do desempenho acadêmico do aluno.
       * @route /student/performance/view
       * @element ManagementPerformace
       */}
      <Route path="performance/view" element={<ManagementPerformace />} />

      {/**
       * Página de visualização das medalhas e conquistas do aluno.
       * @route /student/medals/view
       * @element ManagementMedals
       */}
      <Route path="medals/view" element={<ManagementMedals />} />
    </Routes>
  )
}
