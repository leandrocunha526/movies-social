# React + TypeScript + Vite

Esta aplicação oferece funcionalidades para gerenciar usuários, autenticação, filmes, reviews e outros recursos essenciais para o funcionamento do sistema.

Outros recursos integrados com back-end:

- Filtros por páginas, título, contagens (filmes e páginas para a paginação), front-end possui funções para extrair gênero e ano de lançamento para mais filtros
- Recomendações com collaborative filter: O método que compara suas avaliações de filmes com as de outros usuários para encontrar pessoas com gostos semelhantes. Aqui está um resumo: Usuários Similares: O sistema identifica pessoas que assistiram e avaliaram filmes de maneira parecida com a sua. Filmes Sugeridos: As recomendações são filmes que esses usuários gostaram muito (avaliações ≥ 4) e que você ainda não viu.
- CRUDs
- Upload de arquivos com Morgan
- Segurança: Nenhum usuário consegue mexer em registros de outro usuário
- Autenticação de usuário e perfil
- CORS
- Services de usuários (autenticação e gerenciamento)
- Registros de reviews, users e filmes/séries
- Formatação e lint de código (Eslint e Prettier)
- Typescript como linguagem padrão e types definidos (programação)
- Uso de banco de dados relacionais
- Uso do conceito de componetização com componentes pais e filhos com suas interações
- React Hooks
- CSS in JS (Style Components) para componentes estilizados
- Modo escuro ou claro no perfil

## Execução

```bash
yarn run dev
```

## Docs

[React Docs](https://react.dev)
