import styled from "styled-components";

// Container principal que ocupa toda a altura da tela
export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Usa a altura mínima para ocupar toda a tela */
  background-color: #0e0e10;
  color: #f0f0f0;
  padding: 1rem; /* Pequeno espaçamento geral */
  overflow-y: auto;
`;

// Container para o conteúdo do formulário
export const Content = styled.div`
  display: flex;
  flex-direction: row; /* Direção padrão para telas grandes */
  max-width: 1000px; /* Largura máxima do conteúdo */
  width: 90%; /* Largura responsiva */
  justify-content: space-between;
  padding: 1rem; /* Espaçamento interno */

  @media (max-width: 768px) {
    flex-direction: column; /* Muda para coluna em telas pequenas */
    align-items: center; /* Centraliza os itens */
  }
`;

// Descrição acima do formulário
export const Description = styled.div`
  flex: 1; /* Ocupar o espaço restante */
  padding-right: 1rem; /* Espaçamento à direita */
  color: #f0f0f0; /* Cor do texto */
  text-align: center; /* Centraliza o texto em telas pequenas */

  h1 {
    font-size: 1.75rem; /* Tamanho do título responsivo */
    margin-bottom: 1rem; /* Espaçamento abaixo do título */
  }

  p {
    font-size: 1rem; /* Tamanho do parágrafo */
    color: #adadb8; /* Cor do parágrafo */
  }

  @media (max-width: 768px) {
    padding-right: 0; /* Remove o padding à direita em telas menores */
    margin-bottom: 2rem; /* Adiciona espaço abaixo da descrição */
  }
`;

// Card para o formulário
export const Card = styled.div`
  flex-grow: 1; /* Permite que o card cresça para ocupar espaço */
  max-width: 350px; /* Largura máxima do card */
  width: 100%; /* Ajusta a largura para ser mais responsiva */
  padding: 1.5rem; /* Espaçamento interno */
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* Sombra do card */
  border-radius: 8px; /* Bordas arredondadas */
  background-color: #18181b; /* Cor de fundo do card */
  text-align: center; /* Centraliza o texto */

  @media (max-width: 768px) {
    margin-top: 1rem; /* Espaçamento acima do card */
  }
`;

// Título do formulário
export const Title = styled.h2`
  font-size: 1.5rem; /* Tamanho do título */
  color: #ffffff; /* Cor do texto */
  margin-bottom: 1rem; /* Espaçamento abaixo do título */
`;

// Formulário
export const Form = styled.form`
  display: flex;
  flex-direction: column; /* Organiza os campos em coluna */
`;

// Wrapper para cada campo de entrada
export const InputWrapper = styled.div`
  margin-bottom: 1rem; /* Espaçamento entre os campos */
`;

// Rótulo para cada campo
export const Label = styled.label`
  font-size: 0.875rem; /* Tamanho do rótulo */
  color: #adadb8; /* Cor do rótulo */
  margin-bottom: 0.5rem; /* Espaçamento abaixo do rótulo */
  display: block; /* Exibe como bloco */
  text-align: left; /* Alinhamento à esquerda */
`;

// Campo de entrada
export const Input = styled.input`
  width: 100%; /* Ocupa toda a largura do contêiner */
  padding: 0.75rem; /* Espaçamento interno */
  border: 1px solid #333; /* Borda cinza escuro */
  border-radius: 4px; /* Bordas arredondadas */
  font-size: 1rem; /* Tamanho da fonte */
  color: #ffffff; /* Cor do texto */
  background-color: #1f1f23; /* Cor de fundo do campo */
  outline: none; /* Remove o contorno padrão */
  transition: border-color 0.3s ease; /* Transição suave na cor da borda */

  &:focus {
    border-color: #9147ff; /* Cor da borda ao focar */
  }
`;

// Botão de envio
export const Button = styled.button`
  font-family: inherit; /* Garante a mesma fonte padrão */
  padding: 1rem 0; /* Ajusta o tamanho do botão */
  width: 100%; /* Ocupa toda a largura do contêiner */
  background-color: #9147ff; /* Cor de fundo do botão */
  color: #ffffff; /* Cor do texto */
  border: none; /* Remove a borda padrão */
  border-radius: 4px; /* Bordas arredondadas */
  font-size: 0.875rem; /* Tamanho da fonte */
  font-weight: bold; /* Deixa o texto em negrito */
  cursor: pointer; /* Muda o cursor ao passar o mouse */
  transition: background-color 0.3s ease, box-shadow 0.3s ease,
    transform 0.1s ease; /* Transições suaves */
  margin-top: 1rem; /* Espaçamento acima do botão */

  &:hover {
    background-color: #772ce8; /* Cor do botão ao passar o mouse */
    box-shadow: 0 4px 12px rgba(145, 71, 255, 0.3); /* Sombra do botão ao passar o mouse */
  }

  &:active {
    transform: scale(0.98); /* Efeito de pressionar o botão */
  }

  &:focus {
    outline: none; /* Remove o contorno ao focar */
    box-shadow: 0 0 0 3px rgba(145, 71, 255, 0.5); /* Sombra ao focar */
  }
`;

// Divisor para separar conteúdos
export const Divider = styled.div`
  display: flex; /* Exibe como flexbox */
  align-items: center; /* Alinha os itens ao centro */
  text-align: center; /* Centraliza o texto */
  margin: 1rem 0; /* Espaçamento vertical reduzido */
  color: #888; /* Cor do texto */
  font-size: 0.875rem; /* Tamanho da fonte */

  &::before,
  &::after {
    content: ""; /* Cria conteúdo vazio */
    flex: 1; /* Ocupar espaço disponível */
    border-bottom: 1px solid #333; /* Borda inferior */
    margin: 0 0.5rem; /* Espaçamento lateral */
  }
`;

// Componente para alternar para a tela de login
export const SwitchForm = styled.div`
  font-size: 0.875rem; /* Tamanho da fonte */
  color: #adadb8; /* Cor do texto */

  a {
    color: #9147ff; /* Cor do link */
    text-decoration: none; /* Remove o sublinhado */
    transition: color 0.3s ease; /* Transição suave na cor do link */

    &:hover {
      color: #772ce8; /* Cor do link ao passar o mouse */
    }
  }
`;
