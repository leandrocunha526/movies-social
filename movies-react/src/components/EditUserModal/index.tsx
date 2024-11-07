import React, { useState } from 'react';
import styled from 'styled-components';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

interface User {
    id: number;
    name: string;
    email: string;
}

interface EditUserModalProps {
    isOpen: boolean;
    user: User;
    onClose: () => void;
    onEdit: (updatedUser: User) => void;
}

const ModalContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: #2c2c2e; /* Fundo escuro */
    padding: 25px;
    border-radius: 8px;
    width: 100%;
    max-width: 450px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
    color: #f5f5f7; /* Texto claro */
    animation: fadeIn 0.3s ease;
`;

const Title = styled.h2`
    font-size: 1.5em;
    color: #f5f5f7;
    margin-bottom: 20px;
    text-align: center;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const Label = styled.label`
    font-size: 1em;
    color: #a9a9a9; /* Cinza claro para o label */
    margin-bottom: 5px;
`;

const Input = styled.input`
    width: 100%; /* Faz o input ocupar toda a largura do contêiner */
    max-width: 400px; /* Define uma largura máxima para limitar o crescimento */
    padding: 10px 14px; /* Mantém o padding vertical */
    background-color: #3a3a3c;
    color: #f5f5f7;
    border: 1px solid #5a5a5c;
    border-radius: 5px;
    font-size: 1em;
    transition: border-color 0.3s ease;

    &:focus {
        outline: none;
        border-color: #0a84ff; /* Azul para foco */
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 15px;
`;

const SaveButton = styled.button`
    padding: 10px;
    font-size: 1em;
    font-weight: bold;
    color: #fff;
    background-color: #32d74b; /* Verde para Salvar */
    border: none;
    border-radius: 5px;
    cursor: pointer;
    flex: 1;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #28b745;
    }
`;

const CancelButton = styled.button`
    padding: 10px;
    font-size: 1em;
    font-weight: bold;
    color: #fff;
    background-color: #ff453a; /* Vermelho para Cancelar */
    border: none;
    border-radius: 5px;
    cursor: pointer;
    flex: 1;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #e03e36;
    }
`;

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, user, onClose, onEdit }) => {
    const [name, setName] = useState<string>(user.name);
    const [email, setEmail] = useState<string>(user.email);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await api.put(`/auth/${user.id}`, { name, email });
            onEdit(response.data);
            onClose();
            toast.success("Editado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar usuário", error);
            toast.error("Ops! Um erro ocorreu. Veja:" + error);
        }
    };

    if (!isOpen) return null;

    return (
        <ModalContainer>
            <ModalContent>
                <Title>Editar Usuário</Title>
                <Form onSubmit={handleSubmit}>
                    <div>
                        <Label>Nome:</Label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nome"
                        />
                    </div>
                    <div>
                        <Label>Email:</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                    </div>
                    <ButtonContainer>
                        <SaveButton type="submit">Salvar</SaveButton>
                        <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
                    </ButtonContainer>
                </Form>
            </ModalContent>
        </ModalContainer>
    );
};

export default EditUserModal;
