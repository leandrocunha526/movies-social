import React from "react";
import AuthService from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Adicionando ponto e vírgula

interface HeaderProps {
    onLogout: () => void;
}

const HeaderComponent: React.FC<HeaderProps> = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Chama o serviço de logout
        AuthService.logout(); // Chama o método de logout
        onLogout(); // Chama a função de logout passada como prop
        navigate("/login"); // Navega para a página de login
        toast.success("Até breve!"); // Exibe mensagem de sucesso
    };

    const navigateToProfile = () => {
        navigate("/user"); // Navega para o perfil do usuário
    };

    return (
        <header style={headerStyle}>
            <div style={logoStyle}>
                <h1 style={titleStyle}>Filmes</h1>
            </div>

            <nav style={navStyle}>
                <button onClick={navigateToProfile} style={profileButtonStyle}>
                    Perfil
                </button>
                <button onClick={handleLogout} style={logoutButtonStyle}>
                    Logout
                </button>
            </nav>
        </header>
    );
};

const headerStyle: React.CSSProperties = {
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};

const logoStyle: React.CSSProperties = {
    fontSize: "1.5em",
    fontWeight: "bold",
};

const titleStyle: React.CSSProperties = {
    margin: 0,
};

const navStyle: React.CSSProperties = {
    display: "flex",
    gap: "15px",
};

const profileButtonStyle: React.CSSProperties = {
    padding: "8px 12px",
    backgroundColor: "#4CAF50", // Verde para o botão de perfil
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
};

const logoutButtonStyle: React.CSSProperties = {
    padding: "8px 12px",
    backgroundColor: "#f44336", // Vermelho para logout
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
};

export default HeaderComponent;
