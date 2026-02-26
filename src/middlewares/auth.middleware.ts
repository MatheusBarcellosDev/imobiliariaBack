import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
    }

    try {
        const secret = process.env.JWT_SECRET || "default_secret";
        const decoded = jwt.verify(token, secret) as { id: string; role: string };

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido ou expirado." });
    }
};
