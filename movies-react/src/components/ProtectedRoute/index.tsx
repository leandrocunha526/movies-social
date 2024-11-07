import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('token');
      const expiration = localStorage.getItem('token-expiration');

      if (token && expiration) {
        const expDate = new Date(expiration);
        const now = new Date();

        if (now < expDate) {
          setIsAuthenticated(true);
        } else {
          // Se o token tiver expirado, remova-o e atualize o estado
          localStorage.removeItem('token');
          localStorage.removeItem('token-expiration');
          setIsAuthenticated(false); // Atualiza o estado para não autenticado
        }
      } else {
        setIsAuthenticated(false); // Não há token, não autenticado
      }
      setIsChecking(false); // Finaliza a verificação
    };

    checkAuthentication();
  }, []);

  useEffect(() => {
    if (!isChecking) {
      if (!isAuthenticated) {
        navigate("/login"); // Redireciona para o login se não estiver autenticado
      }
    }
  }, [isAuthenticated, isChecking, navigate]);

  if (isChecking) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }

  return isAuthenticated ? element : null; // Retorna o elemento se autenticado
};

export default ProtectedRoute;
