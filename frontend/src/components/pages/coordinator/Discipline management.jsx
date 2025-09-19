import React, { useState } from "react"

function ManagementDisciplines() {
  const [nome, setNome] = useState("")
  const [curso, setCurso] = useState("")
  const [professor, setProfessor] = useState("")

  // Exemplo de opções (substitua pelos dados reais)
  const cursos = ["Engenharia", "Direito", "Administração"]
  const professores = ["João Silva", "Maria Souza", "Carlos Lima"]

  function handleSubmit(e) {
    e.preventDefault()
    // Lógica de cadastro aqui
  }

    const handleVoltar = () => {
    window.history.back()
  }

  return (
    <div className="flex items-start justify-center min-h-[400px] bg-gray-150 py-15">
        
      <div className="w-full max-w-md bg-white rounded-xl p-8">

        {/* Botão Voltar */}
        <button 
          onClick={handleVoltar}
          className="absolute top-25 left-5 w-14 h-13 bg-gray rounded-xl flex items-center justify-center text-gray-700 transition-all duration-200 text-xl font cursor-pointer"
        >
        <span className="text-xl font mr-1">←</span>
          Voltar
        </button>

        <h2 className="text-2xl font-bold text-[#060060] text-center mb-8">
          Gerenciamento de Disciplinas
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome da Disciplina"
            className="w-full px-4 py-3 rounded-lg bg-[#F7F1F1] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#060060]"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />
          <select
            className="w-full px-4 py-3 rounded-lg bg-[#F7F1F1] border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#060060]"
            value={curso}
            onChange={e => setCurso(e.target.value)}
            required
          >
            <option value="">Selecione o Curso</option>
            {cursos.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
          <select
            className="w-full px-4 py-3 rounded-lg bg-[#F7F1F1] border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#060060]"
            value={professor}
            onChange={e => setProfessor(e.target.value)}
            required
          >
            <option value="">Selecione o Professor</option>
            {professores.map((p, i) => (
              <option key={i} value={p}>{p}</option>
            ))}
          </select>
          <div className="flex justify-center mt-8">
              <button
                onClick={handleSubmit}
                className="px-16 py-2.5 bg-yellow-400 text-[#1e1e5f] font-bold rounded-xl hover:bg-yellow-500 transition-all text-lg"
              >
                Cadastrar
              </button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default ManagementDisciplines