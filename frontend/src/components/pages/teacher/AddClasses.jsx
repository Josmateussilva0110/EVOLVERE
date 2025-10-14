import { X, Plus } from "lucide-react"

function RegisterClasses({
  show,
  onCancel,
  onConfirm,
  nomeTurma,
  setNomeTurma,
  capacidade,
  setCapacidade,
}) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-700/50">
        <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-6 py-5 flex items-center justify-between border-b border-gray-700/50">
          <div>
            <h3 className="text-white font-bold text-xl">Adicionar Turma</h3>
            <p className="text-gray-300 text-sm mt-0.5">Crie uma nova turma para a disciplina</p>
          </div>
          <button
            onClick={onCancel}
            className="w-10 h-10 bg-gray-600/50 hover:bg-gray-500/50 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 border border-gray-600/30"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-5">
          <p className="text-center text-gray-400 text-sm">
            Preencha as informações abaixo
          </p>

          {/* Campo nome */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Nome da turma
            </label>
            <input
              type="text"
              placeholder="Ex: Turma D"
              value={nomeTurma}
              onChange={(e) => setNomeTurma(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder-gray-400 transition-all duration-200"
            />
          </div>

          {/* Campo capacidade */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Capacidade
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="Número de alunos"
                value={capacidade}
                onChange={(e) => setCapacidade(e.target.value)}
                className="w-full px-4 py-3 pr-14 bg-gray-700/50 border border-gray-600/50 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder-gray-400 transition-all duration-200"
              />
              <button
                onClick={() => setCapacidade((prev) => String(Number(prev || 0) + 1))}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-blue-600/80 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg border border-blue-500/30"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Botões */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onConfirm}
              className="flex-1 bg-blue-600/80 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2 border border-blue-500/30"
            >
              <span className="text-lg">✓</span> Confirmar
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 border border-gray-600/30"
            >
              <span className="text-lg">✗</span> Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterClasses
