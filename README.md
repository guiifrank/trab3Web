# Painel de Gerenciamento de Usuários

Um sistema web completo para administração de perfis de usuários, desenvolvido com HTML5, CSS3, JavaScript ES6+ e Bootstrap 5.

## 🎯 Objetivo

Simular o funcionamento de um painel administrativo real, fornecendo uma interface amigável e responsiva que utiliza requisições AJAX para se comunicar com uma API REST simulada.

## ✨ Funcionalidades

### CRUD Completo

- **CREATE (POST)**: Adicionar novos usuários
- **READ (GET)**: Visualizar lista de usuários
- **UPDATE (PUT)**: Editar informações de usuários existentes
- **DELETE**: Excluir usuários com confirmação

### Recursos Adicionais

- 🔍 **Busca em tempo real** por nome, email ou cargo
- 🏷️ **Filtros por status** (ativo/inativo)
- 📱 **Interface responsiva** com Bootstrap 5
- ✅ **Validação de formulários** em tempo real
- 🔔 **Notificações toast** para feedback
- ⌨️ **Atalhos de teclado** (Ctrl+N para novo usuário)
- 🌐 **Detecção de status de conexão**
- 🎨 **Animações suaves** e transições

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilização avançada com variáveis CSS
- **Bootstrap 5**: Framework CSS responsivo
- **JavaScript ES6+**: Funcionalidades modernas
- **MockAPI.io**: Simulação de API REST
- **Bootstrap Icons**: Ícones vetoriais

## 📋 Schema da API

```json
{
  "id": "string (auto gerado)",
  "createdAt": "timestamp (auto gerado)",
  "nome": "string",
  "email": "string",
  "cargo": "string",
  "status": "string (ativo|inativo)"
}
```

### Exemplo de Objeto JSON

```json
{
  "id": "1",
  "createdAt": 1678890000,
  "nome": "Ana Souza",
  "email": "ana.souza@email.com",
  "cargo": "Gerente de Projetos",
  "status": "ativo"
}
```

## 🚀 Configuração do MockAPI

### Passo 1: Criar Conta no MockAPI.io

1. Acesse [MockAPI.io](https://mockapi.io/)
2. Crie uma conta gratuita
3. Clique em "Create New Project"

### Passo 2: Configurar o Projeto

1. **Nome do Projeto**: `user-management-panel`
2. **Endpoint**: `/users`

### Passo 3: Definir o Schema

Configure os seguintes campos:

| Campo       | Tipo   | Configuração                |
| ----------- | ------ | --------------------------- |
| `id`        | ID     | Auto increment              |
| `createdAt` | Date   | Auto generate               |
| `nome`      | String | Faker: `{{name.fullName}}`  |
| `email`     | String | Faker: `{{internet.email}}` |
| `cargo`     | String | Custom values\*             |
| `status`    | String | Values: `ativo`, `inativo`  |

\*Valores customizados para cargo:

- Gerente de Projetos
- Desenvolvedor Frontend
- Desenvolvedor Backend
- Designer UX/UI
- Analista de Sistemas
- DevOps Engineer
- Product Owner
- Scrum Master
- Analista de QA
- Administrador de Sistemas

### Passo 4: Gerar Dados de Teste

1. Clique em "Generate Data"
2. Gere entre 10-20 registros para teste
3. Copie a URL da API gerada

### Passo 5: Configurar a Aplicação

1. Abra o arquivo `config.js`
2. Substitua a URL na propriedade `BASE_URL`:

```javascript
const API_CONFIG = {
  BASE_URL: "https://SEU-ID-AQUI.mockapi.io/api/v1/users",
  // ... outras configurações
}
```

### Passo 6: Testar a Configuração

1. Abra o arquivo `test-api.html` no navegador
2. Cole sua URL da API no campo
3. Clique em "Testar Conexão" para verificar se está funcionando
4. Se der erro, verifique a URL e as configurações do MockAPI

## 📁 Estrutura do Projeto

```
trab3Web/
├── index.html          # Estrutura principal da aplicação
├── style.css           # Estilos customizados
├── script.js           # Lógica da aplicação
├── config.js           # Configuração da API
├── test-api.html       # Página para testar a API
└── README.md           # Documentação
```

## 🎮 Como Usar

### Executar a Aplicação

1. Configure o MockAPI conforme instruções acima
2. **IMPORTANTE**: Teste a API primeiro abrindo `test-api.html`
3. Abra `index.html` em um navegador web
4. A aplicação carregará automaticamente os usuários

> 💡 **Dica**: Se houver erros, sempre teste primeiro com `test-api.html` para verificar se a API está configurada corretamente.

### Funcionalidades Principais

#### Adicionar Usuário

- Clique no botão "Adicionar Usuário"
- Preencha todos os campos obrigatórios
- Clique em "Salvar Usuário"

#### Editar Usuário

- Clique no ícone de lápis na linha do usuário
- Modifique os campos desejados
- Clique em "Atualizar Usuário"

#### Excluir Usuário

- Clique no ícone de lixeira na linha do usuário
- Confirme a exclusão no modal

#### Buscar/Filtrar

- Use a barra de pesquisa para buscar por nome, email ou cargo
- Use o filtro de status para mostrar apenas usuários ativos ou inativos

### Atalhos de Teclado

- `Ctrl + N`: Abrir modal de novo usuário
- `Escape`: Fechar modais abertos

## 🎨 Características da Interface

### Design Responsivo

- Layout adaptável para desktop, tablet e mobile
- Tabela responsiva com scroll horizontal em telas pequenas
- Botões de ação empilhados em dispositivos móveis

### Feedback Visual

- Animações suaves para transições
- Estados de loading para operações assíncronas
- Validação visual em tempo real nos formulários
- Notificações toast para confirmações e erros

### Acessibilidade

- Estrutura semântica HTML5
- Labels apropriados para formulários
- Contraste adequado de cores
- Suporte a navegação por teclado

## 🔧 Personalização

### Modificar Cargos Disponíveis

Edite o array de opções no `index.html` (linhas 89-98):

```html
<option value="Seu Cargo Personalizado">Seu Cargo Personalizado</option>
```

### Alterar Cores do Tema

Modifique as variáveis CSS no `style.css` (linhas 3-12):

```css
:root {
  --primary-color: #0d6efd;
  --success-color: #198754;
  /* ... outras cores */
}
```

### Adicionar Novos Campos

1. Adicione o campo no schema do MockAPI
2. Inclua o input no modal HTML
3. Atualize as funções JavaScript correspondentes

## 🐛 Solução de Problemas

### ⚠️ Erro: "Configure a URL da API"

**Problema**: A aplicação mostra uma mensagem pedindo para configurar a API.

**Solução**:

1. Abra o arquivo `config.js`
2. Substitua a URL placeholder pela sua URL do MockAPI
3. Recarregue a página

### 🌐 Erro de CORS ou Conexão

**Problema**: Erro de rede ou CORS ao carregar/salvar dados.

**Solução**:

1. Use o arquivo `test-api.html` para testar a conectividade
2. Verifique se a URL do MockAPI está correta
3. Confirme se o projeto no MockAPI está ativo e público
4. Teste a URL diretamente no navegador

### 📊 Dados não Carregam

**Problema**: A tabela fica vazia ou mostra erro de carregamento.

**Solução**:

1. Abra o Console do navegador (F12)
2. Verifique se há erros de JavaScript
3. Teste com `test-api.html`
4. Verifique se há usuários cadastrados no MockAPI
5. Confirme se o schema da API está correto

### 💾 Erro ao Salvar Usuários

**Problema**: Formulário não salva ou retorna erro.

**Solução**:

1. Verifique se todos os campos obrigatórios estão preenchidos
2. Confirme se o schema no MockAPI está correto
3. Teste a criação manual no `test-api.html`
4. Verifique o Console para erros específicos

### 🔧 Problemas de Validação

**Problema**: Validação de formulário não funciona.

**Solução**:

1. Verifique se o Bootstrap JS está carregando
2. Confirme se não há erros de JavaScript no Console
3. Teste em um navegador diferente

### 📱 Problemas de Responsividade

**Problema**: Layout quebrado em dispositivos móveis.

**Solução**:

1. Verifique se o Bootstrap CSS está carregando
2. Confirme se a meta tag viewport está presente
3. Teste em diferentes tamanhos de tela

### 🚀 Dicas de Debug

1. **Sempre use o Console**: Abra F12 e veja a aba Console
2. **Teste a API separadamente**: Use `test-api.html` primeiro
3. **Verifique a rede**: Aba Network no DevTools mostra requisições
4. **Valide o JSON**: Use ferramentas online para validar respostas da API

## 📚 Conceitos Demonstrados

- **Manipulação do DOM**: Criação dinâmica de elementos
- **Requisições AJAX**: Fetch API para comunicação com REST API
- **Programação Assíncrona**: Async/await para operações não-bloqueantes
- **Validação de Formulários**: Validação client-side em tempo real
- **Responsividade**: Design adaptável com Bootstrap
- **UX/UI**: Interface intuitiva com feedback visual
- **Modularização**: Código organizado em funções específicas
- **Tratamento de Erros**: Handling de erros de rede e validação

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte de um trabalho acadêmico sobre desenvolvimento web front-end.

---

**Desenvolvido com ❤️ para aprendizado de tecnologias web modernas**
