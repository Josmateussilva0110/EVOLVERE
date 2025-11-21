import { useNavigate } from "react-router-dom"
import Input from "../../form/Input"
import FileUpload from "../../form/FileUpload"
import { useState, useEffect, useContext } from "react"
import { FaUserGraduate, FaChalkboardTeacher, FaUniversity } from "react-icons/fa"
import requestData from "../../../utils/requestApi"
import userService from "./service/userService"
import useFlashMessage from "../../../hooks/useFlashMessage"
import Select from "../../form/Select"
import { Context } from "../../../context/UserContext"; 


/**
 * Componente de criação de conta de usuário autenticado.
 *
 * Esta tela é exibida após o login inicial e permite que o usuário
 * finalize o cadastro vinculando-se a uma instituição e escolhendo seu perfil.
 *
 * Funcionalidades:
 * - Carrega a sessão atual do usuário para validar autenticação.
 * - Busca lista de instituições/cursos disponíveis.
 * - Permite selecionar a instituição e inserir o código de acesso.
 * - Botões de escolha de perfil:
 *   - Aluno (role = 4)
 *   - Professor (role = 3)
 *   - Coordenação (role = 2)
 * - Upload de diploma em PDF (obrigatório para professor ou coordenação).
 * - Submissão dos dados para a API via `userService.registerAccount`.
 *
 * Hooks utilizados:
 * - `useState` para gerenciar dados do usuário, perfil, cursos e estado de carregamento.
 * - `useEffect` para verificar sessão ativa e buscar lista de instituições.
 * - `useNavigate` do `react-router-dom` para redirecionamentos.
 * - `useFlashMessage` para exibir mensagens de feedback.
 *
 * Componentes filhos:
 * - `Input`: campo de texto genérico.
 * - `Select`: lista suspensa de instituições.
 * - `FileUpload`: upload de arquivos (diploma).
 *
 * @component
 * @example
 * // Uso básico dentro de uma rota
 * import UserAccount from "./pages/auth/UserAccount";
 *
 * function App() {
 *   return (
 *     <Routes>
 *       <Route path="/account" element={<UserAccount />} />
 *     </Routes>
 *   );
 * }
 *
 * @returns {JSX.Element} Formulário de configuração de conta do usuário.
 */
function UserAccount() {
  const [user, setUser] = useState({})
  const [role, setRole] = useState(4)
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState([])
  const { setFlashMessage } = useFlashMessage()
  const navigate = useNavigate()
  const { logout } = useContext(Context);

/**
 * useEffect para verificar a sessão atual do usuário.
 *
 * Faz uma requisição GET para "/user/session" para obter os dados da sessão.
 * - Se a sessão estiver ativa, atualiza o estado `user`.
 * - Se não estiver, define `user` como `null`.
 * Atualiza o estado `loading` para indicar que a verificação foi concluída.
 *
 * Executa apenas uma vez ao montar o componente.
 */
  useEffect(() => {
    async function checkSession() {
      const response = await requestData("/user/session", "GET", {}, true)
      if (response.success) {
        setUser(response.data.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    }
    checkSession()
  }, [])


/**
 * useEffect para buscar a lista de cursos/instituições disponíveis.
 *
 * Faz uma requisição GET para "/courses".
 * - Se bem-sucedida, atualiza o estado `courses`.
 * - Se houver erro, exibe uma mensagem de feedback via `setFlashMessage`.
 *
 * Executa apenas uma vez ao montar o componente.
 */
  useEffect(() => {
    async function fetchCourses() {
      const response = await requestData("/courses", "GET", {}, true)
      if(response.success) {
        setCourses(response.data.courses)
      }
      else {
        setFlashMessage(response.message, 'error')
      }
    }
    fetchCourses()
  }, [])

  /**
 * Atualiza os dados do usuário no estado local conforme o input é modificado.
 *
 * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} event - Evento disparado pelo campo de input ou select.
 * @param {string} event.target.name - Nome do campo que está sendo atualizado.
 * @param {string} event.target.value - Valor atual do campo.
 *
 * @returns {void} Atualiza o estado `user` com o novo valor.
 */
  function handleChange(event) {
    setUser({ ...user, [event.target.name]: event.target.value })
  }

/**
 * Atualiza o estado do usuário com o arquivo selecionado para upload.
 *
 * @param {File} file - Arquivo selecionado pelo usuário (geralmente PDF).
 *
 * @returns {void} Atualiza a propriedade `diploma` do objeto `user`.
 */
  function handleFileChange(file) {
    setUser({ ...user, diploma: file })
  }

/**
 * Função disparada ao submeter o formulário de criação de conta.
 *
 * Constrói um objeto FormData contendo os dados do usuário, incluindo ID, instituição,
 * código de acesso, diploma (se aplicável) e role selecionada. Envia para a API
 * através do `userService.registerAccount`. Exibe mensagens de feedback via
 * `setFlashMessage` caso o usuário não esteja autenticado.
 *
 * @param {React.FormEvent<HTMLFormElement>} event - Evento de submit do formulário.
 *
 * @returns {Promise<void>} Envia os dados para a API e navega conforme resposta.
 */
  async function submitForm(event) {
    event.preventDefault()
    if(user) {
      const formData = new FormData()
      if (user.id) formData.append("id", user.id)
      if (user.institution) formData.append("institution", user.institution)
      if (user.access_code) formData.append("access_code", user.access_code)
      if (role !== 4 && user.diploma) {
        formData.append("diploma", user.diploma);
      }

      formData.append("role", role);
      const success = await userService.registerAccount(formData, setFlashMessage);
      
      if (success) {
        if (role === 4) { 
          navigate('/');
        } else {
          navigate('/await/approval');
        }
      }
    } else {
      setFlashMessage("Usuário não autenticado", "error");
    }
  }
  

  if (loading) {
    return <div className="text-white text-center mt-10">Carregando...</div>;
  }

  if (user === null) {
    return <div className="text-white text-center mt-10">Usuário não autenticado.</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#060060] px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10 md:p-14 w-full max-w-xl text-center">
        {/* Título */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[#060060] mb-3">
          Estamos quase lá
        </h2>

        {/* Subtítulo */}
        <p className="text-gray-600 text-sm sm:text-base mb-8">
          Escolha sua instituição, informe o código de acesso e identifique seu perfil para continuar.
        </p>

        <form onSubmit={submitForm} className="space-y-4">
          {/* Lista suspensa de cursos */}
          <Select
            name="institution"
            items={courses}
            valueKey="name_IES"
            labelKey="name_IES"
            value={user?.institution || ""}
            onChange={handleChange}
            label="Selecione sua instituição"
          />


          <Input
            text=""
            type="text"
            name="access_code"
            placeholder="Código de acesso"
            handleOnChange={handleChange}
          />

          {/* Botões de seleção de perfil */}
          <div className="flex justify-center gap-3 mt-4">
            <button
              type="button"
              onClick={() => setRole(4)}
              className={`flex flex-col items-center px-6 py-3 rounded-lg border transition
                ${role === 4 ? "bg-[#060060] text-white" : "border-gray-400 text-gray-700"}`}
            >
              <FaUserGraduate size={28} />
              <span className="mt-1 font-semibold">Aluno</span>
            </button>

            <button
              type="button"
              onClick={() => setRole(3)}
              className={`flex flex-col items-center px-6 py-3 rounded-lg border transition
                ${role === 3 ? "bg-[#060060] text-white" : "border-gray-400 text-gray-700"}`}
            >
              <FaChalkboardTeacher size={28} />
              <span className="mt-1 font-semibold">Professor</span>
            </button>

            <button
              type="button"
              onClick={() => setRole(2)}
              className={`flex flex-col items-center px-6 py-3 rounded-lg border transition
                ${role === 2 ? "bg-[#060060] text-white" : "border-gray-400 text-gray-700"}`}
            >
              <FaUniversity size={28} />
              <span className="mt-1 font-semibold">Coordenação</span>
            </button>
          </div>

          {/* Upload de diploma (apenas para professor ou coordenação) */}
          {(role === 2 || role === 3) && (
            <FileUpload name="diploma" label="Anexar diploma (PDF)" onFileChange={handleFileChange} />
          )}

          {/* Botão avançar */}
          <button
            type="submit"
            className="w-full py-3 bg-yellow-400 text-[#060060] font-bold rounded-lg hover:bg-yellow-500 transition mt-6"
          >
            Avançar
          </button>
        </form>

        {/* Rodapé */}
        <p className="text-xs sm:text-sm text-gray-600 mt-6">
          Já está na Evolvere?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-[#060060] font-semibold hover:underline"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  )
}

export default UserAccount
