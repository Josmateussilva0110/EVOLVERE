import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiShield } from "react-icons/fi";

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

  /** @type {[boolean, Function]} notifEmail - Estado de notificações por e-mail */
  const [notifEmail, setNotifEmail] = useState(true);

  /** @type {[boolean, Function]} notifWhats - Estado de notificações por WhatsApp */
  const [notifWhats, setNotifWhats] = useState(false);

  /** @type {[string, Function]} novoEmail - Novo e-mail informado pelo usuário */
  const [novoEmail, setNovoEmail] = useState("");

  /** @type {[string, Function]} emailAtual - E-mail atual do usuário */
  const [emailAtual, setEmailAtual] = useState("");

  /** @type {[string, Function]} senhaAtual - Senha atual (para autenticação da troca) */
  const [senhaAtual, setSenhaAtual] = useState("");

  /** @type {[string, Function]} novaSenha - Nova senha que será definida */
  const [novaSenha, setNovaSenha] = useState("");

  /** @type {[string, Function]} confirmarSenha - Confirmação da nova senha */
  const [confirmarSenha, setConfirmarSenha] = useState("");

  /**
   * Verifica se a senha é forte o suficiente.
   *
   * Critérios:
   * - Mínimo de 8 caracteres
   * - Pelo menos uma letra minúscula
   * - Pelo menos uma letra maiúscula
   * - Pelo menos um número
   * - Pelo menos um caractere especial
   *
   * @param {string} pwd - Senha a ser validada
   * @returns {boolean} true se for considerada forte, false caso contrário
   */
  const isStrongPassword = (pwd) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(pwd);
  };

  /**
   * Manipula o envio do formulário de configurações.
   *
   * Validações aplicadas:
   * - Verifica e-mail válido e diferente do atual.
   * - Confere se a senha atual foi informada.
   * - Garante que a nova senha seja diferente da atual e forte.
   * - Valida se nova senha e confirmação coincidem.
   *
   * Emite `alert()` de sucesso ou erro conforme o resultado.
   *
   * @param {Event} e - Evento de submit do formulário
   * @returns {void}
   */
  const handleSalvar = (e) => {
    e.preventDefault();
    // Validação e-mail
    if (novoEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(novoEmail)) {
        alert("Informe um e-mail válido.");
        return;
      }
      if (emailAtual && novoEmail === emailAtual) {
        alert("O novo e-mail deve ser diferente do e-mail atual.");
        return;
      }
    }

    // Validação senha
    if (novaSenha || confirmarSenha || senhaAtual) {
      if (!senhaAtual) {
        alert("Informe a senha atual.");
        return;
      }
      if (!novaSenha) {
        alert("Informe a nova senha.");
        return;
      }
      if (novaSenha === senhaAtual) {
        alert("A nova senha deve ser diferente da atual.");
        return;
      }
      if (!isStrongPassword(novaSenha)) {
        alert(
          "A nova senha deve ter no mínimo 8 caracteres, com maiúscula, minúscula, número e caractere especial."
        );
        return;
      }
      if (novaSenha !== confirmarSenha) {
        alert("A confirmação de senha não confere.");
        return;
      }
    }

    // Futuro: persistir alterações em API
    alert("Configurações salvas com sucesso.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060060] py-10 px-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl ring-1 ring-gray-200 overflow-hidden">
        {/* Cabeçalho */}
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

        {/* Formulário de configurações */}
        <form className="p-6 space-y-6" onSubmit={handleSalvar}>
          {/* E-mail */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={novoEmail}
              placeholder={emailAtual || "Digite um e-mail"}
              onChange={(e) => setNovoEmail(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Notificações */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Notificações</label>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notifEmail}
                onChange={() => setNotifEmail(!notifEmail)}
              />
              <span>E-mail</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notifWhats}
                onChange={() => setNotifWhats(!notifWhats)}
              />
              <span>WhatsApp</span>
            </div>
          </div>

          {/* Alterar senha */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Alterar senha</label>
            <input
              type="password"
              placeholder="Senha atual"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="password"
              placeholder="Nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="password"
              placeholder="Confirmar nova senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Botão salvar */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-semibold"
          >
            Salvar alterações
          </button>
        </form>
      </div>
    </div>
  );
}

export default CoordinatorSettings;
