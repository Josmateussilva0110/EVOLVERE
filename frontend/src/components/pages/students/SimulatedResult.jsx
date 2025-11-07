/**
 * @file SimulatedResult.jsx
 * @description Componente que exibe o resultado detalhado de um simulado realizado pelo estudante.
 * Apresenta estatísticas de desempenho, gabarito e opções de revisão.
 * 
 * @module pages/students/SimulatedResult
 * @requires react
 * @requires react-router-dom
 * @requires react-icons/fi
 */

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../../utils/api';
import { 
    FiCheckCircle, 
    FiXCircle, 
    FiClock, 
    FiPrinter, 
    FiEye, 
    FiList, 
    FiInfo,
    FiRefreshCw 
} from 'react-icons/fi';

/**
 * @typedef {Object} SimulatedResultData
 * @property {string} studentName - Nome do estudante
 * @property {number} percentage - Porcentagem de acertos (0-100)
 * @property {number} correctAnswers - Número de respostas corretas
 * @property {number} wrongAnswers - Número de respostas erradas
 * @property {string} timeSpent - Tempo gasto no formato "HH:MM"
 */

// Dados mockados para teste
const mockResult = {
  studentName: "Guilherme",
  percentage: 5.5,
  correctAnswers: 1,
  wrongAnswers: 14,
  timeSpent: "02:14"
};

/**
 * @component
 * @description Componente de modal reutilizável com fundo escuro e animação suave
 * 
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isOpen - Controla a visibilidade do modal
 * @param {Function} props.onClose - Função chamada ao fechar o modal
 * @param {React.ReactNode} props.children - Conteúdo a ser renderizado dentro do modal
 * 
 * @returns {React.ReactElement|null} Retorna o modal quando aberto ou null quando fechado
 */
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {children}
        </div>
        <div className="border-t px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * @component SimulatedResult
 * @description Página principal que exibe o resultado detalhado de um simulado.
 * Mostra estatísticas de desempenho como porcentagem de acertos, número de questões
 * corretas/incorretas e tempo gasto. Também fornece opções para revisar respostas,
 * imprimir resultados e acessar a lista de revisão.
 *
 * @example
 * // Uso na rota
 * <Route path="/student/simulated/result/:id" component={SimulatedResult} />
 *
 * Estados:
 * - result: Dados do resultado do simulado
 * - loading: Indica se os dados estão sendo carregados
 * - error: Mensagem de erro, se houver
 * - isModalOpen: Controla a visibilidade do modal
 *
 * Funcionalidades:
 * - Exibe gráfico circular de progresso
 * - Mostra estatísticas detalhadas
 * - Permite revisar respostas
 * - Oferece opção de impressão
 * - Integra com sistema de revisão
 *
 * @returns {React.ReactElement} Página completa de resultado do simulado
 */
const SimulatedResult = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para o modal
  const { id } = useParams();

  /**
   * @function
   * @description Busca os resultados do simulado da API quando o componente é montado
   * @async
   */
  useEffect(() => {
    /**
     * @function
     * @async
     * @description Função interna que realiza a busca dos dados do simulado
     * @throws {Error} Erro ao buscar dados do simulado
     */
    const fetchResult = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setResult(mockResult);
          setLoading(false);
        }, 1000);
      } catch (error) {
        setError('Erro ao carregar o resultado do simulado');
        console.error('Erro:', error);
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  /**
 * @function
 * @description Determina as classes de cor do Tailwind com base na porcentagem de acertos
 * 
 * @param {number} percentage - Porcentagem de acertos (0-100)
 * @returns {string} Classes CSS do Tailwind para cor do texto e stroke
 */
const getPercentageColorClass = (percentage) => {
    if (percentage < 60) return 'text-red-500 stroke-red-500';
    if (percentage < 80) return 'text-yellow-500 stroke-yellow-500';
    return 'text-green-500 stroke-green-500';
  };

  // Wrapper da Página (Layout Principal)
  /**
 * @component
 * @description Componente wrapper que provê o layout padrão da página com cabeçalho e rodapé
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteúdo a ser renderizado dentro do wrapper
 * 
 * @returns {React.ReactElement} Layout estruturado da página
 */
const PageWrapper = ({ children }) => (
    <div className="min-h-screen flex flex-col">
      {/* Ajustado o padding vertical (py) para ser menor em telas pequenas
        Adicionado w-full para garantir que o main ocupe toda a largura
      */}
      <main className="grow max-w-4xl mx-auto px-4 py-6 sm:py-10 w-full">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-200">
        © EVOLVERE {new Date().getFullYear()} — Todos os direitos reservados.
      </footer>
    </div>
  );

  // Telas de Loading e Erro (com padding responsivo)
  if (loading) {
    return (
      <PageWrapper>
        {/* Padding responsivo: p-6 em telas pequenas, p-12 em maiores */}
        <div className="bg-white p-6 sm:p-12 rounded-xl shadow-lg flex justify-center items-center h-72">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-blue-600"></div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="bg-white p-6 sm:p-12 rounded-xl shadow-lg flex flex-col items-center justify-center h-72 text-red-600 text-center">
          <FiInfo className="text-4xl sm:text-5xl mb-4" />
          <h3 className="text-xl sm:text-2xl font-semibold">Erro ao carregar</h3>
          <p>{error}</p>
        </div>
      </PageWrapper>
    );
  }

  const { studentName, percentage, correctAnswers, wrongAnswers, timeSpent } = result;
  const percentageColorClass = getPercentageColorClass(percentage);
  const strokeDasharrayValue = ((percentage || 0) / 100) * 251.2;

  return (
    <PageWrapper>
      {/* Espaçamento entre os cards: 
        space-y-6 em telas pequenas, space-y-8 em maiores
      */}
      <div className="space-y-6 sm:space-y-8">
        
        {/* Card Principal de Resultados */}
        {/* Padding responsivo: p-5 em telas pequenas, p-8 em maiores */}
        <div className="bg-white p-5 sm:p-8 rounded-xl shadow-lg">
          {/* Layout do card: 
            - flex-col (padrão mobile)
            - md:flex-row (layout lado a lado em telas médias/grandes)
            - Gap responsivo: gap-6 (mobile) e gap-10 (desktop)
          */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10">
            
            {/* Saudação e Mensagem */}
            {/* - text-center (padrão mobile)
              - md:text-left (alinhado à esquerda em desktop)
            */}
            <div className="text-center md:text-left flex-grow">
              {/* Tipografia responsiva: text-2xl (mobile), sm:text-3xl (desktop) */}
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
                {percentage < 60 
                  ? `Treine um pouco mais, ${studentName}!`
                  : `Parabéns, ${studentName}!`
                }
              </h2>
              {/* Tipografia responsiva: text-sm (mobile), sm:text-base (desktop) */}
              <p className="text-sm sm:text-base text-gray-500">
                Mantenha a consistência nos estudos que os resultados começarão a aparecer!
              </p>
            </div>

            {/* Círculo de Progresso e Estatísticas */}
            {/* Layout do bloco:
              - flex-col (padrão mobile, empilha o círculo e as estatísticas)
              - sm:flex-row (lado a lado em telas pequenas/tablets)
              - gap-6 (mobile) e sm:gap-8 (maiores)
            */}
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full sm:w-auto">
              
              {/* Círculo de Progresso */}
              {/* - Tamanho responsivo: w-28 h-28 (mobile), sm:w-32 sm:h-32 (desktop)
              */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0">
                <svg 
                  className="w-full h-full transform -rotate-90" 
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <circle
                    className="text-gray-200 stroke-current"
                    strokeWidth="10" cx="50" cy="50" r="40" fill="transparent"
                  />
                  <circle
                    className={`${percentageColorClass} stroke-current`}
                    strokeWidth="10" strokeLinecap="round" cx="50" cy="50" r="40"
                    fill="transparent"
                    strokeDasharray={`${strokeDasharrayValue} 251.2`}
                    style={{ transition: 'stroke-dasharray 0.5s ease-in-out' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-2xl sm:text-3xl font-bold ${percentageColorClass.split(' ')[0]}`}>
                    {(percentage || 0).toFixed(1)}%
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 text-center">de aproveitamento</span>
                </div>
              </div>

              {/* Estatísticas */}
              {/* - w-full (mobile, para ocupar a largura)
                - sm:w-auto (desktop)
                - gap-3 (entre os itens)
              */}
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-green-500 text-xl sm:text-2xl" />
                  <div>
                    <span className="text-lg sm:text-xl font-bold text-gray-900">{correctAnswers}</span>
                    <span className="text-sm text-gray-500 ml-1.5">acerto{correctAnswers !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiXCircle className="text-red-500 text-xl sm:text-2xl" />
                  <div>
                    <span className="text-lg sm:text-xl font-bold text-gray-900">{wrongAnswers}</span>
                    <span className="text-sm text-gray-500 ml-1.5">erro{wrongAnswers !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiClock className="text-blue-500 text-xl sm:text-2xl" />
                  <div>
                    <span className="text-lg sm:text-xl font-bold text-gray-900">{timeSpent}</span>
                    <span className="text-sm text-gray-500 ml-1.5">tempo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Ações */}
        {/* Layout dos botões:
          - flex-col (padrão mobile, empilhados)
          - sm:flex-row (lado a lado em telas maiores)
          - items-center (para centralizar em coluna no mobile)
          - gap-4 (mobile) e sm:gap-6 (desktop)
        */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <button 
            onClick={() => alert('...')}
            className="flex items-center justify-center gap-2 text-base text-gray-600 hover:text-blue-600 font-medium transition-colors w-full sm:w-auto"
          >
            <FiRefreshCw size={18} />
            <span>Refazer simulado</span>
          </button>
          <Link 
            to={`/student/simulated/review/${id}`}
            className="flex items-center justify-center gap-2 text-base text-gray-600 hover:text-blue-600 font-medium transition-colors w-full sm:w-auto"
          >
            <FiEye size={18} />
            <span>Ver cartão resposta</span>
          </Link>
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 text-base text-gray-600 hover:text-blue-600 font-medium transition-colors w-full sm:w-auto"
          >
            <FiPrinter size={18} />
            <span>Imprimir simulado</span>
          </button>
        </div>

        {/* Seção Gabarito */}
        {/* Padding responsivo: p-5 (mobile), sm:p-8 (desktop) */}
        <div className="bg-white p-5 sm:p-8 rounded-xl shadow-lg">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4">Gabarito</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-6">
            Se encontrar algum problema na correção deste simulado, salve o link ou tire um printscreen e nos envie. 
            Verificaremos as questões respondidas e efetuaremos as devidas correções.
          </p>
          
          {/* Item de gabarito */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-2">
              <span className="bg-blue-600 text-white text-sm font-semibold px-2.5 py-1 rounded-full flex-shrink-0">01</span>
              <div className="flex-grow">
                  <p className="text-base font-semibold text-gray-800">Matemática</p>
                  <p className="text-sm text-gray-500">89,2% de acerto na questão</p>
              </div>
          </div>
          {/* ... outros itens ... */}
        </div>

        {/* Seção de Revisão */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-5 sm:p-6 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <FiInfo className="text-2xl sm:text-3xl text-blue-600 flex-shrink-0" />
            <p className="text-sm sm:text-base text-blue-800">
              Os assuntos que você errou já entraram na sua lista de revisão. Confira!
            </p>
          </div>
          <Link 
            to="/student/revision-list"
            className="px-6 py-2.5 bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-800 transition flex-shrink-0 w-full sm:w-auto text-center"
          >
            Acessar lista de revisões
          </Link>
        </div>
        
      </div>

      {/* Modal (exemplo de uso) */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      >
        <h3 className="text-lg font-semibold mb-2">Título do Modal</h3>
        <p>Conteúdo do modal aqui...</p>
      </Modal>
    </PageWrapper>
  );
};

export default SimulatedResult;