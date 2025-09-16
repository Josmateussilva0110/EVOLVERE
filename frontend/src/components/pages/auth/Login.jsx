import { useState, useContext } from "react"
import Input from "../../form/Input"
import { Context } from "../../../context/UserContext"

function Login() {
  const [user, setUser] = useState({})
  const { login } = useContext(Context)

  function handleChange(event) {
    setUser({ ...user, [event.target.name]: event.target.value })
  }

  async function submitForm(event) {
    event.preventDefault()
    login(user)
  }

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={submitForm} className="space-y-5">
          <Input
            text="Seu Email"
            type="email"
            name="email"
            placeholder="Insira seu endereço de email"
            handleOnChange={handleChange}
          />

          <Input
            text="Sua Senha"
            type="password"
            name="password"
            placeholder="Digite sua Senha"
            handleOnChange={handleChange}
          />

        {/* Botão */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-xl shadow-md 
                      hover:bg-red-700 focus:outline-none focus:ring-2
                      transform transition duration-300 hover:scale-105"
        >
          Iniciar sessão
        </button>
      </form>
    </>
  )
}

export default Login
