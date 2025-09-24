import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"


/**
 * Componente de campo de entrada de dados (input) personalizável.
 *
 * Funcionalidades:
 * - Suporta tipos de input padrão (`text`, `email`, `password`, etc.).
 * - Para campos do tipo `password`, permite alternar a visibilidade com ícone.
 * - Suporta valores controlados (`value`) e múltiplos arquivos (`multiple`).
 *
 * Props:
 * @param {string} [type="text"] - Tipo do campo de entrada.
 * @param {string} text - Texto descritivo do campo (opcional, não exibido internamente).
 * @param {string} name - Nome e id do campo.
 * @param {string} placeholder - Placeholder exibido no input.
 * @param {function} handleOnChange - Função chamada ao alterar o valor do input.
 * @param {string|number} value - Valor atual do input (para campos controlados).
 * @param {boolean} multiple - Permite seleção múltipla (para input file).
 *
 * @component
 * @example
 * <Input
 *   type="text"
 *   name="username"
 *   placeholder="Digite seu nome"
 *   value={username}
 *   handleOnChange={(e) => setUsername(e.target.value)}
 * />
 *
 * <Input
 *   type="password"
 *   name="password"
 *   placeholder="Digite sua senha"
 *   value={password}
 *   handleOnChange={(e) => setPassword(e.target.value)}
 * />
 *
 * @returns {JSX.Element} Campo de entrada estilizado com suporte a senha e múltiplos arquivos.
 */
function Input({
  type = "text",
  text,
  name,
  placeholder,
  handleOnChange,
  value,
  multiple
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"
  const inputType = isPassword && showPassword ? "text" : type

  return (
    <div className="relative w-full">
      <input
        type={inputType}
        name={name}
        id={name}
        placeholder={placeholder}
        onChange={handleOnChange}
        value={value}
        {...(multiple ? { multiple } : {})}
        className="
          w-full
          rounded-lg
          bg-gray-100
          px-4
          py-3
          text-gray-700
          placeholder-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-indigo-500
        "
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute inset-y-0 right-3 flex items-center 
                      transition duration-200
                      ${showPassword ? "text-indigo-600" : "text-gray-500 hover:text-indigo-500"}`}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  )
}

export default Input
