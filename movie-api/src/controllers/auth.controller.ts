import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as userService from "../services/userService";
import { RegisterUserInput } from "../types/userTypes";
import prisma from "../config/prisma";

// Segredo do JWT, que deve ser o mesmo usado na geração do token
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Interface para o payload do JWT
interface JwtPayload {
    userId: number;
}

// See Authentication Middleware in ./src/middleware/authMiddleware.ts.
// It checks all restricted access requests as platform access.

// Rota para registrar um novo usuário
export const register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body as RegisterUserInput;

    try {
        const result = await userService.registerUser({ name, email, password });
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error });
    }
};

// Rota para login de usuário
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const result = await userService.loginUser({ email, password });
        res.json(result);
    } catch (error) {
        res.status(400).json({ error });
    }
};

// Rota para obter todos os usuários
export const listUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        // Busca todos os usuários sem a senha
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        res.status(200).json(users);
    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        res.status(500).json({ error: "Erro ao listar usuários" });
    }
};

// Rota para atualizar um usuário
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
        const user = await userService.updateUser(Number(id), { name, email, password });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error });
    }
};

// Rota para excluir um usuário
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        await userService.deleteUser(Number(id));
        res.status(201).json({
            message: "Excluído com sucesso!"
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao excluir usuário" });
        console.error("Erro ao excluir usuário:", error);
    }
};

// Função para obter o perfil do usuário logado
export const getProfile = async (req: Request, res: Response): Promise<any> => {
    const token = (req.headers['authorization'] as string)?.split(" ")[1]; // Extrai o token do cabeçalho Authorization

    if (!token) {
        return res.status(401).json({ error: "Token de autenticação ausente" });
    }

    try {
        // Verifica o token e extrai o userId
        const decoded: JwtPayload = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const userId = decoded.userId; // userId já é um número

        // Obtém o usuário do banco de dados
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                // Não selecionar a senha
            },
        });

        if (!user) {
            console.log(`Usuário com id ${userId} não encontrado.`);
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        // Retorna as informações do usuário
        res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Erro ao verificar token:", error);
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
};
