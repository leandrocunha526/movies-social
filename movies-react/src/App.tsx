import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthService from "./services/authService";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Home from "./pages/Home";
import AddMovieForm from "./pages/AddMovie";
import MovieDetails from "./pages/DetailMovie";
import EditMoviePage from "./pages/EditMoviePage";
import ProtectedRoute from "./components/ProtectedRoute";
import 'react-toastify/dist/ReactToastify.css';
import Header from "./components/Header";
import UserProfile from "./pages/UserProfile";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Inicializa como null

    useEffect(() => {
        // Função para verificar a autenticação
        const checkAuthentication = () => {
            const authenticated = AuthService.isAuthenticated();
            setIsAuthenticated(authenticated);
        };

        checkAuthentication(); // Verifica o estado de autenticação inicial

        // Configura um intervalo para verificar a autenticação periodicamente
        const interval = setInterval(checkAuthentication, 60000); // Verifica a cada 60 segundos
        return () => clearInterval(interval);
    }, []);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true); // Atualiza imediatamente após o login
    };

    const handleLogout = () => {
        AuthService.logout(); // Chame o método de logout do AuthService
        setIsAuthenticated(false); // Atualiza o estado para não autenticado
    };

    return (
        <Router>
            {/* Renderiza o Header apenas se o usuário estiver autenticado */}
            {isAuthenticated && <Header onLogout={handleLogout} />}
            <Routes>
                <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="/register" element={isAuthenticated ? <Navigate to="/home" replace /> : <RegisterPage />} />
                <Route
                    path="/home"
                    element={<ProtectedRoute element={<Home />} />}
                />
                <Route
                    path="/add-movie"
                    element={<ProtectedRoute element={<AddMovieForm />} />}
                />
                <Route
                    path="/movies/:id"
                    element={<ProtectedRoute element={<MovieDetails />} />}
                />
                <Route
                    path="/edit/:id"
                    element={<ProtectedRoute element={<EditMoviePage />} />}
                />
                <Route
                    path="/user"
                    element={<ProtectedRoute element={<UserProfile />} />}
                />
            </Routes>
        </Router>
    );
}

export default App;
