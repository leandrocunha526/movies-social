# Movies API

Esta API oferece funcionalidades para gerenciar usuários, autenticação, filmes, reviews e outros recursos essenciais para o funcionamento do sistema. Aqui você encontra instruções para instalar, configurar e utilizar a API.

Outros recursos:

- Filtros por páginas, título, contagens (filmes e páginas para a paginação), front-end possui funções para extrair gênero e ano de lançamento para mais filtros
- Recomendações com collaborative filter
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

## Banco de dados

### User e Movie

A relação entre User e Movie é de um para muitos (1-n). Um User pode ter vários Movies, mas cada Movie pertence a apenas um User. Isso é representado pela chave estrangeira userId na tabela Movie.
Em Prisma, isso é indicado pela propriedade userId em Movie e a relação user em Movie, que referencia o User. O relacionamento é bidirecional, ou seja, pode acessar os filmes de um usuário através da propriedade movies no modelo User.

### User e Review

A relação entre User e Review também é de um para muitos (1-n). Cada User pode escrever várias Reviews, mas cada Review é feita por apenas um User. A chave estrangeira userId na tabela Review representa isso.
O relacionamento é bidirecional: pode acessar todas as resenhas feitas por um usuário através de Review[] no modelo User.

### Movie e Review

A relação entre Movie e Review é igualmente de um para muitos (1-n). Um Movie pode ter várias Reviews, mas cada Review pertence a apenas um Movie. Isso é indicado pela chave estrangeira movieId na tabela Review.
Da mesma forma, pode acessar todas as resenhas de um filme através da propriedade Review[] no modelo Movie.

As cardinalidades definidas são:

User - Movie: Um para Muitos (1-n)   
User - Review: Um para Muitos (1-n)   
Movie - Review: Um para Muitos (1-n)   

Essas relações são bem definidas nas chaves estrangeiras (como userId e movieId) e nas propriedades de relação no modelo Prisma.

Veja prisma/schema.prisma

## Instalação

### Instalar dependências

```bash
yarn
```

### Execution

```bash
yarn run dev
```

### Prisma generate e migrations

```bash
yarn run generate
```

```bash
yarn run migrate
```

O ORM utilizado é o Prisma, acesse o link para obter acesso à documentação. Veja [What is Prisma ORM?](https://www.prisma.io/docs/orm/overview/introduction/what-is-prisma).

## Docker

`docker compose -f docker-compose.yml up`

Executará migrate, generate e o servidor em seguida.
