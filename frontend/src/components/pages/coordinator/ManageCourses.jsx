import { useState } from "react"

/**
 * CoursesList
 *
 * Componente responsável por **exibir e gerenciar a lista de cursos**.
 *
 * Funcionalidades:
 * - Pesquisa por nome ou ID do curso.
 * - Paginação com botões "Anterior" e "Próximo".
 * - Exibição de status de cada curso (Ativo/Inativo).
 * - Exibição de informações do curso:
 *    - Nome
 *    - Data de criação
 *    - Data de atualização ou observação (quando inativo)
 *    - ID
 * - Botão fictício de adicionar curso (visual apenas, sem funcionalidade).
 *
 * Entradas:
 * - Não recebe props diretamente.
 * - Dados de cursos estão definidos internamente como lista fictícia.
 *
 * Estados locais:
 * - `search` → texto digitado no campo de busca.
 * - `pagina` → página atual exibida na lista.
 *
 * Variáveis internas:
 * - `cursosPorPagina` → quantidade de cursos exibidos por página.
 * - `cursosFiltrados` → cursos que atendem ao critério de busca.
 * - `totalPaginas` → número total de páginas calculado a partir dos cursos filtrados.
 * - `cursosPaginaAtual` → cursos que serão exibidos na página atual.
 *
 * Estrutura visual:
 * - Container branco centralizado com sombra.
 * - Botão voltar para página anterior.
 * - Campo de busca com ícone de lupa.
 * - Grid 2x2 exibindo os cursos da página atual.
 * - Paginação com navegação entre páginas e exibição do número da página.
 *
 * Exemplo de uso:
 * ```jsx
 * <CoursesList />
 *
 * // Interações do usuário:
 * setSearch("Medicina"); // filtra por nome ou ID
 * setPagina(2);          // navega para a página 2
 * ```
 *
 * @component
 * @returns {JSX.Element} Tela de listagem de cursos com filtros e paginação.
 */

function CoursesList() {
  /** Estado para armazenar o texto de busca */
  const [search, setSearch] = useState("")

  /** Estado para armazenar a página atual da lista de cursos */
  const [pagina, setPagina] = useState(1)

  /** Número de cursos exibidos por página */
  const cursosPorPagina = 4

  /** Lista de cursos fictícia */
  const cursos = [
    { nome: "Sistemas de informação", criado: "12 de fev. de 2023", atualizado: "08 de abril de 2024", id: 6799, status: "Ativo" },
    { nome: "Medicina", criado: "13 de fev. de 2023", atualizado: null, id: 6800, status: "Inativo", observacao: "Aguardando aprovação da equipe de suporte" },
    { nome: "Matemática", criado: "13 de fev. de 2023", atualizado: "08 de abril de 2024", id: 6801, status: "Ativo" },
    { nome: "Física", criado: "14 de fev. de 2023", atualizado: "09 de abril de 2024", id: 6802, status: "Ativo" },
    { nome: "Química", criado: "15 de fev. de 2023", atualizado: null, id: 6803, status: "Inativo", observacao: "Aguardando aprovação" },
    { nome: "Biologia", criado: "16 de fev. de 2023", atualizado: null, id: 6804, status: "Ativo" },
    { nome: "História", criado: "17 de fev. de 2023", atualizado: null, id: 6805, status: "Ativo" },
    { nome: "Geografia", criado: "18 de fev. de 2023", atualizado: null, id: 6806, status: "Inativo", observacao: "Aguardando aprovação" },
  ]

  /** Filtra os cursos com base no texto de pesquisa */
  const cursosFiltrados = cursos.filter(
    (curso) =>
      curso.nome.toLowerCase().includes(search.toLowerCase()) ||
      curso.id.toString().includes(search)
  )

  /** Calcula o total de páginas baseado nos cursos filtrados */
  const totalPaginas = Math.ceil(cursosFiltrados.length / cursosPorPagina)

  /** Lista de cursos que serão exibidos na página atual */
  const cursosPaginaAtual = cursosFiltrados.slice(
    (pagina - 1) * cursosPorPagina,
    pagina * cursosPorPagina
  )

  return (
    <div className="flex flex-col items-center min-h-[550px] bg-[#060060] px-6">
      {/* Container branco central */}
      <div className="w-full max-w-6xl bg-white rounded-2xl p-8 shadow-lg relative flex flex-col">

        {/* Botão Voltar */}
        {/**
         * Botão que retorna para a página anterior do navegador
         */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-1 left-2 w-7 h-7 bg-white-100 rounded-lg flex items-center justify-center text-white-700 text-2xl hover:bg-gray-100 transition-all"
        >
          &lt;
        </button>

        {/* Campo de pesquisa + botão adicionar */}
        {/**
         * Campo de input para pesquisar cursos por nome ou ID
         * Botão de adicionar curso (ação fictícia)
         */}
        <div className="flex items-center mt-4 mb-4 gap-2">
          <div className="flex items-center flex-1 border border-gray-300 rounded-lg px-4 py-2">
            <input
              type="text"
              placeholder="Pesquisar por nome ou id"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPagina(1)
              }}
              className="w-full outline-none text-gray-700"
            />
            <span className="text-gray-400 ml-2">🔍</span>
          </div>

        </div>

        {/* Lista de cursos em grid 2x2 */}
        {/**
         * Exibe os cursos da página atual em um grid de duas colunas
         * Cada cartão exibe:
         * - Nome do curso
         * - Data de criação
         * - Data de atualização ou observação (se inativo)
         * - ID
         * - Status (ativo/inativo)
         */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {cursosPaginaAtual.map((curso) => (
            <div
              key={curso.id}
              className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-all cursor-pointer flex justify-between items-start"
            >
              <div>
                <p className="font-semibold text-lg">{curso.nome}</p>
                <p className="text-sm text-gray-600">
                  Criado em {curso.criado} <br />
                  {curso.atualizado ? `Última atualização em ${curso.atualizado}` : curso.observacao} <br />
                  ID: {curso.id}
                </p>
              </div>
              <span
                className={`font-semibold text-sm ${curso.status === "Ativo" ? "text-green-600" : "text-gray-400"}`}
              >
                {curso.status}
              </span>
            </div>
          ))}
        </div>

        {/* Paginação */}
        {/**
         * Botões de navegação entre páginas
         * - "Anterior" desabilitado se estiver na primeira página
         * - "Próximo" desabilitado se estiver na última página
         */}
        <div className="flex justify-center gap-4 mt-4 border-t pt-4">
          <button
            onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
            disabled={pagina === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="flex items-center">
            Página {pagina} de {totalPaginas}
          </span>
          <button
            onClick={() => setPagina((prev) => Math.min(prev + 1, totalPaginas))}
            disabled={pagina === totalPaginas}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  )
}

export default CoursesList
