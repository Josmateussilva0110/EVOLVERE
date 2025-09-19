import requestData from "../../../../utils/requestApi"

class UserService {
  async registerAccount(userData, navigate, setFlashMessage) {
    const response = await requestData("/user/account", "POST", userData, true)

    if (response.success) {
      setFlashMessage(response.message, "success")
      navigate("/")
    } else {
      setFlashMessage(response.message, "error")
    }

    return response
  }
}

const userService = new UserService()
export default userService
