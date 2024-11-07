import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import ReviewList from "../../components/ReviewList";
import ReviewModal from "../../components/ReviewModal";
import { Review } from "../../types/interfaces/Review";

const MovieDetailsContainer = styled.div`
  padding: 20px;
  background-color: #18181b;
  color: #fff;
  max-width: 800px;
  margin: 40px auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
`;

const MovieTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #e2e2e2;
`;

const MovieInfo = styled.p`
  font-size: 1rem;
  margin: 5px 0;
  line-height: 1.5;
`;

const Button = styled.button`
  padding: 10px 16px;
  font-size: 1rem;
  color: #fff;
  background-color: #6366f1;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #4f46e5;
  }
`;

const BackButton = styled(Button)`
  background-color: #4b5563;
  margin-right: 8px;

  &:hover {
    background-color: #374151;
  }
`;

interface Movie {
    id: number;
    title: string;
    description: string;
    genre: string;
    releaseYear: number;
    duration: number;
    user: {
        id: number;
        name: string;
    }
}

const MovieDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await api.get(`/movie/${id}`);
                setMovie(response.data);
            } catch (error) {
                console.error("Erro ao buscar detalhes do filme:", error);
            }
        };
        fetchMovie();
        fetchReviews();
    }, [id]);

    const fetchReviews = async () => {
        try {
            const response = await api.get(`/movie/${id}/reviews`);
            setReviews(response.data);
        } catch (error) {
            console.error("Erro ao buscar reviews:", error);
        }
    };

    const handleDeleteReview = (reviewId: number) => {
        setReviews((prevReviews) =>
            prevReviews.filter((review) => review.id !== reviewId)
        );
    }

    return (
        <MovieDetailsContainer>
            {movie && (
                <>
                    <MovieTitle>{movie.title}</MovieTitle>
                    <MovieInfo><strong>Descrição:</strong> {movie.description}</MovieInfo>
                    <MovieInfo><strong>Gênero:</strong> {movie.genre}</MovieInfo>
                    <MovieInfo><strong>Ano de Lançamento:</strong> {movie.releaseYear}</MovieInfo>
                    <MovieInfo><strong>Duração:</strong> {movie.duration} min</MovieInfo>
                    <MovieInfo><strong>Adicionado por:</strong> {movie.user.name}</MovieInfo>
                    <div style={{ marginTop: "20px" }}>
                        <BackButton onClick={() => navigate(-1)}>Voltar</BackButton>
                        <Button onClick={() => setShowModal(true)}>Adicionar Review</Button>
                    </div>

                    <ReviewList
                        movieId={movie.id}
                        reviews={reviews}
                        onEditReview={(review: Review) => {
                            setReviewToEdit(review);
                            setShowModal(true);
                        }}
                        onDeleteReview={handleDeleteReview}
                    />

                    {showModal && (
                        <ReviewModal
                            movieId={movie.id}
                            review={reviewToEdit || undefined}
                            onClose={() => {
                                setShowModal(false);
                                setReviewToEdit(null);
                            }}
                            onSave={() => {
                                fetchReviews(); // Recarrega as reviews ao salvar
                                setShowModal(false); // Fecha o modal
                                setReviewToEdit(null); // Limpa o review em edição
                            }}
                        />
                    )}
                </>
            )}
        </MovieDetailsContainer>
    );
};

export default MovieDetails;
