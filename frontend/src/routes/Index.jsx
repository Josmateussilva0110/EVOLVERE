import { Routes, Route } from "react-router-dom"
import PrivateRoute from "../context/PrivateRouter"
import CoordinatorRoute from "../context/CoordinatorRoute"
import CoordinatorProfile from "../components/pages/coordinator/CoordinatorProfile"
import CoordinatorSettings from "../components/pages/coordinator/CoordinatorSettings"

import PublicRoutes from "./PublicRoutes"
import CoordinatorRoutes from "./CoordinatorRoutes"
import TeacherRoutes from "./TeacherRoutes"
import StudentRoutes from "./StudentRoutes"


/**
 * Gerencia todas as rotas principais da aplicação.
 *
 * Este componente define a estrutura de navegação, dividindo as rotas em:
 * - **Públicas:** acessíveis a qualquer usuário.
 * - **Privadas:** acessíveis apenas a usuários autenticados.
 * - **Restritas:** acessíveis apenas a usuários com papel de coordenador.
 *
 * Também agrupa os submódulos de rotas específicas para professores, alunos e coordenadores.
 *
 * @component
 * @example
 * // Exemplo de uso:
 * <BrowserRouter>
 *   <AppRoutes />
 * </BrowserRouter>
 *
 * @returns {JSX.Element} Um conjunto de rotas protegidas e públicas da aplicação.
 */
export default function AppRoutes() {
    return (
        <Routes>
        {/* Rotas públicas */}
        {/**
         * Rotas públicas — acessíveis sem autenticação.
         * @route /*
         * @element PublicRoutes
         */}
        <Route path="/*" element={<PublicRoutes />} />

        {/* Rotas privadas */}
        {/**
         * Agrupamento de rotas privadas — requer autenticação.
         * Utiliza o componente <PrivateRoute /> para proteger o acesso.
         */}
        <Route element={<PrivateRoute />}>
            {/**
             * Página de perfil do coordenador.
             * @route /profile
             * @element CoordinatorProfile
             */}
            <Route path="/profile" element={<CoordinatorProfile />} />
            {/**
             * Página de configurações do coordenador.
             * @route /settings
             * @element CoordinatorSettings
             */}
            <Route path="/settings" element={<CoordinatorSettings />} />
            {/**
             * Rotas do módulo do professor.
             * @route /teacher/*
             * @element TeacherRoutes
             */}
            <Route path="/teacher/*" element={<TeacherRoutes />} />
            {/**
             * Rotas do módulo do aluno.
             * @route /student/*
             * @element StudentRoutes
             */}
            <Route path="/student/*" element={<StudentRoutes />} />
            
            {/**
             * Agrupamento de rotas restritas a coordenadores.
             * Utiliza o componente <CoordinatorRoute /> para verificar permissões.
             */}
            <Route element={<CoordinatorRoute />}>
                {/**
                 * Rotas do painel do coordenador.
                 * @route /coordinator/*
                 * @element CoordinatorRoutes
                 */}
                <Route path="/coordinator/*" element={<CoordinatorRoutes />} />
            </Route>
        </Route>
        </Routes>
    )
}
