import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Usuários - criação individual para garantir que IDs estejam disponíveis
    const alice = await prisma.user.create({
        data: { name: 'Alice', email: 'alice@example.com', password: 'senha123' },
    });
    const bob = await prisma.user.create({
        data: { name: 'Bob', email: 'bob@example.com', password: 'senha123' },
    });
    const charlie = await prisma.user.create({
        data: {
            name: 'Charlie',
            email: 'charlie@example.com',
            password: 'senha123',
        },
    });
    const leandro = await prisma.user.create({
        data: {
            name: 'Leandro Cunha',
            email: 'leandrocunha@email.com',
            password: 'admin12345',
        },
    });

    // Filmes - criação individual para capturar IDs dos filmes
    const movieA = await prisma.movie.create({
        data: {
            title: 'Filme A',
            description: 'Ação e aventura',
            genre: 'Ação',
            releaseYear: 2020,
            duration: 120,
            userId: alice.id,
        },
    });
    const movieB = await prisma.movie.create({
        data: {
            title: 'Filme B',
            description: 'Drama profundo',
            genre: 'Drama',
            releaseYear: 2019,
            duration: 90,
            userId: bob.id,
        },
    });
    const movieC = await prisma.movie.create({
        data: {
            title: 'Filme C',
            description: 'Comédia leve',
            genre: 'Comédia',
            releaseYear: 2021,
            duration: 110,
            userId: charlie.id,
        },
    });
    const movieD = await prisma.movie.create({
        data: {
            title: 'Filme D',
            description: 'Romance emocionante',
            genre: 'Romance',
            releaseYear: 2018,
            duration: 105,
            userId: leandro.id,
        },
    });
    const movieE = await prisma.movie.create({
        data: {
            title: 'Filme E',
            description: 'Suspense intrigante',
            genre: 'Suspense',
            releaseYear: 2022,
            duration: 130,
            userId: alice.id,
        },
    });

    // Avaliações - mais avaliações para simular preferências diversas
    await prisma.review.createMany({
        data: [
            // Avaliações do Alice
            {
                movieId: movieA.id,
                userId: alice.id,
                rating: 5,
                comment: 'Amei a ação!',
            },
            {
                movieId: movieB.id,
                userId: alice.id,
                rating: 3,
                comment: 'Foi bom, mas triste.',
            },
            {
                movieId: movieC.id,
                userId: alice.id,
                rating: 4,
                comment: 'Engraçado e leve.',
            },
            {
                movieId: movieD.id,
                userId: alice.id,
                rating: 2,
                comment: 'Muito meloso para mim.',
            },
            {
                movieId: movieE.id,
                userId: alice.id,
                rating: 5,
                comment: 'Suspense de tirar o fôlego!',
            },

            // Avaliações do Bob
            { movieId: movieA.id, userId: bob.id, rating: 4, comment: 'Ação legal!' },
            {
                movieId: movieB.id,
                userId: bob.id,
                rating: 5,
                comment: 'Drama intenso, muito bom.',
            },
            {
                movieId: movieC.id,
                userId: bob.id,
                rating: 3,
                comment: 'Divertido, mas um pouco bobo.',
            },
            {
                movieId: movieD.id,
                userId: bob.id,
                rating: 5,
                comment: 'Adorei o romance!',
            },
            {
                movieId: movieE.id,
                userId: bob.id,
                rating: 2,
                comment: 'Suspense previsível.',
            },

            // Avaliações do Charlie
            {
                movieId: movieA.id,
                userId: charlie.id,
                rating: 3,
                comment: 'Ação boa, mas poderia ser melhor.',
            },
            {
                movieId: movieB.id,
                userId: charlie.id,
                rating: 4,
                comment: 'Gostei do drama.',
            },
            {
                movieId: movieC.id,
                userId: charlie.id,
                rating: 5,
                comment: 'Hilário!',
            },
            {
                movieId: movieD.id,
                userId: charlie.id,
                rating: 2,
                comment: 'Romance chato.',
            },
            {
                movieId: movieE.id,
                userId: charlie.id,
                rating: 3,
                comment: 'Bom suspense.',
            },

            // Avaliações do Leandro
            {
                movieId: movieA.id,
                userId: leandro.id,
                rating: 4,
                comment: 'Boa ação!',
            },
            {
                movieId: movieB.id,
                userId: leandro.id,
                rating: 3,
                comment: 'Drama ok.',
            },
            {
                movieId: movieC.id,
                userId: leandro.id,
                rating: 2,
                comment: 'Não achei tão engraçado.',
            },
            {
                movieId: movieD.id,
                userId: leandro.id,
                rating: 5,
                comment: 'Romance incrível!',
            },
            {
                movieId: movieE.id,
                userId: leandro.id,
                rating: 4,
                comment: 'Bom suspense.',
            },
        ],
    });

    console.log(
        'Dados de exemplo para collaborative filtering adicionados com sucesso.'
    );
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
