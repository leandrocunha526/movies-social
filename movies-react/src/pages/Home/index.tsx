import { useEffect, useState } from "react";
import { api } from "../../services/api";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaFilm, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import RecommendationInfo from "../../components/RecommendationInfo";

interface Movie {
  id: number;
  title: string;
  description: string;
  coverImageUrl: string;
  reviewCount: number;
  genre: string;
  releaseYear: number;
}

const Container = styled.div`
  padding: 20px;
  background-color: #18181b;
  color: #fff;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const AddMovieButton = styled.button`
  padding: 12px 18px;
  background-color: #4caf50; // Verde para indicar adição
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  background-color: #2c2c33;
  border: 1px solid #444;
  border-radius: 5px;
  color: #fff;
  font-size: 1em;

  &::placeholder {
    color: #888;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(
    auto-fill,
    minmax(250px, 1fr)
  ); // Aumenta o tamanho mínimo do card
`;

const Card = styled.div`
  background-color: #2c2c33;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  padding: 20px;
  max-width: 280px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }
`;

const PosterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
  width: 100%;
  overflow: hidden;
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const CardContent = styled.div`
  padding: 15px;
`;

const MovieTitle = styled.h3`
  font-size: 1em;
  font-weight: bold;
  color: #fff;
`;

const ReviewCount = styled.p`
  font-size: 0.9em;
  color: #888;
`;

const EditButton = styled.button`
  padding: 10px 15px;
  background-color: #2196f3; // Azul para edição
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1976d2;
  }
`;

const DeleteButton = styled.button`
  padding: 10px 15px;
  background-color: #f44336; // Vermelho para exclusão
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #d32f2f;
  }
`;

const DetailButton = styled.button`
  padding: 10px 15px;
  background-color: #9147ff; // Roxo para visualização de detalhes
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #772ce8;
  }
`;

const Pagination = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const PaginationButton = styled.button`
  padding: 8px 12px;
  background-color: #2c2c33;
  color: #fff;
  border: 1px solid #444;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #3a3a42;
  }

  &:disabled {
    color: #666;
    cursor: not-allowed;
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerIcon = styled(FaSpinner)`
  animation: ${spin} 1s linear infinite;
  font-size: 2em;
  color: #4caf50; /* Cor do spinner */
`;

const MoviesCount = styled.p`
  font-size: 1.1em;
  margin-bottom: 20px;
  color: #aaa;
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
`;

const FilterSelect = styled.select`
  padding: 10px;
  background-color: #2c2c33;
  border: 1px solid #444;
  border-radius: 5px;
  color: #fff;
  font-size: 1em;
`;

const SectionTitle = styled.h2`
  margin-top: 40px;
  color: #4caf50; // Cor de destaque para o título
  text-align: center;
`;

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalMovies, setTotalMovies] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/movie/list`, {
          params: {
            page: currentPage,
            perPage: itemsPerPage,
            search: searchTerm,
          },
        });
        const fetchedMovies = response.data.movies;
        setMovies(fetchedMovies);
        setTotalMovies(response.data.totalMovies);

        // Extrair gêneros e anos dos filmes
        const allGenres = Array.from(
          new Set(fetchedMovies.map((movie: Movie) => movie.genre))
        ) as string[];
        const allYears = Array.from(
          new Set(
            fetchedMovies.map((movie: Movie) => movie.releaseYear.toString())
          )
        ) as string[];

        setGenres(allGenres);
        setYears(allYears);
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    // Buscar filmes recomendados
    const fetchRecommendedMovies = async () => {
      setIsLoadingRecommendations(true);
      try {
        const response = await api.get(`/movie/recommend`);
        setRecommendedMovies(response.data.recommendedMovies);
      } catch (error) {
        console.error("Erro ao buscar filmes recomendados:", error);
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    fetchRecommendedMovies();
  }, []);

  const handleEditMovie = (movieId: number) => {
    navigate(`/edit/${movieId}`);
  };

  const handleDeleteMovie = async (movieId: number) => {
    try {
      await api.delete(`/movie/${movieId}`);
      setMovies(movies.filter((movie) => movie.id !== movieId));
      setTotalMovies(totalMovies - 1); // Atualiza o total ao excluir
      toast.success(`O filme foi excluído com sucesso!`);
    } catch (error) {
      console.error("Erro ao excluir filme:", error);
      toast.error(
        "Ocorreu um erro ao realizar a exclusão ou este item tem avaliação."
      );
    }
  };

  const handleAddMovie = () => {
    navigate("/add-movie");
  };

  const handleDetail = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(event.target.value);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value);
  };

  // Filtrar filmes com base nos filtros aplicados
  const filteredMovies = movies.filter((movie) => {
    const genreMatches = selectedGenre ? movie.genre === selectedGenre : true;
    const yearMatches = selectedYear
      ? movie.releaseYear.toString() === selectedYear
      : true;
    const searchMatches = movie.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return genreMatches && yearMatches && searchMatches;
  });

  return (
    <Container>
      <Header>
        <AddMovieButton onClick={handleAddMovie}>
          Adicionar Filme
        </AddMovieButton>
      </Header>
      <SearchBar
        type="search"
        placeholder="Pesquisar por título..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <FilterContainer>
        <FilterSelect value={selectedGenre} onChange={handleGenreChange}>
          <option value="">Todos os Gêneros</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect value={selectedYear} onChange={handleYearChange}>
          <option value="">Todos os Anos</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </FilterSelect>
      </FilterContainer>

      {isLoading ? (
        <SpinnerIcon />
      ) : (
        <>
          <MoviesCount>
            {`F${totalMovies === 1 ? "oi" : "oram"} encontrado${
              totalMovies === 1 ? "" : "s"
            } ${totalMovies} filme${totalMovies === 1 ? "" : "s"}.`}
          </MoviesCount>
          {movies.length === 0 ? (
            <p>Nenhum filme cadastrado</p>
          ) : (
            <Grid>
              {filteredMovies.map((movie) => (
                <Card key={movie.id}>
                  <PosterContainer>
                    {movie.coverImageUrl ? (
                      <Poster
                        src={movie.coverImageUrl}
                        alt={`${movie.title} poster`}
                      />
                    ) : (
                      <div className="flex items-center justify-center bg-gray-300 h-full w-full">
                        <FaFilm className="text-gray-500" size={80} />
                      </div>
                    )}
                  </PosterContainer>
                  <CardContent>
                    <MovieTitle>{movie.title}</MovieTitle>
                    <ReviewCount>
                      {`Possui ${movie.reviewCount ? movie.reviewCount : 0} ${
                        movie.reviewCount === 1 ? "avaliação" : "avaliações"
                      }`}
                    </ReviewCount>
                    <EditButton onClick={() => handleEditMovie(movie.id)}>
                      Editar
                    </EditButton>
                    <DeleteButton onClick={() => handleDeleteMovie(movie.id)}>
                      Excluir
                    </DeleteButton>
                    <DetailButton onClick={() => handleDetail(movie.id)}>
                      Detalhes
                    </DetailButton>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          )}
        </>
      )}

      <Pagination>
        <PaginationButton
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </PaginationButton>
        <PaginationButton onClick={() => setCurrentPage(currentPage + 1)}>
          Próximo
        </PaginationButton>
      </Pagination>

      <SectionTitle>Recomendação para você</SectionTitle>
      {isLoadingRecommendations ? (
        <SpinnerIcon />
      ) : (
        <Grid>
          {recommendedMovies.length === 0 ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  marginTop: "20px",
                }}
              >
                <RecommendationInfo />
              </div>
            </>
          ) : (
            recommendedMovies.map((movie) => (
              <Card key={movie.id}>
                <PosterContainer>
                  {movie.coverImageUrl ? (
                    <Poster
                      src={movie.coverImageUrl}
                      alt={`${movie.title} poster`}
                    />
                  ) : (
                    <div className="flex items-center justify-center bg-gray-300 h-full w-full">
                      <FaFilm className="text-gray-500" size={80} />
                    </div>
                  )}
                </PosterContainer>
                <CardContent>
                  <MovieTitle>{movie.title}</MovieTitle>
                  <DetailButton onClick={() => handleDetail(movie.id)}>
                    Detalhes
                  </DetailButton>
                </CardContent>
              </Card>
            ))
          )}
        </Grid>
      )}
    </Container>
  );
};

export default Home;
