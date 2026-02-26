"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios." });
        }
        const userExists = await prisma_1.default.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ error: "E-mail já cadastrado." });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "AGENT", // Default role
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
        res.status(201).json({ message: "Corretor registrado com sucesso!", user });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
        }
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "Credenciais inválidas." });
        }
        const validPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Credenciais inválidas." });
        }
        const secret = process.env.JWT_SECRET || "default_secret";
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, secret, {
            expiresIn: "7d",
        });
        res.status(200).json({
            message: "Login bem-sucedido.",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const me = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Não autorizado." });
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }
        });
        res.status(200).json({ user });
    }
    catch (error) {
        next(error);
    }
};
exports.me = me;
