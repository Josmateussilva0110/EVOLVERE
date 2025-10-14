import { Route, Routes } from "react-router-dom"
import DisciplineManagement from "../components/pages/teacher/DisciplineManagement"
import ViewDiscipline from "../components/pages/teacher/ViewDiscipline"
import RegisterMaterial from "../components/pages/teacher/RegisterMaterial"
import ViewClass from "../components/pages/teacher/ViewClass"
import RegisterSimulated from "../components/pages/teacher/RegisterSimulated"
import ListSimulated from "../components/pages/teacher/ListSimulated"
import ResponseList from "../components/pages/teacher/ResponseList"


/**
 * Define todas as rotas do módulo de professores.
 *
 * Este componente agrupa as páginas e funcionalidades voltadas ao professor,
 * como o gerenciamento de disciplinas, turmas, materiais e simulados.
 *  
 * As rotas são protegidas e acessíveis apenas a usuários com papel de **professor**.
 *
 * @component
 * @example
 * // Exemplo de uso dentro do roteador principal:
 * <BrowserRouter>
 *   <TeacherRoutes />
 * </BrowserRouter>
 *
 * @returns {JSX.Element} Um conjunto de rotas destinadas ao painel do professor.
 */
export default function TeacherRoutes() {
  return (
    <Routes>
      {/**
       * Página de gerenciamento de disciplinas do professor.
       * Permite criar, editar e remover disciplinas.
       * @route /teacher/discipline/manage
       * @element DisciplineManagement
       */}
      <Route path="discipline/manage" element={<DisciplineManagement />} />

      {/**
       * Página de visualização das disciplinas cadastradas pelo professor.
       * @route /teacher/discipline/list
       * @element ViewDiscipline
       */}
      <Route path="discipline/view/:id" element={<ViewDiscipline />} />

      {/**
       * Página para cadastro e upload de materiais didáticos.
       * @route /teacher/material/register
       * @element RegisterMaterial
       */}
      <Route path="material/register/:id" element={<RegisterMaterial />} />

      {/**
       * Página para visualização das turmas associadas às disciplinas do professor.
       * @route /teacher/class/view
       * @element ViewClass
       */}
      <Route path="class/view/:id" element={<ViewClass />} />

      {/**
       * Página para criação de simulados (testes avaliativos).
       * @route /teacher/simulated/register
       * @element RegisterSimulated
       */}
      <Route path="simulated/register" element={<RegisterSimulated />} />

      {/**
       * Página de listagem dos simulados criados pelo professor.
       * @route /teacher/simulated/list
       * @element ListSimulated
       */}
      <Route path="simulated/list" element={<ListSimulated />} />

      {/**
       * Página de listagem das respostas dos alunos aos simulados.
       * @route /teacher/simulated/response/list
       * @element ResponseList
       */}
      <Route path="simulated/response/list" element={<ResponseList />} />
    </Routes>
  )
}
