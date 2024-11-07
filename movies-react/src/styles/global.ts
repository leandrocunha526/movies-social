import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  /* Reset básico para remover padding e margin */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Fonte padrão e cor de fundo global */
  body {
    font-family: Arial, Helvetica, sans-serif;
    background-color: #0e0e10; /* Fundo escuro global */
    color: #f0f0f0; /* Texto claro para contraste */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Estilos para fontes responsivas */
  h1, h2, h3, h4, h5, h6 {
    font-size: 2rem; /* Tamanho padrão */
  }

  @media (max-width: 768px) {
    h1, h2, h3, h4, h5, h6 {
      font-size: 1rem; /* Tamanho menor para telas pequenas */
    }
  }

  /* Estilo para links */
  a {
    color: #9147ff; /* Roxo da Twitch */
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #772ce8;
    }
  }

  /* Estilos para botões reset */
  button {
    font-family: inherit;
    cursor: pointer;
    outline: none;
  }

  /* Placeholder estilizado para inputs */
  input::placeholder {
    color: #adadb8; /* Cor sutil para placeholder */
    opacity: 1;
  }

  /* Estilos personalizados para o scroll */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #18181b;
  }
  ::-webkit-scrollbar-thumb {
    background: #9147ff;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #772ce8;
  }
`;

export default GlobalStyles;
