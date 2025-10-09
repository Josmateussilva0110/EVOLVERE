import { useState } from "react"
import { ArrowLeft, Upload, FileText } from "lucide-react"

/**
 * CadastrarMaterial
 *
 * Componente React que permite o cadastro de materiais acadêmicos,
 * incluindo título, descrição, tipo e upload de arquivo.
 *
 * Funcionalidades principais:
 * - Header com título centralizado e botão de voltar
 * - Formulário para cadastro:
 *   - Título (obrigatório)
 *   - Descrição
 *   - Tipo de material (PDF, DOC, PPT, Vídeo, Outro) (obrigatório)
 *   - Upload de arquivo (obrigatório)
 * - Preview do arquivo selecionado
 * - Botão para cadastrar o material
 * - Card informativo destacando campos obrigatórios
 *
 * Estados internos:
 * - titulo: string, armazenando o título do material
 * - descricao: string, armazenando a descrição do material
 * - tipo: string, armazenando o tipo selecionado
 * - arquivo: File | null, armazenando o arquivo selecionado
 *
 * Funções internas:
 * - handleVoltar: retorna à página anterior
 * - handleFileChange: atualiza o estado `arquivo` com o arquivo selecionado
 * - handleCadastrar: realiza a ação de cadastro (aqui apenas loga os dados no console)
 *
 * Entrada:
 * - Nenhuma entrada externa (todos os dados são inseridos pelo usuário)
 *
 * Saída:
 * - JSX que renderiza:
 *   - Header com botão de voltar e título
 *   - Formulário completo com campos obrigatórios e opcionais
 *   - Upload de arquivo com preview do arquivo selecionado
 *   - Botão de cadastro estilizado com gradiente e efeitos hover
 *   - Card informativo sobre preenchimento obrigatório
 *
 * Observações:
 * - Layout inclui elementos decorativos animados em background
 * - Todos os campos obrigatórios são indicados com *
 * - Foco e hover nos inputs possuem efeitos visuais (gradientes, sombras)
 * - Upload utiliza input hidden + label estilizada para melhor UX
 */

function CadastrarMaterial() {
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [tipo, setTipo] = useState("")
  const [arquivo, setArquivo] = useState(null)

  const handleVoltar = () => window.history.back()
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArquivo(e.target.files[0])
    }
  }

  const handleCadastrar = () => {
    console.log("Cadastrar material:", { titulo, descricao, tipo, arquivo })
  }

  return (
    <div className="bg-gradient-to-b from-[#060060] via-[#0a0a7a] to-[#121282] px-4 py-8 pb-24 relative min-h-screen flex items-center justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-72 h-72 sm:w-96 sm:h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[28rem] sm:h-[28rem] bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Container Principal */}
      <div className="w-full max-w-2xl mx-auto relative space-y-7">

        {/* Card Único com Header e Formulário */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/60">
          {/* Header */}
          <div className="flex items-center px-6 py-5">
            <button
              onClick={handleVoltar}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-50 transition"
            >
              <ArrowLeft className="w-6 h-6 text-[#060060]" />
            </button>
            <h1 className="flex-1 text-3xl md:text-4xl font-extrabold text-[#060060] text-center">
              Cadastrar Material
            </h1>
            <div className="w-10 h-10" />
          </div>

          {/* Formulário */}
          <div className="p-10 space-y-7">
            {/* Campo Título */}
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Digite o título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all shadow-sm"
              />
            </div>

            {/* Campo Descrição */}
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                Descrição
              </label>
              <textarea
                placeholder="Digite a Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={4}
                className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all resize-none shadow-sm"
              />
            </div>

            {/* Campo Tipo */}
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                Tipo <span className="text-red-500">*</span>
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 transition-all appearance-none cursor-pointer shadow-sm"
              >
                <option value="">Selecione o tipo</option>
                <option value="pdf">PDF</option>
                <option value="doc">DOC</option>
                <option value="ppt">PPT</option>
                <option value="video">Vídeo</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            {/* Campo Arquivo */}
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                Arquivo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="w-full px-5 py-3 bg-gray-100 border-2 border-gray-300 border-dashed rounded-2xl text-base text-gray-500 transition-all cursor-pointer hover:bg-blue-50 hover:border-blue-400 flex items-center gap-3 justify-center shadow-sm"
                >
                  <Upload className="w-5 h-5" />
                  {arquivo ? arquivo.name : "Selecione o arquivo"}
                </label>
              </div>
              {arquivo && (
                <p className="mt-2 text-xs text-blue-700 flex items-center gap-2 font-medium">
                  <FileText className="w-4 h-4" />
                  Arquivo selecionado: <span className="truncate">{arquivo.name}</span>
                </p>
              )}
            </div>

            {/* Botão Cadastrar */}
            <button
              type="button"
              onClick={handleCadastrar}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-extrabold py-4 rounded-2xl transition-all hover:scale-105 shadow-xl text-lg tracking-wide border-2 border-yellow-300/40"
            >
              Cadastrar
            </button>
          </div>
        </div>

        {/* Card de Informação */}
        <div className="bg-blue-500/20 backdrop-blur-xl border border-blue-300/40 rounded-2xl p-4 shadow-md">
          <p className="text-base text-white/90 text-center flex items-center justify-center gap-3 font-medium">
            <FileText className="w-5 h-5" />
            Preencha todos os campos obrigatórios (*) para cadastrar o material
          </p>
        </div>

      </div>
    </div>
  )
}

export default CadastrarMaterial