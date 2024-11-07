import { Request, Response } from "express";
import prisma from "../config/prisma";
import upload from "../config/multer";

// Middleware para upload do arquivo (uma imagem de capa)
export const uploadCoverImage = upload.single('coverImageUrl');

// Função que cria o filme no banco de dados
export const createMovie = async (req: Request, res: Response): Promise<any> => {
    const { title, description, genre, releaseYear, duration } = req.body;
    const coverImageUrl = req.file ? `http://localhost:3000/movie/uploads/${req.file.filename}` : '';

    // Validação dos dados
    if (!title || !description || !genre || !releaseYear || !duration) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Garantir que releaseYear e duration sejam números inteiros
    const year = parseInt(releaseYear, 10);
    const durationInt = parseInt(duration, 10);

    if (isNaN(year) || isNaN(durationInt)) {
        return res.status(400).json({ error: "Release year and duration must be valid numbers" });
    }

    try {
        const movie = await prisma.movie.create({
            data: {
                title,
                description,
                genre,
                releaseYear: year,
                duration: durationInt,
                coverImageUrl, // A URL da imagem
                userId: req.userId
            }
        });
        res.status(201).json({ id: movie.id, title: movie.title });
    } catch (error) {
        console.error("Error creating movie:", error); // Log do erro
        res.status(500).json({ error: "Failed to create movie", details: error });
    }
};

export const updateMovie = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { title, description, genre, releaseYear, duration } = req.body;
    const coverImageUrl = req.file ? `http://localhost:3000/movie/uploads/${req.file.filename}` : '';

    const movieId = parseInt(id, 10);
    if (isNaN(movieId)) {
        return res.status(400).json({ error: "Invalid movie ID" });
    }

    // Verifique se o filme existe e se pertence ao usuário
    const movie = await prisma.movie.findUnique({ where: { id: movieId } });
    if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
    }

    if (movie.userId !== req.userId) {
        return res.status(403).json({ error: "You do not have permission to edit this movie" });
    }

    let year: number | undefined;
    let durationInt: number | undefined;

    if (releaseYear) {
        year = parseInt(releaseYear, 10);
        if (isNaN(year)) {
            return res.status(400).json({ error: "Release year must be a valid number" });
        }
    }

    if (duration) {
        durationInt = parseInt(duration, 10);
        if (isNaN(durationInt)) {
            return res.status(400).json({ error: "Duration must be a valid number" });
        }
    }

    try {
        const updatedMovie = await prisma.movie.update({
            where: { id: movieId },
            data: {
                ...(title && { title }),
                ...(description && { description }),
                ...(genre && { genre }),
                ...(year !== undefined && { releaseYear: year }),
                ...(durationInt !== undefined && { duration: durationInt }),
                ...(coverImageUrl && { coverImageUrl }),
            },
        });
        res.status(200).json({ id: updatedMovie.id, title: updatedMovie.title });
    } catch (error) {
        console.error("Error updating movie:", error);
        res.status(500).json({ error: "Failed to update movie", details: error });
    }
};

// Lista de filmes com paginação, contagem de avaliações e busca
export const listMovies = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query.perPage as string) || 10;
        const offset = (page - 1) * perPage;

        // Obtém o parâmetro de busca da query
        const search = req.query.search as string || '';

        // Modifica a consulta para incluir a busca pelo título
        const movies = await prisma.movie.findMany({
            where: {
                title: {
                    contains: search, // Busca pelo título do filme
                    mode: 'insensitive', // Ignora maiúsculas e minúsculas
                },
            },
            skip: offset,
            take: perPage,
            include: {
                Review: {
                    select: { id: true }, // Inclui apenas o ID das avaliações para contagem
                },
            },
        });

        const totalMovies = await prisma.movie.count({
            where: {
                title: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
        });

        // Mapeia os filmes para incluir a contagem de avaliações
        const moviesWithReviewCount = movies.map(movie => ({
            ...movie,
            reviewCount: movie.Review.length,
        }));

        res.status(200).json({
            movies: moviesWithReviewCount,
            totalMovies,
            totalPages: Math.ceil(totalMovies / perPage),
            currentPage: page,
        });
    } catch (error) {
        console.error("Erro ao listar filmes:", error);
        res.status(500).json({ error: "Erro ao listar filmes", details: error });
    }
};

// Excluir filme
export const deleteMovie = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const userId = req.userId; // Supondo que o ID do usuário esteja armazenado no objeto `user` após a autenticação.

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        // Verifique se o filme pertence ao usuário autenticado
        const movie = await prisma.movie.findUnique({
            where: { id: Number(id) },
        });

        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        if (movie.userId !== userId) {
            return res.status(403).json({ error: "You do not have permission to delete this movie" });
        }

        // Se o filme pertence ao usuário, exclua-o
        await prisma.movie.delete({
            where: { id: Number(id) },
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete movie", details: error });
    }
};

// Criar avaliação
export const createReview = async (req: Request, res: Response): Promise<any> => {
    const { rating, comment } = req.body;
    const { movieId } = req.params;

    // Validação dos dados
    if (!movieId || rating === undefined) {
        return res.status(400).json({ error: "Movie ID and rating are required" });
    }

    try {
        const review = await prisma.review.create({
            data: {
                movieId: Number(movieId), // Converte para número se necessário
                userId: req.userId, // Assegure-se que req.userId está definido pelo authMiddleware
                rating,
                comment,
            },
        });
        res.status(201).json({ id: review.id, rating: review.rating });
    } catch (error) {
        res.status(500).json({ error: "Failed to create review", details: error });
    }
};

// Listar avaliações
export const listReviews = async (req: Request, res: Response) => {
    const { movieId } = req.params;

    try {
        const reviews = await prisma.review.findMany({
            where: { movieId: Number(movieId) },
            include: {
                user: {
                    select: { id: true, name: true },
                },
            },
        });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reviews", details: error });
    }
};

// Atualizar avaliação
export const updateReview = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { rating, comment } = req.body;

    try {
        // Verifique se a avaliação pertence ao usuário autenticado
        const review = await prisma.review.findUnique({
            where: { id: Number(id) },
        });

        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        if (review.userId !== req.userId) {
            return res.status(403).json({ error: "You do not have permission to edit this review" });
        }

        const updatedReview = await prisma.review.update({
            where: { id: Number(id) },
            data: { rating, comment },
        });
        res.status(200).json({ id: updatedReview.id, rating: updatedReview.rating });
    } catch (error) {
        res.status(500).json({ error: "Failed to update review", details: error });
    }
};

// Excluir avaliação
export const deleteReview = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
        // Verifique se a avaliação pertence ao usuário autenticado
        const review = await prisma.review.findUnique({
            where: { id: Number(id) },
        });

        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        if (review.userId !== req.userId) {
            return res.status(403).json({ error: "You do not have permission to delete this review" });
        }

        await prisma.review.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete review", details: error });
    }
};

export const getMovieDetails = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
        const movie = await prisma.movie.findUnique({
            where: { id: Number(id) },
            include: {
                user: {
                    select: { id: true, name: true }, // Informação do usuário que adicionou o filme
                },
                Review: {
                    include: {
                        user: {
                            select: { id: true, name: true }, // Informação do usuário que fez a avaliação
                        },
                    },
                },
            },
        });

        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        // Adicionar contagem de avaliações e média de notas (opcional)
        const reviewCount = movie.Review.length;
        const averageRating = reviewCount
            ? movie.Review.reduce((acc, review) => acc + review.rating, 0) / reviewCount
            : null;

        res.status(200).json({
            ...movie,
            reviewCount,
            averageRating,
        });
    } catch (error) {
        console.error("Error fetching movie details:", error);
        res.status(500).json({ error: "Failed to fetch movie details", details: error });
    }
};

export const recommendMovies = async (req: Request, res: Response): Promise<any> => {
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        // Obter avaliações do usuário atual
        const userReviews = await prisma.review.findMany({
            where: { userId },
            select: { movieId: true },
        });

        // Obter IDs de filmes já avaliados pelo usuário
        const ratedMovieIds = userReviews.map((review) => review.movieId);

        // Encontrar usuários que avaliaram os mesmos filmes (sem SQL bruto)
        const similarUsers = await prisma.review.findMany({
            where: {
                movieId: { in: ratedMovieIds },
                userId: { not: userId },
            },
            select: { userId: true },
            distinct: ["userId"], // Garantir que não haja usuários duplicados
        });

        // Coletar IDs de usuários semelhantes
        const similarUserIds = similarUsers.map((user) => user.userId);

        // Buscar filmes bem avaliados por esses usuários
        const recommendedMovies = await prisma.movie.findMany({
            where: {
                id: { notIn: ratedMovieIds }, // Excluir filmes já avaliados
                Review: {
                    some: {
                        userId: { in: similarUserIds },
                        rating: { gte: 4 }, // Considerar avaliações de 4 ou 5 estrelas
                    },
                },
            },
            take: 10, // Limitar o número de recomendações
        });

        res.status(200).json({ recommendedMovies });
    } catch (error) {
        console.error("Error generating recommendations:", error);
        res.status(500).json({ error: "Failed to generate recommendations", details: error });
    }
};
