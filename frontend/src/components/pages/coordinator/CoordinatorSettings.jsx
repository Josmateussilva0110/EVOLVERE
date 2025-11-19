import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { FiArrowLeft, FiShield, FiCheck, FiMail, FiLock, FiUser } from "react-icons/fi"
import { Context } from "../../../context/UserContext"
import requestData from "../../../utils/requestApi"
import useFlashMessage from "../../../hooks/useFlashMessage"

/**
 * CoordinatorSettings
 *
 * Componente responsável por exibir e gerenciar as configurações do coordenador.
 */
function CoordinatorSettings() {
  const navigate = useNavigate()
  const [novoEmail, setNovoEmail] = useState("")
  const [emailAtual, setEmailAtual] = useState("")
  const [username, setUsername] = useState("")
  const [senhaAtual, setSenhaAtual] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [userData, setUserData] = useState({})
  const { setFlashMessage } = useFlashMessage()

  const { user } = useContext(Context)

  useEffect(() => {
    if (user) {
      async function fetchUser() {
        const response = await requestData(`/user/${user.id}`, "GET", {}, true)
        if (response.success) {
          const fetchedUser = response.data.user
          setUserData(fetchedUser)
          setUsername(fetchedUser.username || "")
          setEmailAtual(fetchedUser.email || "")
        }
      }
      fetchUser()
    }
  }, [user])

  async function handleEdit(e) {
    e.preventDefault()

    const data = {
      username: username,
      email: novoEmail,
      current_password: senhaAtual,
      password: novaSenha,
      confirm_password: confirmarSenha
    }

    const response = await requestData(`/user/edit/${user.id}`, "PATCH", data, true)

    if (response.success) {
      setFlashMessage(response.data.message, "success")
      navigate("/coordinator/profile")
    } else {
      setFlashMessage(response.message, "error")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060060] py-10 px-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl ring-1 ring-gray-200 overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-lg ring-1 ring-gray-300 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"
            >
              <FiArrowLeft /> Voltar
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 flex items-center justify-center">
              <FiShield />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Configurações</h2>
              <p className="text-sm text-gray-600">Preferências de conta e aplicação.</p>
            </div>
          </div>
        </div>

        <form className="p-6 space-y-6" onSubmit={handleEdit}>
          {/* Conta */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-800">Conta</h3>
            <div className="rounded-xl ring-1 ring-gray-200 p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="text-sm text-gray-700 inline-flex items-center gap-2">
                  <FiUser className="text-gray-500" /> Nome
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50"
                />

                <label className="text-sm text-gray-700 inline-flex items-center gap-2">
                  <FiMail className="text-gray-500" /> E-mail atual
                </label>
                <input
                  type="email"
                  value={userData.email || emailAtual}
                  onChange={(e) => setEmailAtual(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50 opacity-60 cursor-not-allowed"
                  disabled
                />

                <label className="text-sm text-gray-700 inline-flex items-center gap-2">
                  <FiMail className="text-gray-500" /> Novo e-mail
                </label>
                <input
                  type="email"
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  placeholder="nome@exemplo.com"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </section>

          {/* Alterar senha */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-800">Alterar senha</h3>
            <div className="rounded-xl ring-1 ring-gray-200 p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="text-sm text-gray-700 inline-flex items-center gap-2">
                  <FiLock className="text-gray-500" /> Senha atual
                </label>
                <input
                  type="password"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />

                <label className="text-sm text-gray-700 inline-flex items-center gap-2">
                  <FiLock className="text-gray-500" /> Nova senha
                </label>
                <input
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />

                <label className="text-sm text-gray-700 inline-flex items-center gap-2">
                  <FiLock className="text-gray-500" /> Confirmar senha
                </label>
                <input
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              <p className="text-xs text-gray-500">Use ao menos 8 caracteres, com letras e números.</p>
            </div>
          </section>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 text-gray-900 px-6 py-3 text-sm font-semibold hover:bg-yellow-500"
            >
              <FiCheck /> Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CoordinatorSettings
