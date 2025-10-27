import { useState, useRef } from "react";
import { Calendar, Clock } from "lucide-react";

/**
 * DateTimePicker
 *
 * Componente de seleção de data e hora estilizado.
 *
 * Props:
 * @param {string} deadline - Data/hora selecionada no formato "YYYY-MM-DDTHH:mm"
 * @param {function} setDeadline - Função setter para atualizar o valor
 */
export default function DateTimePicker({ deadline, setDeadline }) {
  const inputRef = useRef(null);
  const [hover, setHover] = useState(false);

  // Gera a data/hora mínima (agora) no formato compatível com datetime-local
  const now = new Date();
  const minDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16); // "YYYY-MM-DDTHH:mm"

  // Formata para exibição amigável
  const formattedDateTime = deadline
    ? new Date(deadline).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Selecionar data e hora limite";

  return (
    <div className="space-y-2">
      <label className="block font-semibold text-slate-200 mb-2">
        Prazo de Entrega *
      </label>

      {/* Botão customizado que dispara o seletor nativo */}
      <button
        type="button"
        onClick={() => inputRef.current?.showPicker()}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg 
          border border-white/10 bg-white/5 text-left transition-all 
          ${hover ? "bg-white/10" : ""}
        `}
      >
        <div className="flex items-center gap-2 text-slate-200 font-medium">
          <Calendar className="w-5 h-5 text-yellow-400" />
          <span>{formattedDateTime}</span>
        </div>
        <Clock className="w-5 h-5 text-slate-300" />
      </button>

      {/* Input datetime-local oculto com min */}
      <input
        ref={inputRef}
        type="datetime-local"
        value={deadline}
        min={minDateTime} // impede data/hora anterior à atual
        onChange={(e) => setDeadline(e.target.value)}
        className="hidden"
        required
      />

      {deadline && (
        <p className="text-sm text-slate-400">
          O formulário ficará disponível até{" "}
          <span className="text-yellow-400 font-semibold">
            {formattedDateTime}
          </span>
        </p>
      )}
    </div>
  );
}
