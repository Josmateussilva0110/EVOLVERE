
/**
 * Componente ViewCourses
 * 
 * Exibe informações sobre cursos, incluindo ID, datas de criação e atualização,
 * e cartões com informações resumidas sobre disciplinas, professores e alunos ativos.
 * Também possui um botão "Voltar" que retorna à página anterior.
 */
function ViewCourses() {
  /**
   * handleVoltar
   * 
   * Função chamada ao clicar no botão de voltar.
   * Retorna o usuário para a página anterior usando a função nativa do navegador.
   */
  const handleVoltar = () => {
    window.history.back()
  }

  return (
    <div className="flex flex-col items-center min-h-[500px] bg-[#060060] pt-2.5 pb-10 px-6 overflow-x-hidden">
      
      {/* Container central com largura máxima e fundo branco */}
      <div className="w-full max-w-4xl bg-white rounded-2xl p-10 shadow-lg relative">

        {/* Botão Voltar */}
        <button
          onClick={handleVoltar}
          className="absolute top-6 left-6 w-16 h-14 bg-white-200 rounded-lg flex items-center justify-center text-gray-700 text-2xl hover:bg-gray-100 transition-all"
        >
          &lt;
        </button>

        {/* Cabeçalho com título do curso */}
        <h1 className="text-3xl font-bold text-center mb-3">
          Sistemas de informação
        </h1>

        {/* ID centralizado */}
        <p className="text-center mb-4">
          <span className="bg-gray-200 px-3 py-1 rounded-md text-gray-800">
            ID: 6799
          </span>
        </p>

        {/* Datas de criação e atualização */}
        <p className="text-sm text-center mb-8 text-gray-700">
          Criado em 12 de fev. de 2023 <br />
          Última atualização em 08 de abril de 2024
        </p>

        {/* Mensagem de instrução */}
        <p className="text-center text-gray-600 mb-10">
          Clique em um dos cartões abaixo para acessar um campo em específico
        </p>

        {/* Cartões de informações resumidas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          
          {/* Cartão Disciplinas Ativas */}
          <div className="flex flex-col items-center justify-center bg-blue-100 p-8 rounded-xl shadow hover:shadow-lg cursor-pointer transition-all">
            <span className="text-5xl mb-4">📖</span>
            <p className="font-semibold text-lg">Disciplinas Ativas</p>
            <span className="text-2xl font-bold">6</span>
          </div>

          {/* Cartão Professores Ativos */}
          <div className="flex flex-col items-center justify-center bg-yellow-100 p-8 rounded-xl shadow hover:shadow-lg cursor-pointer transition-all">
            <span className="text-5xl mb-4">👨‍🏫</span>
            <p className="font-semibold text-lg">Professores Ativos</p>
            <span className="text-2xl font-bold">3</span>
          </div>

          {/* Cartão Alunos Ativos */}
          <div className="flex flex-col items-center justify-center bg-green-100 p-8 rounded-xl shadow hover:shadow-lg cursor-pointer transition-all">
            <span className="text-5xl mb-4">🎓</span>
            <p className="font-semibold text-lg">Alunos Ativos</p>
            <span className="text-2xl font-bold">42</span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ViewCourses
