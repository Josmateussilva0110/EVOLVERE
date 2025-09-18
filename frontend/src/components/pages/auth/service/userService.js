import requestData from "../../../../utils/requestApi"

class UserService {
  async registerAccount(userData, navigate, setFlashMessage) {
    try {
      const response = await requestData("/user/account", "POST", userData, true)

      if (response.success) {
        setFlashMessage(response.data.message, "success")
        navigate("/")
      } else {
        setFlashMessage(response.message, "error")
      }

      return response
    } catch (error) {
      console.error("Erro no registerAccount:", error)
      setFlashMessage("Erro no servidor", "error")
      return { success: false, message: "Erro no servidor" }
    }
  }

}

const userService = new UserService()
export default userService
