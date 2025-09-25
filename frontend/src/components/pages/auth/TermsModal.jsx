import { X } from "lucide-react"

/**
 * Modal de Termos de Serviço e Política de Privacidade.
 *
 * Exibe o conteúdo dos termos em uma janela modal com rolagem.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla se o modal está aberto.
 * @param {function} props.onClose - Função para fechar o modal.
 * @returns {JSX.Element|null}
 */
function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 relative">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-[#060060] mb-4">
          Termos de Serviço e Política de Privacidade
        </h2>

        <p className="text-gray-700 leading-relaxed mb-4">
          Bem-vindo à Evolvere! Ao utilizar nossa plataforma, você concorda com os seguintes termos:
        </p>

        <h3 className="text-lg font-semibold text-[#060060] mt-4 mb-2">1. Uso da Plataforma</h3>
        <p className="text-gray-700 mb-4">
          O usuário compromete-se a utilizar a plataforma de maneira ética, respeitando as normas e diretrizes
          estabelecidas pela Evolvere.
        </p>

        <h3 className="text-lg font-semibold text-[#060060] mt-4 mb-2">2. Privacidade</h3>
        <p className="text-gray-700 mb-4">
          Respeitamos sua privacidade e garantimos que suas informações pessoais serão tratadas conforme nossa
          Política de Privacidade.
        </p>

        <h3 className="text-lg font-semibold text-[#060060] mt-4 mb-2">3. Responsabilidades</h3>
        <p className="text-gray-700 mb-4">
          O usuário é responsável pelas informações fornecidas e pelo uso correto da plataforma.
        </p>
      </div>
    </div>
  )
}

export default TermsModal
