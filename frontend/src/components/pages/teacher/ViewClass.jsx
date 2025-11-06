// ViewClass.jsx
import { useState, useEffect, useContext } from "react";
import {
    Trash2,
    Eye,
    ArrowDownToLine,
    Users,
    BookOpen,
    FileText,
    ChevronLeft,
    ChevronRight,
    PlusCircle,
    Link,
    ArrowLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import requestData from "../../../utils/requestApi";
import InviteModal from "./InviteModal";
import { Context } from "../../../context/UserContext"
import useFlashMessage from "../../../hooks/useFlashMessage"

/**
 * ViewClass.jsx
 * Página que apresenta detalhes da turma (alunos, simulados e materiais) e
 * fornece ações rápidas como geração de convites e cadastro de materiais.
 *
 * Responsabilidades principais:
 * - Buscar materiais da turma via API quando o componente é montado / id muda;
 * - Exibir cards para Alunos, Simulados e Materiais com paginação local;
 * - Abrir modal de geração de convites (InviteModal) para compartilhar link da turma;
 * - Navegar para rotas de cadastro de materiais e simulados.
 *
 * Observações:
 * - A chamada à API utiliza o util `requestData` que deve retornar um objeto
 *   com { success: boolean, data: ... }.
 * - O componente assume que `materials` retornados pela API possuem ao menos
 *   { id, title, class_name }.
 * - Interação com arquivos:
 *   - Visualização: ao clicar no nome do material, o frontend solicita
 *     `/api/materials/<filename>?preview=true`. Se o backend suportar, ele
 *     deve retornar um PDF (ou o arquivo original quando aplicável) para
 *     ser exibido em uma nova aba. Caso contrário, uma mensagem de erro é
 *     exibida.
 *   - Download: ao clicar no ícone de download, o frontend solicita
 *     `/api/materials/<filename>?download=true` para forçar o download via
 *     Content-Disposition.
 *
 * Sem props: o componente obtém `id` via useParams() do React Router.
 */

/**
 * DashboardCard
 * Componente visual simples que renderiza um cartão com cabeçalho (ícone + título)
 * e conteúdo. Fornece uma prop `delay` para animação sequencial.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Componente de ícone exibido ao lado do título
 * @param {string} props.title - Título do cartão
 * @param {React.ReactNode} props.children - Conteúdo do cartão
 * @param {string} [props.className] - Classes adicionais (Tailwind)
 * @param {number} [props.delay=0] - Delay em ms para a animação de entrada
 */
const DashboardCard = ({ icon, title, children, className, delay = 0 }) => (
    <div
        className={`bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex flex-col animate-fade-in ${className}`}
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="flex items-center gap-3 mb-4">
            {icon}
            <h2 className="font-bold text-lg text-white">{title}</h2>
        </div>
        {children}
    </div>
);

/**
 * Pagination
 * Componente de paginação simples e sem dependências externas.
 * Retorna `null` quando `totalPages <= 1`.
 *
 * @param {Object} props
 * @param {number} props.currentPage - Página atual (1-based)
 * @param {number} props.totalPages - Número total de páginas
 * @param {function} props.onPageChange - Callback (novoNumeroPagina) quando pagina for alterada
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-end items-center mt-auto pt-4 gap-2">
            <button
                onClick={() => onPageChange(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Página anterior"
                className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 disabled:opacity-30 transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-slate-300 select-none">
                {currentPage} / {totalPages}
            </span>
            <button
                onClick={() => onPageChange(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Próxima página"
                className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 disabled:opacity-30 transition-colors"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

/**
 * ViewClass (componente principal)
 *
 * Estado local principal:
 * - materials: lista de materiais obtida da API
 * - inviteOpen: boolean que controla visibilidade do InviteModal
 * - pageAlunos, pageSimulados, pageMateriais: estados de paginação locais
 *
 * Comportamento:
 * - Ao montar (ou quando `id` muda) faz requisição para `/classes/materials/:id`
 *   via `requestData` e popula `materials` com `response.data.materials`.
 * - Renderiza cards para alunos, simulados e materiais. Cada card possui
 *   paginação local gerenciada pelo componente.
 *
 * Nota: não recebe props - `id` é lido via `useParams()`.
 *
 * @returns {JSX.Element} A view completa da turma para o professor.
 */
export default function ViewClass() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [materials, setMaterials] = useState([])
    const [inviteOpen, setInviteOpen] = useState(false)
    const { user } = useContext(Context)
    const [form, setForm] = useState([])
    const [students, setStudents] = useState([])
    const { setFlashMessage } = useFlashMessage()
    const [subject_id, setSubjectId] = useState(null)


    useEffect(() => {
        async function fetchSubject() {
            if (!id) return
            const response = await requestData(`/classes/materials/${id}`, 'GET', {}, true)
            console.log('sub: ', response)

            if (response && response.success) {
                const mats = response.data?.materials || []
                setMaterials(mats)
                if (mats.length > 0) {
                    setSubjectId(mats[0].subject_id)
                }
            } else {
                setMaterials([])
            }
        }
        fetchSubject()
    }, [id])

    useEffect(() => {
        async function fetchForm() {
            const response = await requestData(`/form/${id}`, 'GET', {}, true)
            console.log('form: ',response)

            if (response && response.success) {
                setForm(response.data.form)
            } else {
                setForm([])
            }
        }
        fetchForm()
    }, [id])


    useEffect(() => {
        async function fetchStudents() {
            if (!id) return
            const response = await requestData(`/classes/students/${id}`, 'GET', {}, true)
            console.log('students: ', response)

            if (response && response.success) {
                setStudents(response.data.students)
            } else {
                setStudents([])
            }
        }
        fetchStudents()
    }, [id])


    async function deleteMaterial(id) {
        const response = await requestData(`/material/${id}`, 'DELETE', {}, true)
        if (response.success) {
            setMaterials(prev => prev.filter(d => d.id !== id))
            setFlashMessage(response.data.message, 'success')
        }
        else {
            setFlashMessage(response.message, 'error')
        }
    }

    async function deleteForm(id) {
        const response = await requestData(`/form/${id}`, 'DELETE', {}, true)
        if (response.success) {
            setForm(prev => prev.filter(d => d.id !== id))
            setFlashMessage(response.data.message, 'success')
        }
        else {
            setFlashMessage(response.message, 'error')
        }
    }

    async function deleteStudent(student_id) {
        const data = {
            class_id: id
        }
        const response = await requestData(`/classes/students/${student_id}`, 'DELETE', data, true)
        if (response.success) {
            setStudents(prev => prev.filter(d => d.student_id !== student_id))
            setFlashMessage(response.data.message, 'success')
        }
        else {
            setFlashMessage(response.message, 'error')
        }
    }

    function handleVoltar() {
      if(materials[0].subject_id === null) {
        window.history.back()
      }
      else {
        navigate(`/teacher/discipline/view/${subject_id}`)
      }
    }



    // Paginação
    const ITEMS_PER_PAGE = 5;
    const [pageAlunos, setPageAlunos] = useState(1);
    const [pageSimulados, setPageSimulados] = useState(1);
    const [pageMateriais, setPageMateriais] = useState(1);

    const getPageData = (arr, page) => arr.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    const getTotalPages = arr => Math.ceil(arr.length / ITEMS_PER_PAGE);

    /**
     * Abre o material em nova aba para visualização.
     * Usa o campo `archive` retornado pela API, que geralmente possui o formato
     * "materials/<filename>". Para facilitar o desenvolvimento local com o Vite
     * proxy, usamos o prefixo `/api` — o Vite irá encaminhar para o backend e o
     * backend responde em `/materials/:filename`.
     *
     * @param {Object} mat - Objeto de material retornado pela API
     */
    const openMaterial = (mat) => {
        const archive = mat.archive || mat.archive_path || mat.file || null;
        if (!archive) return alert('Arquivo não disponível para este material.');
        const filename = archive.split('/').pop();
        const url = `/api/materials/${encodeURIComponent(filename)}`; // Vite proxy -> backend
        window.open(url, '_blank', 'noopener');
    };

    /**
     * Força o download do material utilizando a query `download=true` que ativa
     * o Content-Disposition de attachment no backend.
     *
     * @param {Object} mat - Objeto de material retornado pela API
     */
    const downloadMaterial = (mat) => {
        const archive = mat.archive || mat.archive_path || mat.file || null;
        if (!archive) return alert('Arquivo não disponível para este material.');
        const filename = archive.split('/').pop();
        const url = `/api/materials/${encodeURIComponent(filename)}?download=true`;
        // Criar e acionar um link para forçar o download
        const a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    function getColorByType(type) {
        switch (type.toLowerCase()) {
            case "pdf":
                return "bg-red-500/20 text-red-400 border-red-500/30"
            case "doc":
            case "docx":
                return "bg-blue-500/20 text-blue-400 border-blue-500/30"
            case "ppt":
            case "pptx":
                return "bg-orange-500/20 text-orange-400 border-orange-500/30"
            case "xlsx":
            case "xls":
                return "bg-green-500/20 text-green-400 border-green-500/30"
            default:
                return "bg-gray-500/20 text-gray-400 border-gray-500/30"
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-7xl mx-auto">
                {/* Botão Voltar */}
                <button
                    onClick={handleVoltar}
                    className="p-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                {/* Cabeçalho */}
                <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 animate-fade-in">
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-4 sm:mb-0">
                        {materials.length > 0 ? materials[0].class_name : "Carregando..."}
                    </h1>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setInviteOpen(true)}
                            className="px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <Link className="w-4 h-4 text-blue-400" />
                            Gerar Convite
                        </button>
                        <button
                            className="px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 bg-linear-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 transition-colors shadow-lg shadow-yellow-400/20"
                            onClick={() => navigate(`/teacher/material/register/${id}`, { state: { origin: "class" } })}
                        >
                            <PlusCircle className="w-4 h-4 text-blue-700" />
                            Cadastrar Material
                        </button>
                        <button
                            onClick={() => navigate(`/teacher/simulated/register/${id}`)}
                            className="px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 bg-linear-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 transition-colors shadow-lg shadow-yellow-400/20"
                        >
                            <PlusCircle className="w-4 h-4 text-blue-700" />
                            Cadastrar Simulado
                        </button>
                    </div>
                </header>

                {/* Grid principal do Dashboard */}
                <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Card de Alunos (dados vindos da API) */}
                    <DashboardCard
                        title="Alunos"
                        icon={<Users className="w-6 h-6 text-blue-400" />}
                        delay={100}
                    >
                        <ul className="space-y-2 grow">
                            {students && students.length > 0 ? (
                                getPageData(students, pageAlunos).map((aluno) => (
                                    <li
                                        key={aluno.student_id}
                                        className="flex justify-between items-center p-2.5 rounded-md hover:bg-white/5 transition-colors group"
                                    >
                                        <span className="text-slate-200 text-sm">{aluno.username}</span>
                                        <button
                                            title="Remover aluno"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => deleteStudent(aluno.student_id)} 
                                        >
                                            <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <p className="text-slate-400 text-sm italic text-center py-4">
                                    Nenhum aluno encontrado.
                                </p>
                            )}
                        </ul>
                        <Pagination
                            currentPage={pageAlunos}
                            totalPages={getTotalPages(students)}
                            onPageChange={setPageAlunos}
                        />
                    </DashboardCard>

                    {/* Card de Simulados */}
                    <DashboardCard
                        title="Simulados"
                        icon={<FileText className="w-6 h-6 text-blue-400" />}
                        delay={200}
                    >
                        <ul className="space-y-2 grow">
                            {form.length > 0 ? (
                                getPageData(form, pageSimulados).map((f) => (
                                    <li
                                        key={f.id}
                                        className="flex justify-between items-center p-2.5 rounded-md hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-slate-200 text-sm">{f.title}</span>
                                        </div>

                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => navigate(`/teacher/simulated/view/${f.id}`)}
                                                title="Visualizar"
                                            >
                                                <Eye className="w-4 h-4 text-blue-400 hover:text-blue-300" />
                                            </button>
                                            <button
                                                onClick={() => deleteForm(f.id)}
                                                title="Excluir"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
                                            </button>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="text-slate-400 text-sm italic text-center py-4">
                                    Nenhum simulado encontrado.
                                </p>
                            )}
                        </ul>
                        <Pagination
                            currentPage={pageSimulados}
                            totalPages={getTotalPages(form)}
                            onPageChange={setPageSimulados}
                        />
                    </DashboardCard>

                    {/* Card de Materiais */}
                    <DashboardCard
                        title="Materiais de Aula"
                        icon={<BookOpen className="w-6 h-6 text-blue-400" />}
                        delay={300}
                    >
                        <ul className="space-y-2 grow">
                            {materials.length > 0 && materials.some(m => m.archive) ? (
                                getPageData(materials.filter(m => m.archive), pageMateriais).map((mat) => (
                                    <li
                                        key={mat.id}
                                        className="flex justify-between items-center p-2.5 rounded-md hover:bg-white/5 transition-colors group"
                                    >
                                        {/* Linha com título e tipo alinhados */}
                                        <div className="flex flex-col grow">
                                            <div className="flex items-center justify-between gap-3">
                                                <button
                                                    onClick={() => openMaterial(mat)}
                                                    className="text-slate-200 text-sm truncate text-left hover:underline flex-1"
                                                >
                                                    {mat.title}
                                                </button>

                                                <span
                                                    className={`text-xs px-2 py-1 rounded-lg font-medium border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200

                  ${getColorByType(mat.type_file)}
                `}
                                                >
                                                    {mat.type_file}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Botões de ação */}
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                            <button
                                                onClick={() => downloadMaterial(mat)}
                                                title="Baixar"
                                            >
                                                <ArrowDownToLine className="w-4 h-4 text-blue-400 hover:text-blue-300" />
                                            </button>
                                            <button
                                                onClick={() => deleteMaterial(mat.id)}
                                                title="Excluir"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
                                            </button>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="text-slate-400 text-sm italic text-center py-4">
                                    Nenhum material encontrado.
                                </p>
                            )}
                        </ul>

                        <Pagination
                            currentPage={pageMateriais}
                            totalPages={getTotalPages(materials.filter(m => m.archive))}
                            onPageChange={setPageMateriais}
                        />
                    </DashboardCard>


                </main>
            </div>

            {/* Invite Modal */}
            <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} classId={id} />
        </div>
    );
}
