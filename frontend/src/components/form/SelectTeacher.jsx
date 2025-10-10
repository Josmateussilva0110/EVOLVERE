import { useRef, useState, useEffect } from "react";

/* ---------------------- CustomSelect (estilizado, acessível) ---------------------- */

/**
 * CustomSelect
 *
 * Componente de seleção estilizado e acessível, pensado para substituir um <select>
 * nativo quando é necessário maior controle visual e de interação.
 *
 * Comportamento / características:
 * - Suporta teclado (ArrowUp, ArrowDown, Enter, Escape).
 * - Fecha ao clicar fora do componente.
 * - Mantém destaque (highlight) visual do item navegável.
 * - Utiliza ARIA attributes: aria-haspopup, aria-expanded, role="listbox", role="option".
 * - Renderiza placeholder quando nenhum valor está selecionado.
 *
 * Props:
 * @param {string} value - Valor atualmente selecionado (corresponde a `option.value`).
 * @param {(value: string) => void} onChange - Callback chamado quando o usuário seleciona um item.
 * @param {Array<{value: string, label: string}>} options - Lista de opções disponíveis.
 * @param {string} [placeholder="Selecione o tipo"] - Texto exibido quando nada está selecionado.
 * @param {string} id - ID usado para ligação aria (aria-labelledby) e identificação do botão.
 *
 * Retorno:
 * @returns {JSX.Element} Elemento React que representa o select customizado.
 */
export default function CustomSelect({ value, onChange, options = [], placeholder = "Selecione o tipo", id }) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    const idx = options.findIndex((o) => o.value === value);
    if (idx >= 0) setHighlight(idx);
  }, [value, options]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => (options.length ? (h + 1) % options.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => (options.length ? (h - 1 + options.length) % options.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = options[highlight];
      if (opt) {
        onChange(opt.value);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        onKeyDown={handleKeyDown}
        className="w-full text-left mt-2 bg-transparent border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <div className="truncate">
          {selected ? selected.label : <span className="text-slate-400">{placeholder}</span>}
        </div>
        <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-labelledby={id}
          tabIndex={-1}
          className="absolute z-50 mt-2 w-full max-h-56 overflow-auto rounded-xl border border-white/10 bg-slate-800 shadow-lg py-1"
        >
          {options.map((opt, i) => {
            const isSelected = value === opt.value;
            const isHighlighted = i === highlight;
            return (
              <li
                key={opt.value + i}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlight(i)}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`cursor-pointer px-4 py-2 text-sm flex items-center gap-2 ${
                  isHighlighted ? "bg-indigo-600/40 text-white" : "text-slate-200 hover:bg-white/5"
                } ${isSelected ? "font-semibold" : ""}`}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}