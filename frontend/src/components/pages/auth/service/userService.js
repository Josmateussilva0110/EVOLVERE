import requestData from "../../../../utils/requestApi"


/**
 * Serviço responsável pelas operações relacionadas à conta do usuário.
 *
 * Atualmente, lida com o processo de registro/validação de conta
 * após o login inicial.
 *
 * Funcionalidades:
 * - Envia os dados do usuário para a API (`/user/account`) via método POST.
 * - Exibe mensagens de feedback (sucesso ou erro) utilizando `setFlashMessage`.
 * - Redireciona o usuário para a rota de aprovação (`/await/approval`) em caso de sucesso.
 *
 * @class UserService
 */
class UserService {

  /**
   * Registra ou atualiza uma conta de usuário autenticado.
   *
   * @async
   * @function registerAccount
   * @memberof UserService
   * @param {FormData|Object} userData - Dados do usuário a serem enviados para a API.
   * @param {Function} navigate - Função de navegação do `react-router-dom` para redirecionamento.
   * @param {Function} setFlashMessage - Função para exibir mensagens de feedback ao usuário.
   * @returns {Promise<Object>} Retorna a resposta da API contendo `success`, `message` e outros dados.
   *
   * @example
   * import userService from "./service/userService";
   *
   * async function handleSubmit(formData) {
   *   const response = await userService.registerAccount(
   *     formData,
   *     navigate,
   *     setFlashMessage
   *   );
   *   console.log(response);
   * }
   */
  async registerAccount(userData, navigate, setFlashMessage) {
    const response = await requestData("/user/account", "POST", userData, true)

    if (response.success) {
      setFlashMessage(response.message, "success")
      navigate("/await/approval")
    } else {
      setFlashMessage(response.message, "error")
    }

    return response
  }
}

const userService = new UserService()
export default userService
