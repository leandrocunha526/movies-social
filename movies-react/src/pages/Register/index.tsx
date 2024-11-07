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

const RegisterPage = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor, insira um email válido.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      console.log("Cadastro realizado com sucesso!");
      navigate("/"); // Redireciona para a página de login após o cadastro
    } catch (error) {
      setError("Erro ao registrar. Tente novamente.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Container>
      <Content>
        <Description>
          <h1>Junte-se à nossa comunidade</h1>
          <p>
            Registre-se para descobrir e avaliar filmes ou séries incríveis, e conectar-se
            com outros cinéfilos.
          </p>
        </Description>
        <Card>
          <Title>Registrar</Title>
          <Form onSubmit={handleSubmit}>
            <InputWrapper>
              <Label>Nome</Label>
              <Input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </InputWrapper>
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
            </InputWrapper>
            <InputWrapper>
              <Label>Confirmar Senha</Label>
              <Input
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrar"}
              </Button>
            </InputWrapper>
            {error && (
              <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
            )}
          </Form>
          <Divider>Ou</Divider>
          <SwitchForm>
            Já tem uma conta? <Link to="/">Entrar</Link>
          </SwitchForm>
        </Card>
      </Content>
    </Container>
  );
};

export default RegisterPage;
