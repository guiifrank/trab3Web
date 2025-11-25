// Painel de Gerenciamento de Usuários
// A configuração da API está no arquivo config.js
const API_BASE_URL =
  window.API_CONFIG?.BASE_URL ||
  "https://6925df7c82b59600d7258a9a.mockapi.io/api/v1/users"

// Global variables
let allUsers = []
let currentEditingId = null

// DOM Elements
const loadingSpinner = document.getElementById("loadingSpinner")
const usersTableContainer = document.getElementById("usersTableContainer")
const noUsersMessage = document.getElementById("noUsersMessage")
const usersTableBody = document.getElementById("usersTableBody")
const userCount = document.getElementById("userCount")
const searchInput = document.getElementById("searchInput")
const statusFilter = document.getElementById("statusFilter")
const userModal = new bootstrap.Modal(document.getElementById("userModal"))
const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"))
const notificationToast = new bootstrap.Toast(
  document.getElementById("notificationToast")
)

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  console.log("Aplicação iniciada")
  console.log("URL da API:", API_BASE_URL)

  // Verificar se a configuração da API é válida
  if (window.validateApiConfig && !window.validateApiConfig()) {
    showNotification(
      "⚠️ Configure a URL da API no arquivo config.js antes de usar!",
      "warning"
    )
    console.error(
      "URL da API não configurada! Edite o arquivo config.js com sua URL do MockAPI.io"
    )

    // Mostrar instruções na tela
    document.getElementById("usersTableContainer").style.display = "none"
    document.getElementById("loadingSpinner").style.display = "none"
    document.getElementById("noUsersMessage").innerHTML = `
            <i class="bi bi-exclamation-triangle text-warning" style="font-size: 4rem;"></i>
            <h4 class="text-warning mt-3">Configuração Necessária</h4>
            <p class="text-muted">Configure a URL da API no arquivo <code>config.js</code></p>
            <div class="alert alert-info mt-3">
                <h6>Instruções:</h6>
                <ol class="text-start">
                    <li>Acesse <a href="https://mockapi.io/" target="_blank">MockAPI.io</a></li>
                    <li>Crie uma conta e um novo projeto</li>
                    <li>Configure o endpoint <code>/users</code></li>
                    <li>Copie a URL gerada</li>
                    <li>Cole no arquivo <code>config.js</code></li>
                </ol>
            </div>
        `
    document.getElementById("noUsersMessage").style.display = "block"
    return
  }

  loadUsers()
  setupEventListeners()
})

// Setup event listeners
function setupEventListeners() {
  // Search functionality
  searchInput.addEventListener("input", debounce(filterUsers, 300))

  // Status filter
  statusFilter.addEventListener("change", filterUsers)

  // Form validation
  const userForm = document.getElementById("userForm")
  userForm.addEventListener("submit", function (e) {
    e.preventDefault()
    saveUser()
  })

  // Modal events
  document
    .getElementById("userModal")
    .addEventListener("hidden.bs.modal", function () {
      resetForm()
    })
}

// Debounce function for search
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// CRUD Operations

// CREATE & UPDATE - Save User (POST/PUT)
async function saveUser() {
  const form = document.getElementById("userForm")

  // Validate form
  if (!validateForm()) {
    return
  }

  const userData = {
    nome: document.getElementById("userName").value.trim(),
    email: document.getElementById("userEmail").value.trim(),
    cargo: document.getElementById("userCargo").value,
    status: document.getElementById("userStatus").value,
  }

  const saveBtn = document.getElementById("saveUserBtn")
  const originalText = saveBtn.innerHTML

  try {
    // Show loading state
    saveBtn.classList.add("btn-loading")
    saveBtn.disabled = true
    saveBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2"></span>Salvando...'

    let response
    let message

    if (currentEditingId) {
      // UPDATE (PUT)
      response = await fetch(`${API_BASE_URL}/${currentEditingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
      message = "Usuário atualizado com sucesso!"
    } else {
      // CREATE (POST)
      response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
      message = "Usuário criado com sucesso!"
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Success
    userModal.hide()
    await loadUsers()
    showNotification(message, "success")
  } catch (error) {
    console.error("Error saving user:", error)

    // Verificar tipo de erro para mensagem mais específica
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      showNotification(
        "Erro de conexão. Verifique sua internet e a configuração da API.",
        "error"
      )
    } else if (error.message.includes("400")) {
      showNotification(
        "Dados inválidos. Verifique os campos preenchidos.",
        "error"
      )
    } else if (error.message.includes("404")) {
      showNotification("API não encontrada. Verifique a URL da API.", "error")
    } else {
      showNotification(`Erro ao salvar usuário: ${error.message}`, "error")
    }
  } finally {
    // Reset button state
    saveBtn.classList.remove("btn-loading")
    saveBtn.disabled = false
    saveBtn.innerHTML = originalText
  }
}

// READ - Load Users (GET)
async function loadUsers() {
  try {
    showLoading(true)
    console.log("Carregando usuários da API:", API_BASE_URL)

    const response = await fetch(API_BASE_URL)
    console.log("Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error Response:", errorText)
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }

    allUsers = await response.json()
    console.log("Usuários carregados:", allUsers.length)
    displayUsers(allUsers)
    updateUserCount(allUsers.length)
  } catch (error) {
    console.error("Error loading users:", error)

    // Verificar se é erro de CORS ou rede
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      showNotification(
        "Erro de conexão. Verifique se a URL da API está correta e se há conexão com a internet.",
        "error"
      )
    } else {
      showNotification(`Erro ao carregar usuários: ${error.message}`, "error")
    }

    displayUsers([])
  } finally {
    showLoading(false)
  }
}

// DELETE - Delete User
async function deleteUser(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    deleteModal.hide()
    await loadUsers()
    showNotification("Usuário excluído com sucesso!", "success")
  } catch (error) {
    console.error("Error deleting user:", error)
    showNotification("Erro ao excluir usuário. Tente novamente.", "error")
  }
}

// Display Functions

// Display users in table
function displayUsers(users) {
  if (users.length === 0) {
    usersTableContainer.style.display = "none"
    noUsersMessage.style.display = "block"
    return
  }

  usersTableContainer.style.display = "block"
  noUsersMessage.style.display = "none"

  usersTableBody.innerHTML = users
    .map(
      (user) => `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar-circle bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px; font-weight: 600;">
                        ${getInitials(user.nome)}
                    </div>
                    <div>
                        <div class="fw-semibold">${escapeHtml(user.nome)}</div>
                    </div>
                </div>
            </td>
            <td>
                <span class="text-truncate-custom" title="${escapeHtml(
                  user.email
                )}">
                    ${escapeHtml(user.email)}
                </span>
            </td>
            <td>
                <span class="badge bg-light text-dark">
                    ${escapeHtml(user.cargo)}
                </span>
            </td>
            <td>
                <span class="status-badge status-${user.status}">
                    <i class="bi bi-${
                      user.status === "ativo" ? "check-circle" : "x-circle"
                    } me-1"></i>
                    ${
                      user.status.charAt(0).toUpperCase() + user.status.slice(1)
                    }
                </span>
            </td>
            <td>
                <small class="text-muted">
                    ${formatDate(user.createdAt)}
                </small>
            </td>
            <td class="text-center">
                <div class="action-buttons">
                    <button type="button" class="btn btn-action btn-edit me-1" 
                            onclick="openEditModal('${user.id}')" 
                            title="Editar usuário">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-action btn-delete" 
                            onclick="openDeleteModal('${
                              user.id
                            }', '${escapeHtml(user.nome)}')" 
                            title="Excluir usuário">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `
    )
    .join("")
}

// Filter users based on search and status
function filterUsers() {
  const searchTerm = searchInput.value.toLowerCase().trim()
  const statusValue = statusFilter.value

  let filteredUsers = allUsers

  // Filter by search term
  if (searchTerm) {
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.nome.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.cargo.toLowerCase().includes(searchTerm)
    )
  }

  // Filter by status
  if (statusValue) {
    filteredUsers = filteredUsers.filter((user) => user.status === statusValue)
  }

  displayUsers(filteredUsers)
  updateUserCount(filteredUsers.length, allUsers.length)
}

// Modal Functions

// Open modal for adding new user
function openAddModal() {
  currentEditingId = null
  resetForm()
  document.getElementById("userModalLabel").innerHTML =
    '<i class="bi bi-person-plus me-2"></i>Adicionar Usuário'
  document.getElementById("saveUserBtn").innerHTML =
    '<i class="bi bi-check-lg me-1"></i>Salvar Usuário'
  userModal.show()
}

// Open modal for editing user
async function openEditModal(userId) {
  try {
    const user = allUsers.find((u) => u.id === userId)
    if (!user) {
      showNotification("Usuário não encontrado.", "error")
      return
    }

    currentEditingId = userId

    // Populate form
    document.getElementById("userName").value = user.nome
    document.getElementById("userEmail").value = user.email
    document.getElementById("userCargo").value = user.cargo
    document.getElementById("userStatus").value = user.status

    // Update modal title
    document.getElementById("userModalLabel").innerHTML =
      '<i class="bi bi-pencil me-2"></i>Editar Usuário'
    document.getElementById("saveUserBtn").innerHTML =
      '<i class="bi bi-check-lg me-1"></i>Atualizar Usuário'

    userModal.show()
  } catch (error) {
    console.error("Error opening edit modal:", error)
    showNotification("Erro ao carregar dados do usuário.", "error")
  }
}

// Open delete confirmation modal
function openDeleteModal(userId, userName) {
  const confirmBtn = document.getElementById("confirmDeleteBtn")
  confirmBtn.onclick = () => deleteUser(userId)

  // Update modal content
  document.querySelector(
    "#deleteModal .modal-body p"
  ).textContent = `Tem certeza que deseja excluir o usuário "${userName}"?`

  deleteModal.show()
}

// Form Functions

// Validate form
function validateForm() {
  const form = document.getElementById("userForm")
  const inputs = form.querySelectorAll("input[required], select[required]")
  let isValid = true

  // Remove previous validation classes
  form.classList.remove("was-validated")

  inputs.forEach((input) => {
    input.classList.remove("is-valid", "is-invalid")

    if (!input.value.trim()) {
      input.classList.add("is-invalid")
      isValid = false
    } else if (input.type === "email" && !isValidEmail(input.value)) {
      input.classList.add("is-invalid")
      isValid = false
    } else {
      input.classList.add("is-valid")
    }
  })

  // Check for duplicate email (only for new users or different email)
  const email = document.getElementById("userEmail").value.trim()
  const existingUser = allUsers.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.id !== currentEditingId
  )

  if (existingUser) {
    document.getElementById("userEmail").classList.add("is-invalid")
    document.getElementById("userEmail").nextElementSibling.textContent =
      "Este email já está em uso."
    isValid = false
  }

  form.classList.add("was-validated")
  return isValid
}

// Reset form
function resetForm() {
  const form = document.getElementById("userForm")
  form.reset()
  form.classList.remove("was-validated")

  // Remove validation classes
  form.querySelectorAll(".form-control, .form-select").forEach((input) => {
    input.classList.remove("is-valid", "is-invalid")
  })

  // Reset error messages
  form.querySelectorAll(".invalid-feedback").forEach((feedback) => {
    feedback.textContent =
      feedback.getAttribute("data-default") || "Campo obrigatório."
  })

  currentEditingId = null
}

// Utility Functions

// Show/hide loading spinner
function showLoading(show) {
  if (show) {
    loadingSpinner.style.display = "block"
    usersTableContainer.style.display = "none"
    noUsersMessage.style.display = "none"
  } else {
    loadingSpinner.style.display = "none"
  }
}

// Update user count display
function updateUserCount(current, total = null) {
  if (total !== null && current !== total) {
    userCount.textContent = `${current} de ${total}`
    userCount.className = "badge bg-warning ms-2"
  } else {
    userCount.textContent = current
    userCount.className = "badge bg-primary ms-2"
  }
}

// Show notification toast
function showNotification(message, type = "success") {
  const toastIcon = document.getElementById("toastIcon")
  const toastTitle = document.getElementById("toastTitle")
  const toastMessage = document.getElementById("toastMessage")
  const toastElement = document.getElementById("notificationToast")

  // Configure toast based on type
  if (type === "success") {
    toastIcon.className = "bi bi-check-circle-fill text-success me-2"
    toastTitle.textContent = "Sucesso"
    toastElement.className = "toast border-success"
  } else if (type === "error") {
    toastIcon.className = "bi bi-exclamation-triangle-fill text-danger me-2"
    toastTitle.textContent = "Erro"
    toastElement.className = "toast border-danger"
  } else if (type === "warning") {
    toastIcon.className = "bi bi-exclamation-triangle-fill text-warning me-2"
    toastTitle.textContent = "Aviso"
    toastElement.className = "toast border-warning"
  }

  toastMessage.textContent = message
  notificationToast.show()
}

// Format date
function formatDate(timestamp) {
  if (!timestamp) return "N/A"

  const date = new Date(timestamp)
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Get user initials for avatar
function getInitials(name) {
  if (!name) return "?"

  const names = name.trim().split(" ")
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase()
  }

  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Error handling for network issues
window.addEventListener("online", function () {
  showNotification("Conexão restaurada. Recarregando dados...", "success")
  loadUsers()
})

window.addEventListener("offline", function () {
  showNotification(
    "Conexão perdida. Algumas funcionalidades podem não funcionar.",
    "warning"
  )
})

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  // Ctrl/Cmd + N = New user
  if ((e.ctrlKey || e.metaKey) && e.key === "n") {
    e.preventDefault()
    openAddModal()
  }

  // Escape = Close modals
  if (e.key === "Escape") {
    if (userModal._isShown) {
      userModal.hide()
    }
    if (deleteModal._isShown) {
      deleteModal.hide()
    }
  }
})

// Export functions for global access (if needed)
window.openAddModal = openAddModal
window.openEditModal = openEditModal
window.openDeleteModal = openDeleteModal
window.saveUser = saveUser
window.deleteUser = deleteUser
