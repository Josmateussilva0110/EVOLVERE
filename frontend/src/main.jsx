import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { UserProvider } from './context/UserContext'
import './index.css' // reset global


/**
 * Ponto de entrada da aplicação Evolvere.
 *
 * Funções:
 * - Renderiza a aplicação React dentro do elemento com id "root".
 * - Envolve o App com:
 *   - `StrictMode`: ativa verificações adicionais e avisos de desenvolvimento.
 *   - `BrowserRouter`: habilita roteamento via URL.
 *   - `UserProvider`: provê contexto global de autenticação.
 *
 * @example
 * // HTML:
 * // <div id="root"></div>
 *
 * // JS:
 * import './index.jsx'
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
)
