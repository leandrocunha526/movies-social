FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta que a aplicação vai rodar
EXPOSE 3000
