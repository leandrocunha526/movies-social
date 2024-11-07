import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RegisterUserInput, LoginUserInput, AuthResponse, RegisterResponse } from "../types/userTypes";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const registerUser = async ({ name, email, password }: RegisterUserInput): Promise<RegisterResponse> => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
    });

    return {
        user: { id: user.id, name: user.name, email: user.email },
    };
};

export const loginUser = async ({ email, password }: LoginUserInput): Promise<AuthResponse> => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Usuário não encontrado");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error("Senha incorreta");

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    return {
        token,
        user: { id: user.id, name: user.name, email: user.email },
    };
};

// Função para obter todos os usuários
export const getAllUsers = async () => {
    return await prisma.user.findMany();
};

// Função para obter um usuário por ID
export const getUserById = async (id: number) => {
    return await prisma.user.findUnique({ where: { id } });
};

// Função para atualizar um usuário
export const updateUser = async (id: number, data: Partial<RegisterUserInput>) => {
    return await prisma.user.update({
        where: { id },
        data,
    });
};

// Função para excluir um usuário
export const deleteUser = async (id: number) => {
    return await prisma.user.delete({
        where: { id },
    });
};
