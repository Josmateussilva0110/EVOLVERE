import { FiArrowLeft, FiUser, FiMail, FiPhone, FiShield, FiLoader, FiAlertCircle, FiSettings, FiCamera } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import requestData from "../../../utils/requestApi";

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

  /** @type {[boolean, Function]} loading - Estado de carregamento dos dados do perfil */
  const [loading, setLoading] = useState(false);

  /** @type {[string|null, Function]} error - Mensagem de erro ao buscar o perfil */
  const [error, setError] = useState(null);

  /** @type {[Object, Function]} profile - Informações do usuário coordenador */
  const [profile, setProfile] = useState({ nome: "nome", email: "email@gmail.com", permissao: "admin" });

  /** @type {[string, Function]} avatarUrl - URL da imagem de avatar do usuário */
  const [avatarUrl, setAvatarUrl] = useState("");

  /**
   * Efeito: Carregar dados do perfil do coordenador.
   *
   * O que faz:
   * - Chama a API `/user/me` via `requestData`.
   * - Atualiza os estados `profile`, `avatarUrl`, `loading` e `error`.
   *
   * Entradas:
   * - Nenhuma direta (usa o usuário logado).
   *
   * Saída:
   * - Estado `profile` atualizado com dados do backend.
   *
   * Dependências:
   * - Executado apenas uma vez no mount do componente.
   */
  useEffect(() => {
    const fetchMe = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await requestData("get", "/user/me");
        setProfile(response);
        if (response.avatar) setAvatarUrl(response.avatar);
      } catch (err) {
        setError("Falha ao carregar perfil do usuário.");
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060060] py-10 px-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl ring-1 ring-gray-200 overflow-hidden">
        {/* Cabeçalho com botão voltar e configurações */}
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

        {/* Loader */}
        {loading ? (
          <div className="p-8">
            <div className="inline-flex items-center gap-3 text-gray-600"><FiLoader className="animate-spin" /> Carregando perfil...</div>
          </div>
        ) : error ? (
          /* Mensagem de erro */
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
          /* Conteúdo do perfil */
          <div className="p-6 space-y-6">
            {/* Avatar e upload */}
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" /> : <FiCamera className="text-gray-400 text-3xl" />}
              </div>
              <button className="px-3 py-1 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600">Alterar Avatar</button>
            </div>

            {/* Informações básicas */}
            <div className="space-y-2">
              <p><strong>Nome:</strong> {profile.nome}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Permissão:</strong> {profile.permissao}</p>
            </div>

            {/* Ações rápidas */}
            <div className="flex gap-3">
              <button className="px-3 py-2 rounded-lg bg-green-500 text-white text-sm hover:bg-green-600">Gerenciar Segurança</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CoordinatorProfile;
