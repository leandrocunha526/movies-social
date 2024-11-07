import { useState } from "react";
import styled from "styled-components";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
    border-color: #9147ff; /* Cor de destaque para o foco */
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
  margin: 15px 0px;

  &:hover {
    background-color: #9147ff;
    color: #fff;
  }

  &:focus {
    outline: none;
  }
`;

const AddMovieForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseYear, setReleaseYear] = useState<number | "">("");
  const [duration, setDuration] = useState<number | "">("");
  const [coverImageUrl, setcoverImageUrl] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("genre", genre);
    formData.append("releaseYear", releaseYear.toString());
    formData.append("duration", duration.toString());
    if (coverImageUrl) {
      formData.append("coverImageUrl", coverImageUrl);
    }

    try {
      await api.post("/movie/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTitle("");
      setDescription("");
      setGenre("");
      setReleaseYear("");
      setDuration("");
      setcoverImageUrl(null);
      toast.success("Salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar filme:", error);
    }
  };

  return (
    <FormContainer>
      <Title>Adicionar Filme</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
        <label>A imagem é campo opcional</label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files ? e.target.files[0] : null;
            setcoverImageUrl(file);
          }}
        />
        <SubmitButton type="submit">Adicionar Filme</SubmitButton>
        <BackButton onClick={() => navigate(-1)}>Voltar</BackButton>
      </Form>
    </FormContainer>
  );
};

export default AddMovieForm;
