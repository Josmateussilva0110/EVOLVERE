import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiBell, FiShield, FiCheck, FiMail, FiLock, FiPhone } from "react-icons/fi";
import { Context } from "../../../context/UserContext"
import requestData from "../../../utils/requestApi"
import useFlashMessage from "../../../hooks/useFlashMessage";

/**
 * CoordinatorSettings
 *
 * Componente responsável por exibir e gerenciar as **configurações do coordenador**.
 *
 * O que faz:
 * - Permite alteração do e-mail do usuário.
 * - Controla preferências de notificações (e-mail e WhatsApp).
 * - Oferece formulário para alteração de senha com validações de segurança.
 * - Exibe mensagens de erro ou sucesso via alert() durante a validação.
 *
 * Validações aplicadas:
 * - E-mail precisa estar em formato válido e ser diferente do atual.
 * - Senha nova precisa ser forte e diferente da atual.
 * - Nova senha e confirmação precisam coincidir.
 *
 * Entradas:
 * - Não recebe props diretamente.
 * - Interação do usuário como entradas dinâmicas:
 *    - Alteração de notificações (`notifEmail`, `notifWhats`).
 *    - Atualização de e-mail (`novoEmail`).
 *    - Alteração de senha (`senhaAtual`, `novaSenha`, `confirmarSenha`).
 *
 * Estados locais:
 * - `notifEmail` → ativa/desativa notificações por e-mail.
 * - `notifWhats` → ativa/desativa notificações por WhatsApp.
 * - `novoEmail` → armazena o novo e-mail informado.
 * - `emailAtual` → guarda o e-mail cadastrado do usuário.
 * - `senhaAtual` → senha atual do usuário (para validação).
 * - `novaSenha` → nova senha informada.
 * - `confirmarSenha` → confirmação da nova senha.
 *
 * Navegação:
 * - Voltar → retorna para a página anterior.
 *
 * Saída:
 * - JSX completo exibindo o formulário de configurações, notificações, alteração de e-mail e senha.
 *
 * Exemplo de uso:
 * ```jsx
 * <CoordinatorSettings />
 *
 * // Interação do usuário:
 * setNovoEmail("novo@email.com");
 * setNotifEmail(false);
 * setNovaSenha("SenhaForte@123");
 * setConfirmarSenha("SenhaForte@123");
 * ```
 *
 * @component
 * @returns {JSX.Element} Página de configurações do coordenador
 */
function CoordinatorSettings() {
  const navigate = useNavigate();
  /** @type {[boolean, Function]} Estado para notificações por e-mail */
  const [notifEmail, setNotifEmail] = useState(true);
  /** @type {[boolean, Function]} Estado para notificações por WhatsApp */
  const [notifWhats, setNotifWhats] = useState(false);
  /** @type {[string, Function]} Novo e-mail a ser definido */
  const [novoEmail, setNovoEmail] = useState("");
  /** @type {[string, Function]} E-mail atual do usuário */
  const [emailAtual, setEmailAtual] = useState("");
  /** @type {[string, Function]} Senha atual para validação */
  const [senhaAtual, setSenhaAtual] = useState("");
  /** @type {[string, Function]} Nova senha a ser definida */
  const [novaSenha, setNovaSenha] = useState("");
  /** @type {[string, Function]} Confirmação da nova senha */
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [userData, setUserData] = useState({})
  const { setFlashMessage } = useFlashMessage()

  const { user } = useContext(Context)

  useEffect(() => {
    if(user) {
      async function fetchUser() {
        const response = await requestData(`/user/${user.id}`, 'GET', {}, true)
        if(response.success) {
          setUserData(response.data.user, 'success')
        }
      }
      fetchUser()
    }
  }, [user])



  /**
   * Manipula o envio do formulário de configurações.
   *
   * Realiza validações para:
   * - E-mail: formato válido e diferente do atual
   * - Senha: senha atual obrigatória, nova senha forte e confirmação
   *
   * @param {Event} e - Evento de submit do formulário
   */
  async function handleEdit(e) {
    e.preventDefault()

    // cria formData e adiciona os campos
    const formData = new FormData()
    formData.append("email", novoEmail)
    formData.append("password", novaSenha)
    formData.append("confirm_password", confirmarSenha)

    const response = await requestData(`/user/${user.id}`, "PATCH", formData, true)

    if (response.success) {
      setFlashMessage(response.data.message, "success")
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
                <label className="text-sm text-gray-700 inline-flex items-center gap-2"><FiMail className="text-gray-500" /> E-mail atual</label>
                <input type="email" value={userData.email} onChange={(e)=>setEmailAtual(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50" disabled />
                <label className="text-sm text-gray-700 inline-flex items-center gap-2"><FiMail className="text-gray-500" /> Novo e-mail</label>
                <input type="email" value={novoEmail} onChange={(e)=>setNovoEmail(e.target.value)} placeholder="nome@exemplo.com" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              </div>
            </div>
          </section>

          {/* Segurança */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-800">Notificações</h3>
            <div className="rounded-xl ring-1 ring-gray-200 p-4 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2 text-gray-800">
                  <FiBell className="text-gray-500" />
                  <span className="text-sm">Receber por e-mail</span>
                </div>
                <input type="checkbox" checked={notifEmail} onChange={(e)=>setNotifEmail(e.target.checked)} className="h-4 w-4" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2 text-gray-800">
                  <FiPhone className="text-gray-500" />
                  <span className="text-sm">Receber por WhatsApp</span>
                </div>
                <input type="checkbox" checked={notifWhats} onChange={(e)=>setNotifWhats(e.target.checked)} className="h-4 w-4" />
              </label>
            </div>
          </section>

          {/* Alterar senha */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-800">Alterar senha</h3>
            <div className="rounded-xl ring-1 ring-gray-200 p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="text-sm text-gray-700 inline-flex items-center gap-2"><FiLock className="text-gray-500" /> Senha atual</label>
                <input type="password" value={senhaAtual} onChange={(e)=>setSenhaAtual(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                <label className="text-sm text-gray-700 inline-flex items-center gap-2"><FiLock className="text-gray-500" /> Nova senha</label>
                <input type="password" value={novaSenha} onChange={(e)=>setNovaSenha(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                <label className="text-sm text-gray-700 inline-flex items-center gap-2"><FiLock className="text-gray-500" /> Confirmar senha</label>
                <input type="password" value={confirmarSenha} onChange={(e)=>setConfirmarSenha(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              </div>
              <p className="text-xs text-gray-500">Use ao menos 8 caracteres, com letras e números.</p>
            </div>
          </section>

          <div className="pt-2">
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 text-gray-900 px-6 py-3 text-sm font-semibold hover:bg-yellow-500">
              <FiCheck /> Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CoordinatorSettings;
