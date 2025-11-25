// Configuração da API
// INSTRUÇÕES:
// 1. Acesse https://mockapi.io/
// 2. Crie uma conta e um novo projeto
// 3. Configure o endpoint /users com o schema especificado no README
// 4. Substitua a URL abaixo pela URL gerada pelo MockAPI

const API_CONFIG = {
  // Substitua esta URL pela sua URL do MockAPI.io
  BASE_URL: "https://6925df7c82b59600d7258a9a.mockapi.io/api/v1/users",

  // Configurações opcionais
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
}

// Validar se a API foi configurada
function validateApiConfig() {
  if (
    API_CONFIG.BASE_URL.includes("your-mockapi-id") ||
    API_CONFIG.BASE_URL.includes("SEU-ID-AQUI") ||
    API_CONFIG.BASE_URL === ""
  ) {
    return false
  }
  return true
}

// Exportar configuração
window.API_CONFIG = API_CONFIG
window.validateApiConfig = validateApiConfig
