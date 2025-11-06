import React, { useRef, useState, useEffect, useContext } from "react";
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  CheckCircle,
  X,
  File,
} from "lucide-react";

import CustomSelect from "../../form/SelectTeacher";
import requestData from "../../../utils/requestApi";
import useFlashMessage from "../../../hooks/useFlashMessage"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { Context } from "../../../context/UserContext"


/**
 * CadastrarMaterial
 *
 * Componente principal para cadastro de materiais na biblioteca do curso.
 * Fornece inputs para título, descrição, type e upload de archive com suporte a:
 * - Drag and drop
 * - Validação de tamanho (máx. 50MB)
 * - Visualização básica do archive selecionado
 * - Acessibilidade básica (botões, labels, comportamento de teclado para upload via Enter)
 *
 * Estado interno:
 * - title: string — título do material
 * - description: string — descrição opcional
 * - type: string — type do material (pdf, doc, ppt, video, outro)
 * - archive: File | null — archive selecionado
 * - dragActive: boolean — estado visual para drag-and-drop
 * - error: string — mensagem de erro a ser exibida ao usuário
 *
 * Principais handlers / utilitários (definidos localmente):
 * - handleVoltar: volta na navegação do browser (window.history.back()).
 * - validateFile(file): valida o archive (tamanho máximo) e atualiza `error` quando necessário.
 * - handleFileChange(e): lida com seleção via input[type=file].
 * - handleDrop(e): lida com drop de archive no contêiner.
 * - handleDragOver(e), handleDragLeave(e): controlam estado visual de drag.
 * - clearFile(): remove o archive selecionado.
 * - handleCadastrar(): valida campos obrigatórios e simula cadastro (console.log + alert).
 *
 * Observações de usabilidade:
 * - O campo 'Cadastrar' é habilitado apenas quando título, type e archive estão presentes.
 * - O upload é simulado; substitua a lógica em `handleCadastrar` para integrar com back-end.
 *
 * Retorno:
 * @returns {JSX.Element} Formulário completo de cadastro de material.
 */
function CadastrarMaterial() {
  const [title, setTitulo] = useState("");
  const [description, setDescricao] = useState("");
  const [type, setTipo] = useState("");
  const [archive, setArquivo] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const { setFlashMessage } = useFlashMessage()
  const navigate = useNavigate()
  const { user } = useContext(Context)
  const { id } = useParams()
  const [subject_id, setSubject_id] = useState(null)
  const location = useLocation()
  const origin = location.state?.origin || null


  if(origin === 'class') {
    useEffect(() => {
      async function fetchSubject_id() {
        const response = await requestData(`/classes/subject_id/${id}`, 'GET', {}, true)
        if(response.success) {
          setSubject_id(response.data.subject_id)
        }
      }
      fetchSubject_id()
      
    }, [id])
  }



  useEffect(() => {
    if (archive) setError("");
  }, [archive]);

  async function submitForm(e) {
    e.preventDefault();

    const formData = new FormData();
    const baseData = {
      title,
      description,
      type,
      created_by: user?.id,
    };

    Object.entries(baseData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value);
    });

    if (archive) formData.append("materials", archive);

    if (origin === "subject") {
      formData.append("subject_id", id);
    } else {
      formData.append("class_id", id);
      formData.append("subject_id", subject_id);
    }

    const response = await requestData("/material", "POST", formData, true);

    if (response.success) {
      setFlashMessage(response.data.message, "success");

      const redirectPath =
        origin === "subject"
          ? `/teacher/discipline/view/${response.data.subject_id}`
          : `/teacher/class/view/${id}`;

      navigate(redirectPath);
    } else {
      setFlashMessage(response.message, "error");
    }
  }


  function handleVoltar() {
      if(origin === 'class') {
        navigate(`/teacher/class/view/${id}`)
      }
      else {
        window.history.back()
      }
  }

  /**
   * validateFile
   *
   * Valida um File antes de aceitá-lo como `archive`:
   * - Verifica existência
   * - Verifica tamanho (máx. 50MB)
   *
   * @param {File} file - O archive a validar
   * @returns {boolean} true se válido; false e atualiza `error` caso contrário
   */
  const validateFile = (file) => {
    if (!file) return false;

    // Verifica tamanho
    if (file.size > 10 * 1024 * 1024) {
      setError("Arquivo muito grande. Máx. 10MB.");
      return false;
    }

    // Extensão do arquivo
    const ext = file.name.split(".").pop().toLowerCase();

    // Mapeamento de tipos permitidos
    const allowedExtensions = {
      "1": ["pdf"],
      "2": ["doc", "docx"],
      "3": ["ppt", "pptx"],
    };

    // Caso o usuário ainda não tenha selecionado o tipo
    if (!type) {
      setError("Selecione o tipo de material antes de enviar o arquivo.");
      return false;
    }

    // Verifica compatibilidade tipo ↔ extensão
    const validExts = allowedExtensions[type] || [];
    if (!validExts.includes(ext)) {
      setError(
        `Tipo de arquivo inválido. Esperado: ${validExts.join(", ").toUpperCase()}`
      );
      return false;
    }

    return true;
  };


  /**
   * handleFileChange
   *
   * Handler para input[type=file]. Atualiza o estado `archive` quando o archive
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
   * visual de drag e tenta validar e atribuir o archive arrastado.
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
   * Remove o archive atualmente selecionado e limpa mensagens de erro relacionadas a archive.
   */
  const clearFile = () => setArquivo(null);


  const isValid = title.trim() && type && archive;
  const fileExt = archive ? archive.name.split(".").pop().toLowerCase() : "";

  return (
    // AJUSTE 1: Padding lateral responsivo
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 px-4 sm:px-6 py-12 flex items-center justify-center">
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
            <form className="space-y-5" onSubmit={submitForm}>
              {/* Título */}
              <div>
                <label className="text-sm font-medium text-slate-200">Título <span className="text-rose-400">*</span></label>
                <input
                  value={title}
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
                  value={description}
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
                    id={type}
                    value={type}
                    onChange={(v) => setTipo(v)}
                    options={[
                      { value: "", label: "Selecione o tipo" },
                      { value: "1", label: "PDF" },
                      { value: "2", label: "DOC" },
                      { value: "3", label: "PPT" },
                    ]}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-200">arquivo <span className="text-rose-400">*</span></label>

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
                      <div className="p-3 rounded-lg bg-white/6 shrink-0"> {/* Adicionado flex-shrink-0 para o ícone não encolher */}
                        <UploadCloud className="w-6 h-6 text-white" />
                      </div>
                      <div className="overflow-hidden"> {/* Adicionado overflow-hidden para garantir o truncate */}
                        <div className="text-sm text-slate-200">
                          {archive ? (
                            <span className="flex items-center gap-2">
                              <File className="w-4 h-4 shrink-0" />
                              {/* AJUSTE 3: Largura máxima do nome do archive responsiva */}
                              <strong className="truncate max-w-48 sm:max-w-[18rem]">{archive.name}</strong>
                            </span>
                          ) : (
                            <span>Arraste ou clique para selecionar</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Máx. 50MB • PDF, DOC, etc.</div>
                      </div>
                    </div>

                    {archive ? (
                      <div className="flex items-center gap-3">
                        <div className="text-xs text-slate-300">{Math.round(archive.size / 1024)} KB</div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); clearFile(); }}
                          className="p-2 rounded-md bg-white/6 hover:bg-white/10"
                          aria-label="Remover archive"
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
                  type="submit"
                  disabled={!isValid}
                  className={`flex-1 inline-flex items-center justify-center gap-3 rounded-xl py-3 font-semibold text-sm transition shadow ${
                    isValid
                      ? "bg-linear-to-r from-yellow-400 to-yellow-500 text-slate-900 hover:scale-[1.02]"
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
          <aside className="lg:col-span-1 bg-linear-to-b from-[#08112a] to-[#071033] border border-white/6 rounded-2xl p-5 text-slate-200 shadow-lg">
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
                  Aceitamos formatos comuns: <span className="font-medium">PDF, DOC, PPT</span>.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="pt-1"><X className="w-4 h-4 text-indigo-300" /></div>
                <div>
                  Tamanho máximo recomendado: <span className="font-medium">5MB</span>.
                </div>
              </li>
            </ul>

            {/* Preview simples */}
            {archive && (
              <div className="mt-5 bg-white/4 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-white/6 rounded-md shrink-0">
                      <File className="w-5 h-5" />
                    </div>
                    <div className="text-sm overflow-hidden">
                      <div className="font-medium text-white truncate max-w-48">{archive.name}</div>
                      <div className="text-xs text-slate-300">{fileExt.toUpperCase()}</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300">{Math.round(archive.size / 1024)} KB</div>
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
