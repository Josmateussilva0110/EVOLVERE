import React, { useState } from "react";
import { FaArrowLeft, FaSearch } from "react-icons/fa";

/**
 * Componente de gerenciamento de professores.
 * Exibe uma tabela com os professores e suas disciplinas,
 * incluindo busca, ações de editar e excluir, e botão de voltar.
 *
 * @component
 * @example
 * return <ProfessoresManagement />
 */
function ProfessoresManagement() {
  /**
   * Estado que armazena o valor do campo de busca.
   * @type {[string, Function]}
   */
  const [search, setSearch] = useState("");

  /**
   * Lista de professores com suas respectivas disciplinas.
   * @type {Array<{id: number, nome: string, disciplina: string}>}
   */
  const professores = [
    { id: 1, nome: "Professor 1", disciplina: "Estrutura de dados" },
    { id: 2, nome: "Professor 2", disciplina: "Algoritmos 1" },
    { id: 3, nome: "Professor 3", disciplina: "Algoritmos 2" },
    { id: 4, nome: "Professor 4", disciplina: "Sistemas Inteligentes" },
  ];

  /**
   * Filtra a lista de professores com base no termo de busca.
   * Inclui busca pelo nome ou disciplina do professor.
   */
  const professoresFiltrados = professores.filter(
    (prof) =>
      prof.nome.toLowerCase().includes(search.toLowerCase()) ||
      prof.disciplina.toLowerCase().includes(search.toLowerCase())
  );

  /**
   * Função para voltar à página anterior no histórico do navegador.
   */
  const handleVoltar = () => {
    window.history.back();
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6 relative">
      {/* Botão Voltar fixo à esquerda */}
      <button
        onClick={handleVoltar}
        className="absolute top-6 left-6 flex items-center bg-white-100 text-white-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all"
      >
        <FaArrowLeft className="mr-2" /> Voltar
      </button>

      {/* Conteúdo central */}
      <div className="w-full max-w-4xl mt-14">
        {/* Campo de busca */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Pesquisar por nome ou disciplina"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-300 outline-none"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Nome</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Disciplina</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {professoresFiltrados.map((prof) => (
                <tr key={prof.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4">{prof.nome}</td>
                  <td className="py-3 px-4">{prof.disciplina}</td>
                  <td className="py-3 px-4 flex justify-center space-x-2">
                    <button className="bg-yellow-100 text-yellow-700 p-2 rounded-full hover:bg-yellow-200 transition">
                      🗑️ Excluir
                    </button>
                    <button className="bg-pink-100 text-pink-700 p-2 rounded-full hover:bg-pink-200 transition">
                      ✏️ Editar
                    </button>
                  </td>
                </tr>
              ))}
              {professoresFiltrados.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-400 italic">
                    Nenhum professor encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProfessoresManagement;
