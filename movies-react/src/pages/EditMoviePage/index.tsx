import { useParams } from "react-router-dom";
import EditMovieForm from "../../components/EditFormMovie";

const EditMoviePage = () => {
    const { id } = useParams<{ id: string }>();

    const movieId = id ? parseInt(id) : null;

    return (
        <div>
            {movieId !== null ? (
                <EditMovieForm movieId={movieId} />
            ) : (
                <div>Filme não encontrado.</div>
            )}
        </div>
    );
};

export default EditMoviePage;
