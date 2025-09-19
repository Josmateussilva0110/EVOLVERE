import { useNavigate } from "react-router-dom"
import Input from "../../form/Input"
import Image from "../../form/Image"
import { useState, useContext } from "react"
import { Context } from "../../../context/UserContext"

function Register() {
  const [user, setUser] = useState({})
  const { register } = useContext(Context)
  const navigate = useNavigate()

  function handleChange(event) {
    setUser({ ...user, [event.target.name]: event.target.value })
  }

  async function submitForm(e) {
    e.preventDefault()
    register(user)
  }

  return (
    <div className="flex min-h-screen">
      {/* Lado Esquerdo (visível apenas em telas grandes) */}
      <div className="hidden lg:flex relative basis-[35%] bg-white px-8 sm:px-16">
      <div className="absolute top-0 left-0">
        <Image src={"/logo_preto.png"} alt="Evolvere Logo" size={160} />
      </div>

      <div className="flex flex-col justify-center items-start w-full">
        <h1 className="text-5xl font-bold text-[#060060] mb-6 leading-tight mt-24">
          Seja <br /> Bem-Vindo(a)
        </h1>

        <p className="text-gray-700 text-lg leading-relaxed max-w-sm">
          A Evolvere é o espaço onde aprendizado, prática e feedback se encontram. 
          Inscreva-se e descubra como organizar seus estudos de forma clara, evoluir 
          com constância e alcançar seus objetivos acadêmicos.
        </p>
      </div>
    </div>

      {/* Lado Direito (sempre visível) */}
      <div className="flex justify-center items-center w-full lg:basis-[65%] bg-[#060060] px-6 sm:px-12">
        <div className="bg-white rounded-xl shadow-lg p-10 sm:p-12 md:p-16 w-full max-w-lg text-center">
          
          <h2 className="text-2xl sm:text-3xl font-bold text-[#060060] mb-10">
            Novo por aqui ?
          </h2>

          <form onSubmit={submitForm} className="space-y-5">
            <Input
              type="text"
              name="username"
              placeholder="Insira seu nome completo"
              handleOnChange={handleChange}
              className="text-lg py-3"
            />

            <Input
              type="email"
              name="email"
              placeholder="Insira seu endereço de e-mail"
              handleOnChange={handleChange}
              className="text-lg py-3"
            />

            <Input
              type="password"
              name="password"
              placeholder="Digite sua senha"
              handleOnChange={handleChange}
              className="text-lg py-3"
            />

            <Input
              type="password"
              name="confirm_password"
              placeholder="Confirmar senha"
              handleOnChange={handleChange}
              className="text-lg py-3"
            />

            <button
              type="submit"
              className="w-full py-4 bg-yellow-400 text-[#060060] text-lg font-bold rounded-lg 
                         hover:bg-yellow-500 transition"
            >
              Inscrever-se
            </button>
          </form>

          <p className="mt-4 text-base">
            Já está na Evolvere?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#060060] font-semibold hover:underline"
            >
              Entrar
            </button>
          </p>

          <div className="flex items-center mt-6 text-left">
            <input
              type="checkbox"
              id="terms"
              className="mr-2 w-4 h-4"
            />
            <label htmlFor="terms" className="text-base text-gray-600">
              Eu aceito os{" "}
              <span className="font-semibold">Termos de Serviço</span> e a{" "}
              <span className="font-semibold">Política de Privacidade</span> da Evolvere
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
