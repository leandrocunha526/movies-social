import { useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { Review } from "../../types/interfaces/Review";
import { toast } from "react-toastify";

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
`;

const ModalContent = styled.div`
  padding: 20px;
  background: #18181b;
  color: #fff;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  position: relative;
`;

const ModalTitle = styled.h3`
  margin-bottom: 20px;
  color: #fff;
  font-size: 1.2em;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-size: 0.9em;
  color: #ddd;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  background: #2c2c33;
  border: 1px solid #444;
  border-radius: 5px;
  color: #fff;
  font-size: 1em;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  background: #2c2c33;
  border: 1px solid #444;
  border-radius: 5px;
  color: #fff;
  font-size: 1em;
  resize: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const SaveButton = styled.button`
  padding: 10px 15px;
  background-color: #4caf50;
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #888;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: 10px 15px;
  background-color: #f44336;
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

interface ReviewModalProps {
  movieId: number;
  review?: Review;
  onClose: () => void;
  onSave: () => void;
}

const ReviewModal = ({ movieId, review, onClose, onSave }: ReviewModalProps) => {
  const [rating, setRating] = useState(review?.rating ?? 1);
  const [comment, setComment] = useState(review?.comment ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Por favor, atribua uma nota.");
      return;
    }

    setIsLoading(true);
    try {
      if (review) {
        await api.put(`/movie/reviews/${review.id}`, { rating, comment });
        toast.success("Editado com sucesso.");
      } else {
        await api.post(`/movie/${movieId}/reviews`, { rating, comment });
        toast.success("Salvo com sucesso.");
      }
      onSave();  // Aciona a atualização da lista de reviews
      onClose();
    } catch (error) {
      console.error("Erro ao salvar review:", error);
      toast.error("Ocorreu um erro ao salvar review.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalContainer>
      <Overlay onClick={handleOverlayClick} />
      <ModalContent>
        <ModalTitle>{review ? "Editar Review" : "Adicionar Review"}</ModalTitle>
        <form onSubmit={handleSubmit}>
          <Label>
            Nota (obrigatório):
            <Input
              type="number"
              min="0"
              max="5"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              autoFocus
            />
          </Label>
          <Label>
            Comentário (opcional):
            <TextArea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Label>
          <ButtonContainer>
            <SaveButton type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </SaveButton>
            <CancelButton type="button" onClick={onClose}>
              Cancelar
            </CancelButton>
          </ButtonContainer>
        </form>
      </ModalContent>
    </ModalContainer>
  );
};

export default ReviewModal;
