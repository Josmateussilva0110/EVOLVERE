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
  return (
    <footer className="bg-[#060060] text-gray-300 py-4 fixed bottom-0 w-full">
      <p className="text-center text-sm">
        <span className="font-semibold text-white">EVOLVERE</span> &copy; 2025
      </p>
    </footer>
  )
}

export default Footer
