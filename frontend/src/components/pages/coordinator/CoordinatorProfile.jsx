import { FiArrowLeft, FiUser, FiMail, FiShield, FiLoader, FiAlertCircle, FiSettings, FiLogIn, FiCamera } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import requestData from "../../../utils/requestApi";
import useFlashMessage from "../../../hooks/useFlashMessage"
import { Context } from "../../../context/UserContext"
import Image from "../../form/Image"
import RoleBadge from "../../form/RoleBadge"
import formatDate from "../../../utils/formatDate"

/**
 * CoordinatorProfile
 *
 * Componente responsável por exibir e gerenciar o **perfil do coordenador**.
 *
 * O que faz:
 * - Mostra informações pessoais do usuário (nome, e-mail, permissões).
 * - Permite upload de avatar (foto de perfil).
 * - Exibe configurações de segurança (senha, 2FA) e sessões ativas.
 * - Possui botões de ação rápida para Configurações e Gerenciar segurança.
 * - Exibe estados de carregamento e erro durante a requisição de dados do perfil.
 *
 * Entradas:
 * - Não recebe props diretamente.
 * - Entradas dinâmicas via interação do usuário:
 *    - Alteração de avatar (upload).
 *    - Navegação via botões (Voltar, Configurações).
 *    - Dados do usuário são obtidos do backend através de `requestData`.
 *
 * Estados locais:
 * - `loading` → controla o estado de carregamento (spinner).
 * - `error` → mensagem de erro ao carregar perfil.
 * - `profile` → dados básicos do usuário (nome, email, permissão).
 * - `avatarUrl` → URL da imagem de avatar (padrão vazio).
 *
 * Saída:
 * - JSX completo exibindo o perfil do coordenador, botões de ação, avatar, informações pessoais,
 *   configurações de segurança e indicadores de carregamento/erro.
 *
 * Exemplo de uso:
 * ```jsx
 * <CoordinatorProfile />
 *
 * // Simulação de interação:
 * // O usuário faz upload do avatar ou clica em "Configurações"
 * setAvatarUrl("https://exemplo.com/avatar.jpg");
 * navigate("/coordinator/settings");
 * ```
 *
 * @component
 * @returns {JSX.Element} Página de perfil do coordenador
 */
function CoordinatorProfile() {
  const navigate = useNavigate();
  /** @type {[string|null, Function]} Estado de erro ao carregar perfil */
  const [error, setError] = useState(null);
  /** @type {[Object, Function]} Dados do perfil do usuário */
  const [profile, setProfile] = useState({});
  /** @type {[string, Function]} URL do avatar do usuário */
  const [avatarUrl, setAvatarUrl] = useState("");
  const { setFlashMessage } = useFlashMessage()
  const { user, logout } = useContext(Context)
  const [session, setSession] = useState(null)

  useEffect(() => {
    if (user) {
      async function fetchUser() {
        const response = await requestData(`user/${user.id}`)
        if (response.success) {
          console.log(response)
          setProfile(response.data.user)
        }
      }
      fetchUser()
    }
  }, [user])

  useEffect(() => {
    if (user) {
      async function fetchSession() {
        const response = await requestData(`user/expire/session/${user.id}`)
        if (response.success) {
          console.log('session: ', response)
          setSession(response.data.session.expire)
        }
      }
      fetchSession()
    }
  }, [user])

  async function updateImage(id, file) {
    const formData = new FormData()
    formData.append("photo", file)

    const response = await requestData(`user/photo/${user.id}`, "PUT", formData, true)

    if (response.success) {
      setFlashMessage(response.data.message, "success")
    } else {
      setFlashMessage(response.message, "error")
    }
  }

  async function deleteImage(id) {
    const response = await requestData(`user/photo/delete/${user.id}`, "PUT", {}, true)

    if (response.success) {
      setAvatarUrl("")
      setProfile(prev => ({ 
        ...prev,
        photo: null
      }));
      setFlashMessage(response.data.message, "success")

    } else {
      setFlashMessage(response.message, "error")
    }
  }

  const getAvatarColor = (name) => {
    const colors = ["bg-yellow-400", "bg-indigo-400", "bg-pink-400", "bg-green-400", "bg-blue-400"]
    const index = name ? name.charCodeAt(0) % colors.length : 0
    return colors[index]
  }


  /**
   * useEffect para carregar dados do perfil do usuário.
   * 
   * Executa uma requisição GET para '/user/me' para obter informações do usuário logado.
   * Atualiza os estados de loading, error, profile e avatarUrl com base na resposta da API.
   * 
   * @async
   * @function fetchMe
   * @returns {Promise<void>}
   */

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060060] py-10 px-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl ring-1 ring-gray-200 overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => {
                if (window.history.state && window.history.state.idx > 0) {
                  navigate(-1)
                } else {
                  navigate('/coordinator')
                }
              }}
              className="inline-flex items-center gap-2 rounded-lg ring-1 ring-gray-300 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"
            >
              <FiArrowLeft /> Voltar
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/settings')}
                className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 text-gray-900 px-3 py-2 text-sm font-semibold hover:bg-yellow-500"
              >
                <FiSettings /> Configurações
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 flex items-center justify-center">
              <FiUser />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Meu Perfil</h2>
              <p className="text-sm text-gray-600">Informações da conta e permissões.</p>
            </div>
          </div>
        </div>

        {error ? (
          <div className="p-6">
            <div className="max-w-lg w-full mx-auto bg-white ring-1 ring-red-200 rounded-2xl p-5 text-red-700">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="mt-0.5" />
                <div>
                  <p className="font-semibold">Não foi possível carregar seu perfil</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Avatar e ação de upload */}
            <div className="flex items-center gap-5">
              <div className="relative flex items-center gap-2">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={profile.username || "Foto do usuário"}
                    size={100}
                  />
                ) : profile.photo ? (
                  <Image
                    src={`${import.meta.env.VITE_BASE_URL}/${profile.photo}`}
                    alt={profile.username || "Foto do usuário"}
                    size={100}
                  />
                ) : (
                  <div className={`h-20 w-20 rounded-full ${getAvatarColor(profile.username)} flex items-center justify-center text-white text-3xl font-bold`}>
                    {profile.username ? profile.username.charAt(0).toUpperCase() : "?"}
                  </div>
                )}

                  {/* Botão de upload (ícone da câmera) */}
                  <label className="absolute -bottom-2 -right-2 inline-flex items-center justify-center h-9 w-9 rounded-full bg-yellow-400 text-gray-900 ring-2 ring-white cursor-pointer hover:bg-yellow-500">
                    <FiCamera />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const url = URL.createObjectURL(file)
                          setAvatarUrl(url)
                          updateImage(profile.id, file)
                        }
                      }}
                    />
                  </label>
              </div>

                {/* Botão remover foto */}
                {(avatarUrl || profile.photo) && (
                  <button
                    className=" mt-20 inline-flex items-center gap-1 rounded-lg px-2 py-1 bg-gray-400 text-white text-sm font-medium hover:bg-gray-500"
                    onClick={() => {
                      setAvatarUrl("")
                      deleteImage(profile.id) 
                    }}
                  >
                    Remover Foto
                  </button>
                )}

              {!avatarUrl && !profile.photo && (
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Foto do perfil</p>
                  <p className="text-xs text-gray-500">PNG ou JPG, até 5MB.</p>
                </div>
              )}

            </div>


            {/* Resumo da conta */}
            <div className="rounded-2xl ring-1 ring-gray-200 p-5 flex items-center gap-4">

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:gap-3">
                  <p className="text-sm font-semibold text-gray-900">{profile.username}</p>
                  <button
                    onClick={() => navigate('/settings')}
                    className="mt-1 md:mt-0 inline-flex items-center gap-2 rounded-lg ring-1 ring-gray-300 px-2.5 py-1.5 text-xs text-gray-800 hover:bg-gray-50"
                  >
                    Editar dados
                  </button>
                </div>
                <p className="text-xs text-gray-600">{profile.email}</p>
              </div>

              {/* Badge de papel/permissão */}
              <RoleBadge profile={profile} />
            </div>

            {/* Informações da conta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl ring-1 ring-gray-200 p-4">
                <p className="text-xs text-gray-500">Nome</p>
                <p className="text-sm font-medium text-gray-900">{profile.username}</p>

              </div>
              <div className="rounded-xl ring-1 ring-gray-200 p-4 flex items-start gap-3">
                <FiMail className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">E-mail</p>
                  <p className="text-sm font-medium text-gray-900">{profile.email}</p>
                </div>
              </div>
            </div>

            {/* Segurança e sessão */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl ring-1 ring-gray-200 p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Segurança</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>2FA: <span className="font-medium">Desativado</span></li>
                  <li>Senha: <span className="font-medium">Atualizada</span></li>
                </ul>
                <div className="mt-3">
                  <button onClick={() => navigate('/settings')} className="inline-flex items-center gap-2 rounded-lg ring-1 ring-gray-300 px-3 py-2 text-xs text-gray-800 hover:bg-gray-50"><FiSettings /> Gerenciar segurança</button>
                </div>
              </div>
              <div className="rounded-xl ring-1 ring-gray-200 p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Sessão</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>Valida até: <span className="font-medium">{formatDate(session)}</span></li>
                  <li>Dispositivo atual: <span className="font-medium">Web</span></li>
                </ul>
                <div className="mt-3">
                  <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg ring-1 ring-gray-300 px-3 py-2 text-xs text-gray-800 hover:bg-gray-50"><FiLogIn /> Encerrar sessões</button>
                </div>
              </div>
            </div>

            {/* Ações rápidas */}
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => navigate('/settings')} className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 text-gray-900 px-4 py-2 text-sm font-semibold hover:bg-yellow-500"><FiSettings /> Abrir configurações</button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CoordinatorProfile;
