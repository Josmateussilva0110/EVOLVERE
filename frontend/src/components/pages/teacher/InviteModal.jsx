import React, { useState, useEffect } from "react";
import { Users, X, Copy, Check, Clock, Link as LinkIcon } from "lucide-react";
import requestData from "../../../utils/requestApi"

/**
 * InviteModal.jsx
 * Componente de interface para geração de links de convite para uma turma.
 *
 * Este módulo contém:
 * - `useInviteGenerator`: hook que encapsula toda a lógica de geração de convites
 *   (validação de tempo, cópia automática, controle de estado e chamada à API);
 * - Vários componentes de UI auxiliares (Button, Select, Input, ConfigSection,
 *   InviteOption, InviteResultDisplay) usados para compor o modal;
 * - O componente padrão exportado `InviteModal` que renderiza o modal completo.
 *
 * Notas de design:
 * - Comentários e textos estão em Português (pt-BR);
 * - Opções de tempo customizado são convertidas para minutos no momento da
 *   geração e validadas para garantir números positivos;
 * - A função `requestData` é simulada neste arquivo apenas para permitir
 *   desenvolvimento local sem backend; em produção ela deve ser substituída
 *   pelo util real (ex: `requestData` do projeto que retorna { success, data }).
 *
 * Uso básico:
 * <InviteModal open={true} onClose={() => {}} classId={123} />
 *
 * Autores: equipe Evolvere
 * Data: 2025-10-15
 */

/* ===== Hook de lógica interno ===== */
/**
 * useInviteGenerator
 * Hook que gerencia o estado e a lógica para gerar links de convite para uma
 * turma especificada por `classId`.
 *
 * Responsabilidades:
 * - Validar os inputs do usuário (tempo customizado, número de usos);
 * - Calcular o valor em minutos para envio à API;
 * - Chamar a API para criar o link de convite e armazenar o resultado;
 * - Fornecer helpers para copiar o link para a área de transferência e resetar
 *   o formulário.
 *
 * @param {string|number} classId - Identificador da turma (usado na request).
 * @returns {Object} { form, handleFormChange, loading, error, invite, copied, generate, copyLink, reset }
 * - form: objeto com os valores atuais do formulário
 * - handleFormChange(field, value): atualiza um campo do formulário
 * - loading: booleano indicando se a geração está em curso
 * - error: string com mensagem de erro (ou null)
 * - invite: objeto retornado pela API contendo { link, expires_at, max_uses }
 * - copied: booleano indicando sucesso temporário de cópia
 * - generate(): função que dispara a criação do convite
 * - copyLink(): copia o link gerado para a área de transferência
 * - reset(): limpa estado e volta aos valores padrão
 */
const useInviteGenerator = (classId) => {
  const [form, setForm] = useState({
    expires: "1440",
    customExpiresValue: "1",
    customExpiresUnit: "days",
    maxUses: "0",
    customMaxUses: "10",
  });
  const [loading, setLoading] = useState(false);
  const [invite, setInvite] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const copyToClipboard = async (text, isAutoCopy = false) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      if (!isAutoCopy) {
        setError("Falha ao copiar.");
      }
    }
  };

  const convertToMinutes = (value, unit) => {
    const numericValue = Number(value);
    if (isNaN(numericValue) || numericValue <= 0) return 0;
    switch (unit) {
      case "hours":
        return numericValue * 60;
      case "days":
        return numericValue * 24 * 60;
      default:
        return numericValue;
    }
  };

  const generate = async () => {
    setLoading(true);
    setError(null);
    setInvite(null);
    const expiresVal =
      form.expires === "custom"
        ? convertToMinutes(form.customExpiresValue, form.customExpiresUnit)
        : Number(form.expires);
    const maxUsesVal =
      form.maxUses === "custom" ? Number(form.customMaxUses) : Number(form.maxUses);

    if (
      (form.expires === "custom" &&
        (isNaN(Number(form.customExpiresValue)) || Number(form.customExpiresValue) <= 0)) ||
      (form.maxUses === "custom" && (isNaN(maxUsesVal) || maxUsesVal <= 0))
    ) {
      setError("Valores customizados devem ser números positivos.");
      setLoading(false);
      return;
    }

    try {
      const body = { expires_in_minutes: expiresVal, max_uses: maxUsesVal, role: "student" };
      const resp = await requestData(`/classes/${classId}/invites`, "POST", body, true);
      
        if (resp?.success && resp.data?.success && resp.data?.data?.code) {
        setInvite(resp.data.data);
        await copyToClipboard(resp.data.data.code, true);
      } else {
        setError(resp?.data?.message || reps?.message || "Ocorreu um erro.");
      }
    } catch (e) {
      console.error("Erro de rede ao gerar convite:", e);
      setError("Erro de rede.");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (invite?.code) {
      copyToClipboard(invite.code);
    }
  };

  const reset = () => {
    setInvite(null);
    setError(null);
    setForm({
      expires: "1440",
      customExpiresValue: "1",
      customExpiresUnit: "days",
      maxUses: "0",
      customMaxUses: "10",
    });
  };

  return { form, handleFormChange, loading, error, invite, copied, generate, copyCode, reset };
};

/* ===== Componentes UI ===== */

/**
 * Button
 * Botão estilizado reutilizável com variantes `primary` e `secondary`.
 *
 * @param {Object} props
 * @param {string} [props.className] - Classes adicionais (Tailwind)
 * @param {string} [props.variant] - 'primary' | 'secondary'
 * @param {React.ReactNode} props.children - Conteúdo interno do botão
 */
const Button = ({ className = "", variant = "secondary", children, ...props }) => {
  const baseClasses =
    "px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
  const variantClasses = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30",
    secondary: "bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100",
  };
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

/**
 * Select
 * Input select estilizado para tema escuro.
 * Aceita as mesmas props que um elemento <select> nativo.
 */
const Select = (props) => (
  <select
    {...props}
    className={
      "w-full rounded-md p-2 bg-slate-800 text-slate-200 border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition " +
      (props.className || "")
    }
  />
);

/**
 * Input
 * Campo de entrada estilizado para tema escuro.
 * Aceita as mesmas props que um elemento <input> nativo.
 */
const Input = (props) => (
  <input
    {...props}
    className={
      "w-full rounded-md p-2 bg-slate-800 text-slate-200 border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition " +
      (props.className || "")
    }
  />
);

/**
 * ConfigSection
 * Pequeno container com título e conteúdo usado para agrupar opções do modal.
 *
 * @param {Object} props
 * @param {string} props.title - Título da seção
 * @param {React.ReactNode} props.children - Conteúdo dentro da seção
 */
const ConfigSection = ({ title, children }) => (
  <div className="space-y-4">
    <h4 className="text-md font-semibold text-slate-200 border-b border-slate-700 pb-2">{title}</h4>
    <div className="space-y-6 pl-2">{children}</div>
  </div>
);

/**
 * InviteOption
 * - Renderiza options com style inline para corrigir compatibilidade de cor em alguns navegadores.
 */
/**
 * InviteOption
 * Componente que renderiza uma opção do formulário de geração de convites.
 * Suporta valores pré-definidos e um modo "customizado" com campos numéricos
 * adicionais (valor e unidade).
 *
 * @param {Object} props
 * @param {string} props.label - Rótulo da opção (ex: 'Expiração')
 * @param {string} props.description - Texto de auxílio
 * @param {Array<{value:string,label:string}>} props.options - Opções padrão
 * @param {boolean} props.isCustom - Se o select está no modo custom
 * @param {string} props.value - Valor atual do select
 * @param {function} props.onChange - Handler de mudança do select
 * @param {string|number} props.customValue - Valor customizado quando aplicável
 * @param {function} props.onCustomValueChange - Handler para valor customizado
 * @param {boolean} props.showCustomUnit - Mostrar select de unidade (min/hours/days)
 * @param {string} props.customUnit - Unidade customizada atual
 * @param {function} props.onCustomUnitChange - Handler para mudança de unidade
 * @param {Array} props.customUnitOptions - Opções de unidade
 */
const InviteOption = ({ label, description, options = [], isCustom = false, value, onChange, customValue, onCustomValueChange, showCustomUnit = false, customUnit, onCustomUnitChange, customUnitOptions = [] }) => {
  // cor segura para background/texte das options (dark theme)
  const optionStyle = { backgroundColor: "#0f172a", color: "#e2e8f0" };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={value} onChange={onChange} className={isCustom ? "sm:w-1/3" : "w-full"}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={optionStyle}>
              {opt.label}
            </option>
          ))}
          <option value="custom" style={optionStyle}>
            Customizado
          </option>
        </Select>

        {isCustom && (
          <div className="flex flex-1 gap-2">
            <Input
              type="number"
              min="1"
              value={customValue}
              onChange={onCustomValueChange}
              placeholder="Valor"
              className="flex-1"
            />
            {showCustomUnit && (
              <Select value={customUnit} onChange={onCustomUnitChange} className="flex-1">
                {customUnitOptions.map((unit) => (
                  <option key={unit.value} value={unit.value} style={optionStyle}>
                    {unit.label}
                  </option>
                ))}
              </Select>
            )}
          </div>
        )}
      </div>
      <p className="text-xs text-slate-400">{description}</p>
    </div>
  );
};

/**
 * InviteResultDisplay
 * Visualiza os dados do convite gerado (link, validade, usos) e fornece ações
 * rápidas (copiar, abrir link).
 *
 * @param {Object} props
 * @param {Object} props.invite - Objeto retornado pela API com { link, expires_at, max_uses }
 * @param {boolean} props.copied - Indica se o link já foi copiado recentemente
 * @param {function} props.onCopy - Função chamada ao clicar no botão copiar
 */
const InviteResultDisplay = ({ invite, copied, onCopy }) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3">
    <div className="flex justify-between items-center gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Código Gerado</p>
        {/* ----> MUDANÇA PRINCIPAL DE EXIBIÇÃO <---- */}
        <p className="text-2xl sm:text-3xl font-mono tracking-widest text-emerald-400 break-all py-2">
          {invite.code}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={onCopy} title={copied ? "Copiado!" : "Copiar"} className="p-2 rounded-md text-slate-300 hover:bg-slate-700 transition-colors">
          {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
        </button>
        {/* ----> REMOVIDO <---- O ícone de link não faz mais sentido */}
      </div>
    </div>
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-700/50 gap-2">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4" />
        <span>{invite.expires_at ? `Expira em: ${new Date(invite.expires_at).toLocaleString('pt-BR')}` : "Não expira"}</span>
      </div>
      <span>Usos: {invite.max_uses > 0 ? invite.max_uses : "Ilimitados"}</span>
    </div>
  </div>
);

/* ===== Componente principal exportado ===== */

export default function InviteModal({ open, onClose, classId }) {
  /**
   * Props:
   * - open: boolean que controla visibilidade do modal
   * - onClose: callback quando o modal deve ser fechado
   * - classId: id (string|number) da turma para a qual o convite será gerado
   */
  const { form, handleFormChange, loading, error, invite, copied, generate, copyCode, reset } = useInviteGenerator(classId);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-full">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">Gerar Convite</h3>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo */}
        <div className="space-y-8">
          <ConfigSection title="Opções do Convite">
            <InviteOption
              label="Expiração"
              description="Tempo de validade do link."
              value={form.expires}
              onChange={(e) => handleFormChange("expires", e.target.value)}
              options={[
                { value: "60", label: "1 hora" },
                { value: "1440", label: "1 dia" },
                { value: "10080", label: "7 dias" },
                { value: "0", label: "Permanente" },
              ]}
              isCustom={form.expires === "custom"}
              customValue={form.customExpiresValue}
              onCustomValueChange={(e) => handleFormChange("customExpiresValue", e.target.value)}
              showCustomUnit={true}
              customUnit={form.customExpiresUnit}
              onCustomUnitChange={(e) => handleFormChange("customExpiresUnit", e.target.value)}
              customUnitOptions={[
                { value: "minutes", label: "Minutos" },
                { value: "hours", label: "Horas" },
                { value: "days", label: "Dias" },
              ]}
            />

            <InviteOption
              label="Limite de Usos"
              description="Nº máximo de ativações do link."
              value={form.maxUses}
              onChange={(e) => handleFormChange("maxUses", e.target.value)}
              options={[
                { value: "1", label: "1 uso" },
                { value: "5", label: "5 usos" },
                { value: "25", label: "25 usos" },
                { value: "0", label: "Sem limite" },
              ]}
              isCustom={form.maxUses === "custom"}
              customValue={form.customMaxUses}
              onCustomValueChange={(e) => handleFormChange("customMaxUses", e.target.value)}
            />
          </ConfigSection>

          {/* Ações */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-700/50">
            <Button variant="secondary" onClick={reset} disabled={loading}>
              Limpar
            </Button>
            <Button variant="primary" onClick={generate} disabled={loading}>
              {loading ? "Gerando..." : "Gerar código de Convite"}
            </Button>
          </div>

          {/* Resultados */}
          {error && <div className="text-sm text-center text-red-400 p-3 bg-red-900/50 border border-red-500/20 rounded-md">{error}</div>}
          {invite && <InviteResultDisplay invite={invite} copied={copied} onCopy={copyCode} />}
        </div>
      </div>
    </div>
  );
}
