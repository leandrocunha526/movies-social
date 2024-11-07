import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Content,
  Card,
  Description,
  Title,
  Form,
  InputWrapper,
  Label,
  Input,
  Button,
  Divider,
  SwitchForm,
} from "../../styles/auth";
import { api } from "../../services/api";
import { FormEvent, useState } from "react";
import AuthService from "../../services/authService";

const LoginPage = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); // Limpa erros anteriores

    // Validação de entrada
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post<{ token: string }>("/auth/login", {
        email,
        password,
      });

      const { token } = response.data;

      if (token) {
        AuthService.setToken(token);
        onLoginSuccess(); // Chama a função para atualizar a autenticação
      }

      console.log("Login realizado com sucesso!");

      navigate("/home");
    } catch (error) {
      setError("Credenciais inválidas ou erro no servidor.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Content>
        <Description>
          <h1>Bem-vindo</h1>
          <p>
            Compartilhe avaliações de filmes e de séries! Explore novas
            recomendações com nossa comunidade.
          </p>
        </Description>
        <Card>
          <Title>Login</Title>
          <Form onSubmit={handleSubmit}>
            <InputWrapper>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputWrapper>
            <InputWrapper>
              <Label>Senha</Label>
              <Input
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
              {error && (
                <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
              )}
            </InputWrapper>
          </Form>
          <Divider>Ou</Divider>
          <SwitchForm>
            Não tem uma conta? <Link to="/register">Registrar</Link>
          </SwitchForm>
        </Card>
      </Content>
    </Container>
  );
};

export default LoginPage;
