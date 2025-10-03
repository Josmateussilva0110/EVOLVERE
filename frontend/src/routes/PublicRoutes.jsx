import { Routes, Route } from "react-router-dom"
import Home from "../components/pages/public/Home"
import About from "../components/pages/public/About"
import Login from "../components/pages/auth/Login"
import Register from "../components/pages/auth/Register"
import ForgotPassword from "../components/pages/auth/ForgotPassword"
import HelpCenter from "../components/pages/auth/HelpCenter"
import UserAccount from "../components/pages/auth/UserAccount"
import AccountValidation from "../components/pages/auth/Waiting"

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot_password" element={<ForgotPassword />} />
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/user/account" element={<UserAccount />} />
      <Route path="/await/approval" element={<AccountValidation />} />
    </Routes>
  )
}
