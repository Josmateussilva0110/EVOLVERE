import { FiArrowLeft, FiUser, FiMail, FiPhone, FiShield, FiLoader, FiAlertCircle, FiSettings, FiLogIn, FiCamera } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import requestData from "../../../utils/requestApi";

/**
 * Componente de perfil do coordenador.
 * 
 * Exibe informações pessoais, permissões e configurações de segurança do usuário coordenador.
 * Permite visualizar dados da conta, status de segurança, sessões ativas e realizar
 * ações como upload de avatar e navegação para configurações.
 * 
 * @component
 * @example
 * return <CoordinatorProfile />
 * 
 * @returns {JSX.Element} Componente de perfil com informações do coordenador
 */
function CoordinatorProfile() {
  const navigate = useNavigate();
  /** @type {[boolean, Function]} Estado de carregamento dos dados do perfil */
  const [loading, setLoading] = useState(true);
  /** @type {[string|null, Function]} Estado de erro ao carregar perfil */
  const [error, setError] = useState(null);
  /** @type {[Object, Function]} Dados do perfil do usuário */
  const [profile, setProfile] = useState({ nome: "", email: "", telefone: "", permissao: "" });
  /** @type {[string, Function]} URL do avatar do usuário */
  const [avatarUrl, setAvatarUrl] = useState("");

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
  useEffect(() => {
    async function fetchMe() {
      try {
        setLoading(true);
        setError(null);
        const resp = await requestData('/user/me', 'GET', {}, true);
        if (resp.success && resp.data) {
          const u = resp.data.user || resp.data;
          setProfile({
            nome: u.name || u.username || "—",
            email: u.email || "—",
            telefone: u.phone || u.telefone || "—",
            permissao: u.role || u.permission || "Coordenador",
          });
          setAvatarUrl(u.avatar_url || "");
        } else {
          setError(resp.message || 'Não foi possível carregar seu perfil.');
        }
      } catch (e) {
        setError(e.message || 'Erro ao carregar perfil.');
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, []);

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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/coordinator/settings')}
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

        {loading ? (
          <div className="p-8">
            <div className="inline-flex items-center gap-3 text-gray-600"><FiLoader className="animate-spin" /> Carregando perfil...</div>
          </div>
        ) : error ? (
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
              <div className="relative">
                <div className="h-20 w-20 rounded-full ring-2 ring-white shadow bg-gray-100 overflow-hidden flex items-center justify-center text-gray-600">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold">{(profile.nome || 'U').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}</span>
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 inline-flex items-center justify-center h-9 w-9 rounded-full bg-yellow-400 text-gray-900 ring-2 ring-white cursor-pointer hover:bg-yellow-500">
                  <FiCamera />
                  <input type="file" accept="image/*" className="hidden" onChange={(e)=>{
                    const file = e.target.files?.[0]
                    if(file){
                      const url = URL.createObjectURL(file)
                      setAvatarUrl(url)
                      // Futuro: enviar via API
                    }
                  }} />
                </label>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Foto do perfil</p>
                <p className="text-xs text-gray-500">PNG ou JPG, até 2MB.</p>
              </div>
            </div>

            {/* Resumo da conta */}
            <div className="rounded-2xl ring-1 ring-gray-200 p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 flex items-center justify-center font-bold">
                {(profile.nome || 'U').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:gap-3">
                  <p className="text-sm font-semibold text-gray-900">{profile.nome}</p>
                  <button onClick={()=>navigate('/coordinator/settings')} className="mt-1 md:mt-0 inline-flex items-center gap-2 rounded-lg ring-1 ring-gray-300 px-2.5 py-1.5 text-xs text-gray-800 hover:bg-gray-50">Editar dados</button>
                </div>
                <p className="text-xs text-gray-600">{profile.email}</p>
              </div>
              <span className="inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium ring-1 bg-emerald-50 text-emerald-700 ring-emerald-200">{profile.permissao || 'Coordenador'}</span>
            </div>

            {/* Informações da conta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl ring-1 ring-gray-200 p-4">
                <p className="text-xs text-gray-500">Nome</p>
                <p className="text-sm font-medium text-gray-900">{profile.nome}</p>
              </div>
              <div className="rounded-xl ring-1 ring-gray-200 p-4 flex items-start gap-3">
                <FiMail className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">E-mail</p>
                  <p className="text-sm font-medium text-gray-900">{profile.email}</p>
                </div>
              </div>
              <div className="rounded-xl ring-1 ring-gray-200 p-4 flex items-start gap-3">
                <FiPhone className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Telefone</p>
                  <p className="text-sm font-medium text-gray-900">{profile.telefone}</p>
                </div>
              </div>
              <div className="rounded-xl ring-1 ring-gray-200 p-4 flex items-start gap-3">
                <FiShield className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Permissão</p>
                  <p className="text-sm font-medium text-gray-900">{profile.permissao}</p>
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
                  <button onClick={()=>navigate('/coordinator/settings')} className="inline-flex items-center gap-2 rounded-lg ring-1 ring-gray-300 px-3 py-2 text-xs text-gray-800 hover:bg-gray-50"><FiSettings /> Gerenciar segurança</button>
                </div>
              </div>
              <div className="rounded-xl ring-1 ring-gray-200 p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Sessão</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>Último acesso: <span className="font-medium">—</span></li>
                  <li>Dispositivo atual: <span className="font-medium">Web</span></li>
                </ul>
                <div className="mt-3">
                  <button className="inline-flex items-center gap-2 rounded-lg ring-1 ring-gray-300 px-3 py-2 text-xs text-gray-800 hover:bg-gray-50"><FiLogIn /> Encerrar sessões</button>
                </div>
              </div>
            </div>

            {/* Ações rápidas */}
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={()=>navigate('/coordinator/settings')} className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 text-gray-900 px-4 py-2 text-sm font-semibold hover:bg-yellow-500"><FiSettings /> Abrir configurações</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CoordinatorProfile;


