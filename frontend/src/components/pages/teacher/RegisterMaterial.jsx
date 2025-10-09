import React, { useRef, useState, useEffect } from "react";
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  CheckCircle,
  X,
  File,
} from "lucide-react";


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
function CustomSelect({ value, onChange, options = [], placeholder = "Selecione o tipo", id }) {
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

/* ---------------------- Componente Principal ---------------------- */

/**
 * CadastrarMaterial
 *
 * Componente principal para cadastro de materiais na biblioteca do curso.
 * Fornece inputs para título, descrição, tipo e upload de arquivo com suporte a:
 * - Drag and drop
 * - Validação de tamanho (máx. 50MB)
 * - Visualização básica do arquivo selecionado
 * - Acessibilidade básica (botões, labels, comportamento de teclado para upload via Enter)
 *
 * Estado interno:
 * - titulo: string — título do material
 * - descricao: string — descrição opcional
 * - tipo: string — tipo do material (pdf, doc, ppt, video, outro)
 * - arquivo: File | null — arquivo selecionado
 * - dragActive: boolean — estado visual para drag-and-drop
 * - error: string — mensagem de erro a ser exibida ao usuário
 *
 * Principais handlers / utilitários (definidos localmente):
 * - handleVoltar: volta na navegação do browser (window.history.back()).
 * - validateFile(file): valida o arquivo (tamanho máximo) e atualiza `error` quando necessário.
 * - handleFileChange(e): lida com seleção via input[type=file].
 * - handleDrop(e): lida com drop de arquivo no contêiner.
 * - handleDragOver(e), handleDragLeave(e): controlam estado visual de drag.
 * - clearFile(): remove o arquivo selecionado.
 * - handleCadastrar(): valida campos obrigatórios e simula cadastro (console.log + alert).
 *
 * Observações de usabilidade:
 * - O campo 'Cadastrar' é habilitado apenas quando título, tipo e arquivo estão presentes.
 * - O upload é simulado; substitua a lógica em `handleCadastrar` para integrar com back-end.
 *
 * Retorno:
 * @returns {JSX.Element} Formulário completo de cadastro de material.
 */
function CadastrarMaterial() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (arquivo) setError("");
  }, [arquivo]);

  const handleVoltar = () => window.history.back();

  /**
   * validateFile
   *
   * Valida um File antes de aceitá-lo como `arquivo`:
   * - Verifica existência
   * - Verifica tamanho (máx. 50MB)
   *
   * @param {File} file - O arquivo a validar
   * @returns {boolean} true se válido; false e atualiza `error` caso contrário
   */
  const validateFile = (file) => {
    if (!file) return false;
    if (file.size > 50 * 1024 * 1024) {
      setError("Arquivo muito grande. Máx. 50MB.");
      return false;
    }
    return true;
  };

  /**
   * handleFileChange
   *
   * Handler para input[type=file]. Atualiza o estado `arquivo` quando o arquivo
   * selecionado passa na validação.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - evento de mudança do input file
   */
  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f && validateFile(f)) setArquivo(f);
  };

  /**
   * handleDrop
   *
   * Handler para evento de drop. Previne comportamento padrão, desativa o estado
   * visual de drag e tenta validar e atribuir o arquivo arrastado.
   *
   * @param {React.DragEvent<HTMLDivElement>} e - evento de drop
   */
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f && validateFile(f)) setArquivo(f);
  };

  /**
   * handleDragOver
   *
   * Previne o comportamento padrão e ativa o destaque visual do contêiner de drop.
   *
   * @param {React.DragEvent<HTMLDivElement>} e - evento de drag over
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  /**
   * handleDragLeave
   *
   * Previne comportamento padrão e remove o destaque visual do contêiner de drop.
   *
   * @param {React.DragEvent<HTMLDivElement>} e - evento de drag leave
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  /**
   * clearFile
   *
   * Remove o arquivo atualmente selecionado e limpa mensagens de erro relacionadas a arquivo.
   */
  const clearFile = () => setArquivo(null);

  /**
   * handleCadastrar
   *
   * Valida campos obrigatórios (título, tipo e arquivo). Em caso de sucesso,
   * realiza uma simulação de cadastro (console.log e alert). Em produção,
   * aqui é o lugar para enviar os dados ao servidor (fetch / axios / FormData).
   */
  const handleCadastrar = () => {
    if (!titulo.trim() || !tipo || !arquivo) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    console.log("Cadastrar material:", { titulo, descricao, tipo, arquivo });
    alert("Material cadastrado (simulação).");
  };

  const isValid = titulo.trim() && tipo && arquivo;
  const fileExt = arquivo ? arquivo.name.split(".").pop().toLowerCase() : "";

  return (
    // AJUSTE 1: Padding lateral responsivo
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 sm:px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        {/* AJUSTE 2: Layout do cabeçalho responsivo */}
        <div className="flex flex-col items-start sm:flex-row sm:items-center gap-4 mb-6">
          <button
            onClick={handleVoltar}
            aria-label="Voltar"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Cadastrar Material</h2>
            <p className="text-sm text-slate-300">Adicione um material para a biblioteca do curso</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário */}
          <div className="lg:col-span-2 bg-white/6 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {/* Título */}
              <div>
                <label className="text-sm font-medium text-slate-200">Título <span className="text-rose-400">*</span></label>
                <input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  type="text"
                  placeholder="Digite o título do material"
                  className="mt-2 w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 placeholder:text-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="text-sm font-medium text-slate-200">Descrição</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={4}
                  placeholder="Breve descrição (opcional)"
                  className="mt-2 w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 placeholder:text-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                />
              </div>

              {/* Tipo e Upload em linha */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-1">
                  <label className="text-sm font-medium text-slate-200">Tipo <span className="text-rose-400">*</span></label>
                  <CustomSelect
                    id="tipo-material"
                    value={tipo}
                    onChange={(v) => setTipo(v)}
                    options={[
                      { value: "", label: "Selecione o tipo" },
                      { value: "pdf", label: "PDF" },
                      { value: "doc", label: "DOC" },
                      { value: "ppt", label: "PPT" },
                      { value: "video", label: "Vídeo" },
                      { value: "outro", label: "Outro" },
                    ]}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-200">Arquivo <span className="text-rose-400">*</span></label>

                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`mt-2 w-full border-2 rounded-xl p-4 flex items-center gap-4 justify-between cursor-pointer transition ${
                      dragActive ? "border-indigo-400 bg-white/6" : "border-white/10 bg-transparent"
                    }`}
                    onClick={() => inputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') inputRef.current?.click(); }}
                  >
                    <div className="flex items-center gap-3 overflow-hidden"> {/* Adicionado overflow-hidden para garantir o truncate */}
                      <div className="p-3 rounded-lg bg-white/6 flex-shrink-0"> {/* Adicionado flex-shrink-0 para o ícone não encolher */}
                        <UploadCloud className="w-6 h-6 text-white" />
                      </div>
                      <div className="overflow-hidden"> {/* Adicionado overflow-hidden para garantir o truncate */}
                        <div className="text-sm text-slate-200">
                          {arquivo ? (
                            <span className="flex items-center gap-2">
                              <File className="w-4 h-4 flex-shrink-0" />
                              {/* AJUSTE 3: Largura máxima do nome do arquivo responsiva */}
                              <strong className="truncate max-w-[12rem] sm:max-w-[18rem]">{arquivo.name}</strong>
                            </span>
                          ) : (
                            <span>Arraste ou clique para selecionar</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Máx. 50MB • PDF, DOC, etc.</div>
                      </div>
                    </div>

                    {arquivo ? (
                      <div className="flex items-center gap-3">
                        <div className="text-xs text-slate-300">{Math.round(arquivo.size / 1024)} KB</div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); clearFile(); }}
                          className="p-2 rounded-md bg-white/6 hover:bg-white/10"
                          aria-label="Remover arquivo"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm text-indigo-300 font-medium hidden sm:block">Selecionar</div>
                    )}

                    <input
                      ref={inputRef}
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* erro */}
                  {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
                </div>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <button
                  type="button"
                  onClick={handleCadastrar}
                  disabled={!isValid}
                  className={`flex-1 inline-flex items-center justify-center gap-3 rounded-xl py-3 font-semibold text-sm transition shadow ${
                    isValid
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 hover:scale-[1.02]"
                      : "bg-white/6 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {isValid ? <CheckCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  Cadastrar
                </button>

                <button
                  type="button"
                  onClick={() => { setTitulo(""); setDescricao(""); setTipo(""); setArquivo(null); setError(""); }}
                  className="px-4 py-3 rounded-xl bg-white/6 text-sm font-medium"
                >
                  Limpar
                </button>
              </div>
            </form>
          </div>

          {/* Painel lateral */}
          <aside className="lg:col-span-1 bg-gradient-to-b from-[#08112a] to-[#071033] border border-white/6 rounded-2xl p-5 text-slate-200 shadow-lg">
            <h3 className="flex items-center gap-2 font-semibold mb-3 text-white">
              <FileText className="w-5 h-5" /> Informações
            </h3>
            <ul className="text-sm space-y-3">
              <li className="flex items-start gap-3">
                <div className="pt-1"><CheckCircle className="w-4 h-4 text-indigo-300" /></div>
                <div>
                  Campos obrigatórios marcados com <span className="text-rose-400">*</span>.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="pt-1"><File className="w-4 h-4 text-indigo-300" /></div>
                <div>
                  Aceitamos formatos comuns: <span className="font-medium">PDF, DOC, PPT, MP4</span>.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="pt-1"><X className="w-4 h-4 text-indigo-300" /></div>
                <div>
                  Tamanho máximo recomendado: <span className="font-medium">50MB</span>.
                </div>
              </li>
            </ul>

            {/* Preview simples */}
            {arquivo && (
              <div className="mt-5 bg-white/4 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-white/6 rounded-md flex-shrink-0">
                      <File className="w-5 h-5" />
                    </div>
                    <div className="text-sm overflow-hidden">
                      <div className="font-medium text-white truncate max-w-[12rem]">{arquivo.name}</div>
                      <div className="text-xs text-slate-300">{fileExt.toUpperCase()}</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300">{Math.round(arquivo.size / 1024)} KB</div>
                </div>
              </div>
            )}

            <div className="mt-6 text-xs text-slate-400">
              Dica: use títulos curtos e descritivos para facilitar a busca.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CadastrarMaterial;
