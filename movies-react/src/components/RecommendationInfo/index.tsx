import { FaUsers, FaThumbsUp } from "react-icons/fa";
import { MdOutlineInfo } from "react-icons/md";
import styled from "styled-components";

const InfoBox = styled.div`
  color: #ddd;
  padding: 20px;
  border-radius: 8px;
  line-height: 1.6;
  max-width: 600px;
  text-align: left;
  margin: 0 auto; // Centraliza horizontalmente
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2em;
  font-weight: bold;
  color: #9147ff;
`;

const InfoText = styled.p`
  margin: 10px 0;
`;

const InfoList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
`;

const InfoListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const RecommendationInfo = () => (
  <InfoBox>
    <InfoText>
      Nenhuma recomendação encontrada.
    </InfoText>
    <InfoHeader>
      <MdOutlineInfo size={24} />
      Como funciona a recomendação?
    </InfoHeader>
    <InfoText>
      O método chamado <i>collaborative filtering</i>, que compara
      suas avaliações de filmes com as de outros usuários para encontrar
      pessoas com gostos semelhantes. Aqui está um resumo:
    </InfoText>
    <InfoList>
      <InfoListItem>
        <FaUsers size={80} color="#4caf50" />
        <strong>Usuários Similares:</strong> O sistema identifica pessoas que
        assistiram e avaliaram filmes de maneira parecida com a sua.
      </InfoListItem>
      <InfoListItem>
        <FaThumbsUp size={80} color="#f4c430" />
        <strong>Filmes Sugeridos:</strong> As recomendações são filmes que
        esses usuários gostaram muito (avaliações ≥ 4) e que você ainda não
        viu.
      </InfoListItem>
    </InfoList>
  </InfoBox>
);

export default RecommendationInfo;
