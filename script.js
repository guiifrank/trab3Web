const API = "https://691cf7eed58e64bf0d349106.mockapi.io/api/v1/user_manager/users";

// Carregar e criar cards
async function loadUsers() {
    const res = await fetch(API);
    const users = await res.json();

    const list = document.getElementById("userList");
    list.innerHTML = "";

    users.forEach(user => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <strong>${user.name}</strong>
            <small>Idade: ${user.age}</small>
            <small>Email: ${user.email}</small>
            <small>Endereço: ${user.address}</small>
            <small>Telefone: ${user.cell_number}</small>

            <div class="card-buttons">
                <button class="edit" onclick='editUser(${JSON.stringify(user)})'>Editar</button>
                <button class="delete" onclick="deleteUser('${user.id}')">Excluir</button>
            </div>
        `;

        list.appendChild(card);
    });
}

// Salvar (Adicionar ou Editar)
async function saveUser() {
    const id = document.getElementById("userId").value;

    const userData = {
        name: document.getElementById("userName").value,
        age: document.getElementById("userAge").value,
        email: document.getElementById("userEmail").value,
        address: document.getElementById("userAddress").value,
        cell_number: document.getElementById("userCell").value
    };

    if (!userData.name || !userData.age || !userData.email || !userData.address || !userData.cell_number) {
        alert("Favor preencha todos os dados.");
        return;
    }

    if (id) {
        // EDITAR (PUT)
        await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });
    } else {
        // ADICIONAR (POST)
        await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });
    }

    clearForm();
    loadUsers();

    alert("Usuário cadastrado com sucesso.");
}

// Preencher campos para editar
function editUser(user) {
    document.getElementById("userId").value = user.id;
    document.getElementById("userName").value = user.name;
    document.getElementById("userAge").value = user.age;
    document.getElementById("userEmail").value = user.email;
    document.getElementById("userAddress").value = user.address;
    document.getElementById("userCell").value = user.cell_number;
}

// Excluir usuário
async function deleteUser(id) {
    if (!confirm("Deseja realmente excluir este usuário?")) return;

    await fetch(`${API}/${id}`, {
        method: "DELETE"
    });

    loadUsers();
}

// Limpar campos
function clearForm() {
    document.getElementById("userId").value = "";
    document.getElementById("userName").value = "";
    document.getElementById("userAge").value = "";
    document.getElementById("userEmail").value = "";
    document.getElementById("userAddress").value = "";
    document.getElementById("userCell").value = "";
}

// Inicializar
loadUsers();
