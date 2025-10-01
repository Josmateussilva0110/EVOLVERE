import { useNavigate } from "react-router-dom"


/**
 * Componente de validação de conta.
 *
 * Exibe uma tela informando ao usuário que sua conta está em processo de validação
 * e que a equipe entrará em contato via e-mail em breve.
 *
 * Recursos:
 * - Título destacando o status da conta ("Conta em validação").
 * - Ícone de ampulheta animada com efeito visual de "aguarde".
 * - Mensagem explicando que as credenciais institucionais estão sendo verificadas.
 * - Link de suporte em destaque.
 * - Botão para retornar à tela de login.
 *
 * Hooks utilizados:
 * - `useNavigate` do `react-router-dom` para redirecionamento.
 *
 * @component
 * @example
 * // Uso dentro de uma rota
 * import AccountValidation from "./pages/auth/AccountValidation";
 *
 * function App() {
 *   return (
 *     <Routes>
 *       <Route path="/account-validation" element={<AccountValidation />} />
 *     </Routes>
 *   );
 * }
 *
 * @returns {JSX.Element} Tela informativa de conta em processo de validação.
 */
export default function AccountValidation() {
  const navigate = useNavigate()

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#0A0F68] px-4 overflow-hidden">
      {/* Efeitos sobre o azul escuro (base permanece sólida) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.28] bg-radial"></div>
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] bg-sheen"></div>
      <div className="relative max-w-lg w-full">
        <div className="bg-white rounded-3xl shadow-xl ring-1 ring-black/5 p-10 w-full text-center">
        <h1 className="text-2xl font-semibold text-[#0A0F68] mb-8">
          Conta em validação
        </h1>

        <div className="flex justify-center mb-8">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute w-24 h-24 rounded-full bg-yellow-400/30 blur-2xl"></div>
              {/* Lua amarela */}
              <div className="absolute left-1 w-20 h-20 bg-yellow-400 rounded-full -z-10"></div>
              {/* Ampulheta animada com areia */}
              <div className="w-20 h-20 organic-sway">
                <svg viewBox="0 0 96 96" width="80" height="80" aria-label="Ampulheta animada">
                {/* Moldura da ampulheta */}
                <path d="M20 12h56a4 4 0 0 1 0 8H20a4 4 0 0 1 0-8zm0 64h56a4 4 0 0 1 0 8H20a4 4 0 0 1 0-8z" fill="#0A0F68"/>
                <path d="M24 20c0 18 16 22 24 28-8 6-24 10-24 28v0M72 20c0 18-16 22-24 28 8 6 24 10 24 28v0" fill="none" stroke="#0A0F68" strokeWidth="4" strokeLinecap="round"/>

                {/* Áreas de recorte para a areia */}
                <clipPath id="upperTriangle">
                  <path d="M28 20 H68 C68 20 66 34 48 44 C30 34 28 20 28 20 Z" />
                </clipPath>
                <clipPath id="lowerTriangle">
                  <path d="M28 76 H68 C68 76 66 62 48 52 C30 62 28 76 28 76 Z" />
                </clipPath>

                {/* Areia superior (diminui) */}
                <g clipPath="url(#upperTriangle)">
                  <rect x="28" y="20" width="40" height="24" fill="#F5C23D">
                    <animate attributeName="height" from="24" to="0" dur="3s" repeatCount="indefinite" />
                  </rect>
                </g>

                {/* Filete de areia caindo */}
                <g>
                  <rect x="46.5" y="43" width="3" height="10" fill="#F5C23D">
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="height" values="0;10;10;0" keyTimes="0;0.1;0.9;1" dur="3s" repeatCount="indefinite" />
                  </rect>
                  <circle cx="48" cy="54" r="2.2" fill="#F5C23D">
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.9;1" dur="3s" repeatCount="indefinite" />
                  </circle>
                </g>

                {/* Areia inferior (aumenta) */}
                <g clipPath="url(#lowerTriangle)">
                  <rect x="28" y="76" width="40" height="0" fill="#F5C23D">
                    <animate attributeName="y" from="76" to="58" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="height" from="0" to="18" dur="3s" repeatCount="indefinite" />
                  </rect>
                </g>
                </svg>
              </div>
            </div>
        </div>

        <p className="text-gray-700 leading-relaxed mb-6">
          Estamos verificando suas credenciais institucionais. <br />
          Nossa equipe entrará em contato em breve via e-mail.
        </p>
    
        <p className="text-gray-900 font-semibold mb-10">
          Precisa de ajuda?{" "}
          <a href="#" className="text-[#0A0F68] underline decoration-[#0A0F68]/40 underline-offset-4 hover:decoration-[#0A0F68]">Contate nosso suporte</a>.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="inline-flex items-center justify-center rounded-lg bg-[#0A0F68] text-white px-5 py-2.5 text-sm font-medium shadow-sm hover:bg-[#0A0F68]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0A0F68] focus-visible:ring-offset-white transition"
        >
          Voltar ao login
        </button>
        </div>
      </div>
      {/* Estilos para animação orgânica e efeitos de fundo */}
      <style>{`
        @keyframes organic-sway-keyframes {
          0% { transform: rotate(0deg) translateY(0px); }
          25% { transform: rotate(-2.2deg) translateY(0.6px); }
          50% { transform: rotate(0.8deg) translateY(-0.6px); }
          75% { transform: rotate(1.6deg) translateY(0.4px); }
          100% { transform: rotate(0deg) translateY(0px); }
        }
        .organic-sway { 
          animation: organic-sway-keyframes 2.8s ease-in-out infinite; 
          transform-origin: 50% 10%;
          will-change: transform;
        }
        .bg-radial {
          background:
            radial-gradient(60% 50% at 50% 30%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.08) 38%, transparent 62%),
            radial-gradient(80% 65% at 50% 110%, rgba(0,0,0,0.35) 0%, transparent 55%),
            radial-gradient(30% 25% at 80% 15%, rgba(255,255,255,0.08) 0%, transparent 70%);
        }
        @keyframes sheen-move {
          0% { background-position: -50% 0%; }
          100% { background-position: 150% 0%; }
        }
        .bg-sheen {
          background-image: linear-gradient(110deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.0) 32%,
            rgba(255,255,255,0.14) 50%,
            rgba(255,255,255,0.0) 68%,
            rgba(255,255,255,0) 100%);
          background-size: 200% 100%;
          animation: sheen-move 8s linear infinite;
          mix-blend-mode: screen;
        }
      `}</style>
    </div>
  )
}
