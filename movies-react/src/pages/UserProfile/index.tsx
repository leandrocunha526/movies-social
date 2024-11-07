import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import EditUserModal from "../../components/EditUserModal";
import { api } from "../../services/api";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";

// Definindo um tema com cores para os modos claro e escuro
const lightTheme = {
    background: "#f7fafc",
    cardBackground: "#ffffff",
    textColor: "#4a5568",
    buttonEdit: "#68d391", // Cor para o botão de editar
    buttonEditHover: "#48bb78", // Cor de hover para o botão de editar
    buttonDelete: "#e53e3e", // Cor para o botão de excluir
    buttonDeleteHover: "#c53030", // Cor de hover para o botão de excluir
    buttonHome: "#3182ce", // Cor para o botão de voltar
    buttonHomeHover: "#2b6cb0", // Cor de hover para o botão de voltar
};

const darkTheme = {
    background: "#1a202c",
    cardBackground: "#2d3748",
    textColor: "#cbd5e0",
    buttonEdit: "#68d391", // Cor para o botão de editar
    buttonEditHover: "#48bb78", // Cor de hover para o botão de editar
    buttonDelete: "#fc8181", // Cor para o botão de excluir
    buttonDeleteHover: "#e53e3e", // Cor de hover para o botão de excluir
    buttonHome: "#63b3ed", // Cor para o botão de voltar
    buttonHomeHover: "#4c8fbd", // Cor de hover para o botão de voltar
};

const GlobalStyle = createGlobalStyle<{ theme: typeof lightTheme }>`
    body {
        background-color: ${(props) => props.theme.background};
        color: ${(props) => props.theme.textColor};
        transition: background-color 0.3s, color 0.3s;
    }
`;

interface User {
    id: number;
    name: string;
    email: string;
}

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh; /* Preencher a tela */
`;

const ProfileCard = styled.div`
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 24px;
  width: 100%;
  max-width: 400px; /* Limita a largura do cartão */
  background-color: ${(props) => props.theme.cardBackground};
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const Text = styled.p`
  color: ${(props) => props.theme.textColor}; /* Cor do texto */
  margin: 8px 0; /* Margens verticais */
`;

const Button = styled.button<{ variant: "edit" | "delete" | "home" }>`
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 8px; /* Espaçamento entre os botões */

  background-color: ${(props) => {
        switch (props.variant) {
            case "edit":
                return "#68d391"; // Cor para o botão de editar
            case "delete":
                return "#e53e3e"; // Cor para o botão de excluir
            case "home":
                return "#3182ce"; // Cor para o botão de voltar
            default:
                return "#4a5568"; // Cor padrão
        }
    }};

  &:hover {
    background-color: ${(props) => {
        switch (props.variant) {
            case "edit":
                return "#48bb78"; // Cor de hover para o botão de editar
            case "delete":
                return "#c53030"; // Cor de hover para o botão de excluir
            case "home":
                return "#2b6cb0"; // Cor de hover para o botão de voltar
            default:
                return "#2d3748"; // Cor de hover padrão
        }
    }};
  }
`;

const ToggleButton = styled.button`
  margin-bottom: 20px;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  background-color: #4a5568;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2d3748;
  }
`;

const UserProfile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // Estado para o modo escuro
    const navigate = useNavigate(); // Usando useHistory para navegação

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await api.get("/auth/profile");
                console.log("Resposta da API:", response.data);
                if (response.data && response.data.user) {
                    setUser(response.data.user);
                } else {
                    toast.error("Dados do usuário não encontrados.");
                }
            } catch (error) {
                console.error("Erro ao obter perfil do usuário", error);
                toast.error("Erro ao obter perfil do usuário.");
            }
        };

        fetchUserProfile();
    }, []);

    const handleDelete = async () => {
        if (!user) return;

        try {
            // Excluindo o usuário
            await api.delete(`/auth/${user.id}`);

            // Excluindo dados do localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("token-expiration");
            localStorage.removeItem("redirectAfterLogout");

            // Exibindo mensagem de sucesso
            toast.success("Usuário excluído com sucesso.");

            // Redirecionando para a página de login
            navigate("/login");

            // Atualizando o estado do usuário
            setUser(null);
        } catch (error) {
            console.error("Erro ao excluir usuário", error);
            toast.error("Erro ao excluir usuário.");
        }
    };
    const handleEdit = (updatedUser: User) => {
        setUser(updatedUser);
        setIsModalOpen(false);
    };

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    if (!user) return <ProfileContainer>Carregando...</ProfileContainer>;

    return (
        <>
            <GlobalStyle theme={isDarkMode ? darkTheme : lightTheme} />
            <ProfileContainer>
                <ToggleButton onClick={toggleTheme}>
                    {isDarkMode ? "Modo Claro" : "Modo Escuro"}
                </ToggleButton>
                <ProfileCard>
                    <Title>Perfil do Usuário</Title>
                    <Text>
                        <strong>ID:</strong> {user.id}
                    </Text>
                    <Text>
                        <strong>Nome:</strong> {user.name}
                    </Text>
                    <Text>
                        <strong>Email:</strong> {user.email}
                    </Text>
                    <div style={{ marginTop: "24px", display: "flex" }}>
                        <Button variant="edit" onClick={() => setIsModalOpen(true)}>
                            Editar
                        </Button>
                        <Button variant="delete" onClick={handleDelete}>
                            Excluir
                        </Button>
                        <Button variant="home" onClick={() => navigate("/")}>
                            Voltar para a Home
                        </Button>
                    </div>
                </ProfileCard>

                <EditUserModal
                    isOpen={isModalOpen}
                    user={user}
                    onClose={() => setIsModalOpen(false)}
                    onEdit={handleEdit}
                />
            </ProfileContainer>
        </>
    );
};

export default UserProfile;
