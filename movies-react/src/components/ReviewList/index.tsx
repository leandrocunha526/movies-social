import { Review } from "../../types/interfaces/Review";
import styled from "styled-components";
import { toast } from "react-toastify";
import { api } from "../../services/api";
import { FaStar, FaRegStar } from "react-icons/fa";

interface ReviewListProps {
  movieId: number;
  reviews: Review[];
  onEditReview: (review: Review) => void;
  onDeleteReview: (reviewId: number) => void; // Função para deletar review
}

const Container = styled.div`
  background-color: #2c2c33;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  color: #fff;
`;

const ReviewItem = styled.div`
  background-color: #333;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ReviewUser = styled.h3`
  font-size: 1.1em;
  font-weight: bold;
  color: #4caf50;
`;

const ReviewRating = styled.p`
  font-size: 1em;
  color: #ffeb3b;
  font-weight: bold;
`;

const ReviewComment = styled.p`
  font-size: 1em;
  color: #ccc;
  margin: 10px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  font-size: 0.9em;

  &:hover {
    transform: scale(1.05);
  }

  &.edit {
    background-color: #2196f3;
    color: #fff;

    &:hover {
      background-color: #1976d2;
    }
  }

  &.delete {
    background-color: #f44336;
    color: #fff;

    &:hover {
      background-color: #d32f2f;
    }
  }
`;

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  onEditReview,
  onDeleteReview,
}) => {
  const handleDeleteReview = (reviewId: number) => {
    onDeleteReview(reviewId);
    try {
      api.delete(`/movie/reviews/${reviewId}`);
      toast.success("Deletado com sucesso.");
    } catch (error) {
      console.error("Erro ao deletar review:", error);
      toast.error("Ocorreu ao deletar review");
    }
  };

  const renderStars = (rating: number) => {
    const filledStars = Array(rating).fill(<FaStar />);
    const emptyStars = Array(5 - rating).fill(<FaRegStar />);
    return [...filledStars, ...emptyStars];
  };

  return (
    <Container>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewItem key={review.id}>
            <ReviewHeader>
              <ReviewUser>{review.user.name}</ReviewUser>
              <ReviewRating>
                {renderStars(review.rating)}
              </ReviewRating>
            </ReviewHeader>
            <ReviewComment>{review.comment}</ReviewComment>
            <ButtonContainer>
              <Button className="edit" onClick={() => onEditReview(review)}>
                Editar
              </Button>
              <Button
                className="delete"
                onClick={() => handleDeleteReview(review.id)}
              >
                Excluir
              </Button>
            </ButtonContainer>
          </ReviewItem>
        ))
      ) : (
        <p>Nenhum review encontrado.</p>
      )}
    </Container>
  );
};

export default ReviewList;
