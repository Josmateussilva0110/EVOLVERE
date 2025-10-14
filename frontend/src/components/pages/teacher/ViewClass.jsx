import { useState, useEffect } from "react";
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
    ArrowLeft
} from "lucide-react";
import { useNavigate, useParams} from "react-router-dom";
import requestData from "../../../utils/requestApi"

/**
 * Módulo: ViewClass
 *
 * Visão geral:
 * Componente de dashboard para visualizar uma turma, com três cards principais:
 * - Alunos
 * - Simulados
 * - Materiais de Aula
 *
 * Contém componentes auxiliares reutilizáveis:
 * - DashboardCard: wrapper estilizado para cards do dashboard.
 * - Pagination: componente simples de paginação (anterior/próxima).
 *
 * Observações:
 * - Dados são estáticos para demonstração (arrays `alunos`, `simulados`, `materiais`).
 * - Substitua por chamadas a API / props conforme necessário em produção.
 */

/**
 * DashboardCard
 *
 * Componente reutilizável para encapsular um cartão do dashboard com ícone,
 * título e conteúdo filho. Inclui uma pequena animação de entrada e aceita
 * classes adicionais e atraso (delay) para escalonar animações.
 *
 * Props:
 * @param {JSX.Element} icon - Ícone exibido à esquerda do título.
 * @param {string} title - Título do card.
 * @param {React.ReactNode} children - Conteúdo interno do card.
 * @param {string} [className] - Classes CSS adicionais para customização.
 * @param {number} [delay=0] - Atraso em milissegundos para a animação de entrada.
 *
 * Retorno:
 * @returns {JSX.Element} Card estilizado contendo título, ícone e conteúdo.
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
 *
 * Componente simples de paginação com botões "anterior" e "próxima".
 * Não renderiza nada se só houver uma página.
 *
 * Props:
 * @param {number} currentPage - Página atual (1-indexed).
 * @param {number} totalPages - Total de páginas disponíveis.
 * @param {(updater: (prev:number)=>number)|((n:number)=>void)} onPageChange - Função para atualizar a página.
 *
 * Retorno:
 * @returns {JSX.Element|null} Controles de paginação ou null se não aplicável.
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
 * ViewClass
 *
 * Tela principal que exibe informações sobre uma turma:
 * - Cabeçalho com ações (gerar convite, cadastrar material/simulado).
 * - Três cards contendo listas paginadas: Alunos, Simulados e Materiais.
 * - Utiliza DashboardCard e Pagination como componentes auxiliares.
 *
 * Comportamento / estado:
 * - pageAlunos, pageSimulados, pageMateriais: páginas ativas para cada lista.
 * - ITEMS_PER_PAGE: constante para definir quantos itens por página.
 *
 * Observações de implementação:
 * - getPageData e getTotalPages são helpers locais para paginação.
 * - A navegação para cadastro de material usa useNavigate do react-router.
 *
 * Retorno:
 * @returns {JSX.Element} Layout completo do dashboard da turma.
 */
export default function ViewClass() {
    const navigate = useNavigate();
    const { id } = useParams()
    const [materials, setMaterials] = useState([])

    useEffect(() => {
        async function fetchSubject() {
            const response = await requestData(`/classes/materials/${id}`, 'GET', {}, true)
            console.log(response)

            if (response.success) {
                const mats = response.data.materials
                setMaterials(mats)
            }
        }
        fetchSubject()
    }, [id])



    // Dados de exemplo
    const alunos = ["Lucas", "Mateus", "Gabriel", "Rai Damásio", "João", "Maria", "Ana", "Pedro", "Sofia"];
    const simulados = [
        { nome: "Questões sobre Laços", respondido: 3 },
        { nome: "Árvores Binárias", respondido: 5 },
        { nome: "Conceitos de Funções", respondido: 2 },
        { nome: "Estruturas de Repetição", respondido: 4 },
        { nome: "Complexidade de Vetores", respondido: 1 },
    ];


    // Paginação
    const ITEMS_PER_PAGE = 5;
    const [pageAlunos, setPageAlunos] = useState(1);
    const [pageSimulados, setPageSimulados] = useState(1);
    const [pageMateriais, setPageMateriais] = useState(1);

    /**
     * getPageData
     *
     * Retorna os itens correspondentes à página solicitada.
     *
     * @param {Array<any>} arr - Array de itens
     * @param {number} page - Página (1-indexed)
     * @returns {Array<any>} Subarray com os itens da página
     */
    const getPageData = (arr, page) => arr.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    /**
     * getTotalPages
     *
     * Calcula o número total de páginas para um array dado o ITEMS_PER_PAGE.
     *
     * @param {Array<any>} arr - Array de itens
     * @returns {number} Total de páginas (inteiro)
     */
    const getTotalPages = arr => Math.ceil(arr.length / ITEMS_PER_PAGE);

        return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-7xl mx-auto">
                {/* Botão Voltar */}
                <button
                    onClick={() => navigate(-1)}
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
                        <button className="px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors">
                            <Link className="w-4 h-4 text-blue-400" />
                            Gerar Convite
                        </button>
                        <button 
                            className="px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 transition-colors shadow-lg shadow-yellow-400/20"
                            onClick={() => navigate(`/teacher/material/register/${id}`, { state: { origin: "class" } })}
                        >
                            <PlusCircle className="w-4 h-4 text-blue-700" />
                            Cadastrar Material
                        </button>
                        <button 
                            onClick={() => navigate('/teacher/simulated/register')} 
                            className="px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 transition-colors shadow-lg shadow-yellow-400/20"
                        >
                            <PlusCircle className="w-4 h-4 text-blue-700" />
                            Cadastrar Simulado
                        </button>
                    </div>
                </header>

                {/* Grid principal do Dashboard */}
                <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Card de Alunos */}
                    <DashboardCard 
                        title="Alunos" 
                        icon={<Users className="w-6 h-6 text-blue-400" />}
                        delay={100}
                    >
                        <ul className="space-y-2 flex-grow">
                            {getPageData(alunos, pageAlunos).map((aluno) => (
                                <li key={aluno} className="flex justify-between items-center p-2.5 rounded-md hover:bg-white/5 transition-colors group">
                                    <span className="text-slate-200 text-sm">{aluno}</span>
                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <Pagination currentPage={pageAlunos} totalPages={getTotalPages(alunos)} onPageChange={setPageAlunos} />
                    </DashboardCard>

                    {/* Card de Simulados */}
                    <DashboardCard 
                        title="Simulados" 
                        icon={<FileText className="w-6 h-6 text-blue-400" />}
                        delay={200}
                    >
                        <ul className="space-y-2 flex-grow">
                            {getPageData(simulados, pageSimulados).map((sim) => (
                                <li key={sim.nome} className="flex justify-between items-center p-2.5 rounded-md hover:bg-white/5 transition-colors group">
                                    <div className="flex flex-col">
                                        <span className="text-slate-200 text-sm">{sim.nome}</span>
                                        <span className="text-xs text-slate-400">{sim.respondido} de {alunos.length} alunos responderam</span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button><Eye className="w-4 h-4 text-blue-400 hover:text-blue-300" /></button>
                                        <button><Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" /></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <Pagination currentPage={pageSimulados} totalPages={getTotalPages(simulados)} onPageChange={setPageSimulados} />
                    </DashboardCard>
                    
                    {/* Card de Materiais (dados da API) */}
                    <DashboardCard 
                        title="Materiais de Aula" 
                        icon={<BookOpen className="w-6 h-6 text-blue-400" />}
                        delay={300}
                    >
                        <ul className="space-y-2 flex-grow">
                            {materials.length > 0 ? (
                                getPageData(materials, pageMateriais).map((mat) => (
                                    <li key={mat.id} className="flex justify-between items-center p-2.5 rounded-md hover:bg-white/5 transition-colors group">
                                        <span className="text-slate-200 text-sm truncate pr-4">{mat.title}</span>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button>
                                                <ArrowDownToLine className="w-4 h-4 text-blue-400 hover:text-blue-300" />
                                            </button>
                                            <button>
                                                <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
                                            </button>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="text-slate-400 text-sm italic">Nenhum material encontrado.</p>
                            )}
                        </ul>
                        <Pagination currentPage={pageMateriais} totalPages={getTotalPages(materials)} onPageChange={setPageMateriais} />
                    </DashboardCard>
                </main>
            </div>
        </div>
    );
}