# 🛍️ Catálogo Mobile - E-commerce App

Aplicativo mobile de catálogo de produtos desenvolvido como requisito acadêmico. O projeto apresenta um fluxo completo de navegação, autenticação simulada e consumo de API REST para listagem e detalhamento de produtos divididos por categorias (Masculino e Feminino).

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando as seguintes ferramentas e bibliotecas:

*   **[React Native](https://reactnative.dev/):** Biblioteca principal para construção da interface móvel.
*   **[Expo](https://expo.dev/):** Plataforma e framework para facilitar o desenvolvimento, teste e build do app.
*   **[React Navigation](https://reactnavigation.org/):** Gerenciamento de rotas (Stack Navigation para fluxo de login/detalhes e Bottom Tabs para categorias principais).
*   **[Redux Toolkit](https://redux-toolkit.js.org/):** Gerenciamento de estado global da aplicação (Autenticação de usuários e armazenamento dos produtos).
*   **[Axios](https://axios-http.com/):** Cliente HTTP para consumo da API externa.
*   **[DummyJSON API](https://dummyjson.com/):** API REST utilizada para fornecer os dados reais dos produtos.

---

## ✨ Funcionalidades

*   **Autenticação:** Fluxo de Login e Cadastro com validação de campos.
*   **Estado Global:** Utilização do Redux para manter a sessão do usuário ativa e gerenciar a lista de produtos, evitando requisições desnecessárias.
*   **Listagem Dinâmica:** Produtos separados em abas (Masculino e Feminino) utilizando Bottom Tabs nativas.
*   **Filtros Customizados:** Subcategorias roláveis (Todos, Roupas, Sapatos, Acessórios) para refinar a busca localmente.
*   **Detalhes do Produto:** Tela dedicada exibindo imagem em destaque, descrição completa, preço original (riscado) e cálculo automático do valor final com desconto.
*   **Logout:** Botão de saída acessível globalmente pelo cabeçalho (Header).

---

### Dados para Teste Rápido

E-mail: teste@teste.com
Senha: 123456