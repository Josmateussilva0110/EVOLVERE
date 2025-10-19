import requestData from "../../../../utils/requestApi"; // Confirme se o caminho está correto

/**
 * Serviço responsável pelas operações relacionadas à conta do usuário.
 * Lida com o processo de registro/validação de conta após o login inicial.
 *
 * @class UserService
 */
class UserService {

  /**
   * Registra ou atualiza uma conta de usuário autenticado enviando dados para a API.
   *
   * @async
   * @function registerAccount
   * @memberof UserService
   * @param {FormData} userData - Dados do usuário a serem enviados para a API.
   * Deve incluir 'role' e opcionalmente 'diploma'.
   * @param {Function} setFlashMessage - Função para exibir mensagens de feedback ao usuário.
   * @returns {Promise<boolean>} Retorna `true` se a operação na API foi bem-sucedida,
   * `false` caso contrário.
   *
   * @example
   * import userService from "./service/userService";
   *
   * async function handleSubmit(formData) {
   * const success = await userService.registerAccount(formData, setFlashMessage);
   * if (success) {
   * // Lógica de redirecionamento no componente...
   * }
   * }
   */
  async registerAccount(userData, setFlashMessage) {
    try {
      const response = await requestData("/user/account", "POST", userData, true);

      if (response && response.success) {
        setFlashMessage(response.message || 'Conta configurada com sucesso!', 'success');
        return true; 
      } else {
        setFlashMessage(response?.message || 'Falha ao configurar a conta.', 'error');
        return false; 
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erro de comunicação com o servidor.';
      setFlashMessage(message, 'error');
      console.error("Erro em registerAccount:", error);
      return false; 
    }
  }
}

const userService = new UserService();
export default userService;