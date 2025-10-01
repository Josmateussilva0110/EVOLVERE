/**
 * Componente ViewSubjects
 *
 * Tela responsável por exibir a listagem de disciplinas.
 * Inclui:
 *  - Cabeçalho da página
 *  - Filtros de busca (disciplinas e status)
 *  - Botão para limpar os filtros aplicados
 *  - Tabela com dados das disciplinas (nome, curso, turma, status e ações)
 *  - Paginação na parte inferior da tabela
 * 
 * Melhorias aplicadas:
 *  - Layout responsivo para diferentes tamanhos de tela
 *  - Estilo mais moderno e espaçamento adequado entre os elementos
 *  - Status apresentado em forma de "badge" colorido (verde = ativo)
 *  - Botões com feedback visual (hover e transições suaves)
 */
function ViewSubjects() {
  /**
   * handleVoltar
   *
   * Função responsável por retornar o usuário à página anterior.
   * Utiliza o método nativo `window.history.back()` do navegador.
   */
  const handleVoltar = () => {
    window.history.back()
  }

  return (
    /**
     * Estrutura principal da página
     *
     * - Fundo azul escuro (#060060)
     * - Container centralizado com largura máxima de 6xl
     * - Container possui cantos arredondados, sombra e espaçamento interno
     */
    <div className="flex flex-col items-center min-h-[550px] bg-[#060060] pt-4 pb-10 px-4 overflow-x-hidden">
      
      {/* Container principal branco */}
      <div className="w-full max-w-6xl bg-white rounded-2xl p-10 shadow-xl relative">
        
        {/* Botão Voltar
            - Posicionado no canto superior esquerdo
            - Botão circular com ícone de seta "<"
        */}
        <button
          onClick={handleVoltar}
          className="absolute top-6 left-6 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 text-2xl hover:bg-gray-200 transition-all"
        >
          &lt;
        </button>

        {/* Cabeçalho principal com título centralizado */}
        <h1 className="text-3xl font-bold text-center mb-8 text-[#060060]">
          Disciplinas
        </h1>

        {/* Área de Filtros
            - Dois selects (disciplinas e status)
            - Botão "Limpar filtros" à direita
        */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
          <div className="flex gap-4 flex-wrap">
            {/* Select de disciplinas */}
            <select className="border border-gray-300 rounded-lg px-4 py-2 min-w-[180px] focus:ring-2 focus:ring-blue-400 outline-none">
              <option>Disciplinas</option>
            </select>

            {/* Select de status */}
            <select className="border border-gray-300 rounded-lg px-4 py-2 min-w-[150px] focus:ring-2 focus:ring-blue-400 outline-none">
              <option>Status</option>
            </select>
          </div>

          {/* Botão para limpar filtros */}
          <button className="bg-yellow-400 px-6 py-2 rounded-lg font-medium text-black hover:bg-yellow-500 transition-all shadow">
            Limpar filtros
          </button>
        </div>

        {/* Tabela de disciplinas
            - Colunas: Nome | Curso | Turma | Status | Ações
            - Linhas de exemplo estáticas
            - Hover com cor de fundo mais clara
        */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-5 py-3">Nome</th>
                <th className="px-5 py-3">Curso</th>
                <th className="px-5 py-3">Turma</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {/* Linha 1: Estrutura de dados */}
              <tr className="hover:bg-gray-50 transition">
                <td className="px-5 py-4">Estrutura de dados</td>
                <td className="px-5 py-4">SI</td>
                <td className="px-5 py-4">2022.1</td>
                <td className="px-5 py-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    Ativo
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <button className="text-gray-600 hover:text-[#060060] text-xl transition">
                    👁
                  </button>
                </td>
              </tr>

              {/* Linha 2: Banco de dados */}
              <tr className="bg-gray-50 hover:bg-gray-100 transition">
                <td className="px-5 py-4">Banco de dados</td>
                <td className="px-5 py-4">SI</td>
                <td className="px-5 py-4">2022.1</td>
                <td className="px-5 py-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    Ativo
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <button className="text-gray-600 hover:text-[#060060] text-xl transition">
                    👁
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Paginação
            - Botões anterior (<), número da página atual (1) e próximo (>)
            - Botões arredondados com efeitos de hover
        */}
        <div className="flex justify-end items-center mt-8 gap-2">
          <button className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition">
            &lt;
          </button>
          <button className="w-8 h-8 rounded-full bg-[#060060] text-white flex items-center justify-center shadow">
            1
          </button>
          <button className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition">
            &gt;
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewSubjects
