import { useState, useEffect } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

const FormContainer = styled.div`
  padding: 30px;
  background-color: #18181b;
  border-radius: 8px;
  color: #fff;
  max-width: 500px;
  margin: auto;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h2`
  font-size: 24px;
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  background-color: #26262c;
  color: #fff;
  border: 1px solid #3a3a44;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 15px;
  font-size: 16px;

  &::placeholder {
    color: #a0a0a8;
  }

  &:focus {
    border-color: #9147ff;
    outline: none;
  }
`;

const SubmitButton = styled.button`
  background-color: #9147ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #772ce8;
  }

  &:focus {
    outline: none;
  }
`;

const BackButton = styled.button`
  background-color: transparent;
  color: #9147ff;
  border: 1px solid #9147ff;
  border-radius: 5px;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 15px;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #9147ff;
    color: #fff;
  }

  &:focus {
    outline: none;
  }
`;

interface EditMovieFormProps {
  movieId: any;
}

const EditMovieForm = ({ movieId }: EditMovieFormProps) => {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseYear, setReleaseYear] = useState<number | "">("");
  const [duration, setDuration] = useState<number | "">("");
  const [coverImageUrl, setcoverImageUrl] = useState<File | null>(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await api.get(`/movie/${movieId}`);
        const movie = response.data;
        setTitle(movie.title);
        setGenre(movie.genre);
        setReleaseYear(movie.releaseYear);
        setDuration(movie.duration);
      } catch (error) {
        console.error("Erro ao buscar filme:", error);
      }
    };

    fetchMovie();
  }, [movieId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("genre", genre);
    formData.append("releaseYear", releaseYear.toString());
    formData.append("duration", duration.toString());
    if (coverImageUrl) {
      formData.append("coverImageUrl", coverImageUrl);
    }

    try {
      await api.put(`/movie/${movieId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao editar filme:", error);
      setMessage("Um erro ocorreu, veja o log no console.");
    }
  };

  return (
    <FormContainer>
      <Title>Editar Filme</Title>
      <Form onSubmit={handleSubmit}>
        <BackButton onClick={() => navigate("/")}>
          Voltar para a página inicial
        </BackButton>
        <Input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Gênero"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Ano de Lançamento"
          value={releaseYear}
          onChange={(e) => setReleaseYear(Number(e.target.value))}
          required
        />
        <Input
          type="number"
          placeholder="Duração (minutos)"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          required
        />
        <p>A imagem é campo opcional</p>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files ? e.target.files[0] : null;
            setcoverImageUrl(file);
          }}
        />
        <SubmitButton type="submit">Salvar Alterações</SubmitButton>
        <p style={{ color: "red", marginTop: "1rem" }}>{message}</p>
      </Form>
    </FormContainer>
  );
};

export default EditMovieForm;
