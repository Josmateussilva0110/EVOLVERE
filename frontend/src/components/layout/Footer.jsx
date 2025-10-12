import { useLocation } from "react-router-dom"
/**
 * Componente de rodapé da aplicação.
 *
 * Exibe um rodapé fixo na parte inferior da tela com a marca
 * "EVOLVERE" e o ano atual.
 *
 * Estilização:
 * - Fundo azul escuro (`#060060`).
 * - Texto centralizado em cinza claro, com destaque em branco para a marca.
 * - Sempre fixo ao final da página (classe `fixed bottom-0 w-full`).
 *
 * @component
 * @example
 * // Uso dentro do layout principal
 * import Footer from "./components/layout/Footer";
 *
 * @returns {JSX.Element} Rodapé fixo com marca e ano.
 */
function Footer() {
  const location = useLocation()
  const path = location.pathname

 
    const bgColor =
      path.startsWith('/teacher') ? 'bg-[#1A2434]' :
      path.startsWith('/student') ? 'bg-green-900' :
      path.startsWith('/coordinator') ? 'bg-gray-900' :
      path === '/' ? 'bg-[#26267B]' :
      'bg-transparent'

  return (
    <footer className={`${bgColor} text-gray-300 py-4 bottom-0 w-full transition-colors duration-500`}>
    <p className="text-center text-sm">
      <span className="font-semibold text-white">&copy; EVOLVERE</span>{" "}
      {new Date().getFullYear()} — Todos os direitos reservados.
    </p>
    </footer>
  )
}

export default Footer
