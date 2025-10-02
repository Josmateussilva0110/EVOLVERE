import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import requestData from "../../../utils/requestApi";
import { FiArrowLeft, FiBookOpen, FiCheck } from "react-icons/fi";
import { Context } from "../../../context/UserContext";
import useFlashMessage from "../../../hooks/useFlashMessage";

/**
 * DisciplineManagement
 *
 * Componente responsável por **gerenciar o cadastro de disciplinas** na plataforma.
 *
 * O que faz:
 * - Exibe formulário para cadastrar uma nova disciplina.
 * - Lista professores ativos do curso do coordenador para seleção.
 * - Valida campos obrigatórios (nome da disciplina e professor).
 * - Faz requisição à API para criar a disciplina.
 * - Exibe mensagens de sucesso ou erro através do `useFlashMessage`.
 *
 * Entradas:
 * - Não recebe props diretamente.
 * - Usa o usuário logado pelo `Context`.
 *
 * Estados locais:
 * - `nome` → nome da disciplina.
 * - `professor` → ID do professor selecionado.
 * - `professores` → lista de professores ativos do curso.
 * - `coordinator` → dados do coordenador logado.
 *
 * Navegação:
 * - Voltar → retorna para a página anterior.
 * - Sucesso no cadastro → navega para a lista de disciplinas (`/coordinator/discipline/list`).
 *
 * Saída:
 * - JSX completo com formulário de cadastro de disciplinas.
 *
 * Exemplo de uso:
 * ```jsx
 * <DisciplineManagement />
 *
 * // Interação do usuário:
 * setNome("Cálculo Diferencial e Integral I");
 * setProfessor(12);
 * handleSubmit(event);
 * ```
 *
 * @component
 * @returns {JSX.Element} Página de cadastro de disciplinas
 */
function DisciplineManagement() {
  const [nome, setNome] = useState("");
  const [professor, setProfessor] = useState("");
  const [professores, setProfessores] = useState([]);
  const [coordinator, setCoordinator] = useState({});
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const { setFlashMessage } = useFlashMessage();

  // Carrega informações do coordenador logado
  useEffect(() => {
    async function fetchCoordinator() {
      const response = await requestData(`/user/coordinator/${user.id}`, "GET", {}, true);
      if (response.success) {
        setCoordinator(response.data.user);
      }
    }
    fetchCoordinator();
  }, [user]);

  // Carrega professores ativos do curso do coordenador
  useEffect(() => {
    if (coordinator && coordinator.course_id) {
      async function fetchTeachers() {
        const response = await requestData(
          `/courses/${coordinator.course_id}/professors`,
          "GET",
          {},
          true
        );
        if (response.success) {
          setProfessores(response.data.professores);
        }
      }
      fetchTeachers();
    }
  }, [coordinator]);

  // Envio do formulário de cadastro de disciplina
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await requestData(
      "/subjects",
      "POST",
      {
        name: nome,
        professional_id: parseInt(professor),
        course_valid_id: parseInt(coordinator.course_id),
      },
      true
    );

    if (result.success) {
      setFlashMessage(result.data.message, "success");
      navigate("/coordinator/discipline/list");
    } else {
      setFlashMessage(result.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#060060] p-6">
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-2xl">
          <div className="rounded-3xl bg-white/95 backdrop-blur-sm shadow-2xl ring-1 ring-white/20">
            {/* Cabeçalho */}
            <div className="px-8 pt-8 pb-6 border-b border-slate-200/50">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100/80 text-slate-700 hover:bg-slate-200/80 transition-all duration-200 font-medium"
                  type="button"
                >
                  <FiArrowLeft className="w-4 h-4" /> Voltar
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-900 flex items-center justify-center shadow-lg">
                  <FiBookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Cadastro de Disciplinas</h2>
                  <p className="text-slate-600 mt-1">
                    Preencha os campos abaixo para registrar uma nova disciplina.
                  </p>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <form className="p-8 space-y-6" onSubmit={handleSubmit}>
              {/* Nome da disciplina */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Nome da disciplina
                </label>
                <input
                  type="text"
                  placeholder="Ex.: Cálculo Diferencial e Integral I"
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50/80 text-slate-900 placeholder-slate-400 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all duration-200"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
                <p className="mt-2 text-xs text-slate-500">Use um nome claro e padronizado.</p>
              </div>

              {/* Professor */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Professor</label>
                <div className="relative">
                  <select
                    className="appearance-none w-full px-4 py-3.5 rounded-xl bg-slate-50/80 text-slate-900 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all duration-200"
                    value={professor}
                    onChange={(e) => setProfessor(e.target.value)}
                    required
                  >
                    <option value="">Selecione o professor</option>
                    {professores.map((prof) => (
                      <option key={prof.id} value={prof.id}>
                        {prof.username} ({prof.institution})
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                    ▾
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Somente professores ativos aparecem na lista.</p>
              </div>

              {/* Botão cadastrar */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 font-bold rounded-xl hover:from-amber-500 hover:to-yellow-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FiCheck className="w-5 h-5" /> Cadastrar disciplina
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisciplineManagement;
