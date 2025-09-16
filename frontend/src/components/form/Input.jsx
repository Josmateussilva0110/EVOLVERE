import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

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
