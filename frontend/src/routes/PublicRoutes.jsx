import { Routes, Route } from "react-router-dom"
import Home from "../components/pages/public/Home"
import About from "../components/pages/public/About"
import Login from "../components/pages/auth/Login"
import Register from "../components/pages/auth/Register"
import ForgotPassword from "../components/pages/auth/ForgotPassword"
import HelpCenter from "../components/pages/auth/HelpCenter"
import UserAccount from "../components/pages/auth/UserAccount"
import AccountValidation from "../components/pages/auth/Waiting"

/**
 * Define todas as rotas públicas da aplicação.
 *
 * Este componente agrupa as páginas acessíveis sem autenticação,
 * incluindo as páginas institucionais e de autenticação (login, registro, recuperação de senha etc).
 *
 * @component
 * @example
 * // Uso dentro do roteador principal:
 * <BrowserRouter>
 *   <PublicRoutes />
 * </BrowserRouter>
 *
 * @returns {JSX.Element} Um conjunto de rotas públicas disponíveis para qualquer usuário.
 */
export default function PublicRoutes() {
  return (
    <Routes>
      {/**
       * Página inicial da aplicação.
       * @route /
       * @element Home
       */}
      <Route path="/" element={<Home />} />

      {/**
       * Página "Sobre" — informações sobre a plataforma.
       * @route /about
       * @element About
       */}
      <Route path="/about" element={<About />} />

      {/**
       * Página de login — permite que o usuário acesse sua conta.
       * @route /login
       * @element Login
       */}
      <Route path="/login" element={<Login />} />

      {/**
       * Página de registro — permite que novos usuários se cadastrem.
       * @route /register
       * @element Register
       */}
      <Route path="/register" element={<Register />} />

      {/**
       * Página de recuperação de senha — envia link de redefinição ao e-mail do usuário.
       * @route /forgot_password
       * @element ForgotPassword
       */}
      <Route path="/forgot_password" element={<ForgotPassword />} />

      {/**
       * Página de ajuda e suporte — fornece informações de contato e FAQ.
       * @route /help
       * @element HelpCenter
       */}
      <Route path="/help" element={<HelpCenter />} />

      {/**
       * Página de gerenciamento de conta do usuário.
       * @route /user/account
       * @element UserAccount
       */}
      <Route path="/user/account" element={<UserAccount />} />

      {/**
       * Página exibida enquanto a conta do usuário aguarda aprovação.
       * @route /await/approval
       * @element AccountValidation
       */}
      <Route path="/await/approval" element={<AccountValidation />} />
    </Routes>
  )
}