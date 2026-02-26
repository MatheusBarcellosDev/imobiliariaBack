import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export const createLead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, phone, message, source } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: "Nome e e-mail são obrigatórios para um lead." });
        }

        const lead = await prisma.lead.create({
            data: {
                name,
                email,
                phone,
                message,
                source: source || "SITE",
                status: "NOVO"
            },
        });

        res.status(201).json({ lead });
    } catch (error) {
        next(error);
    }
};

export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.status(200).json({ leads });
    } catch (error) {
        next(error);
    }
};

export const updateLeadStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status, agentId } = req.body;

        const data: any = {};
        if (status) data.status = status;
        if (agentId) data.agentId = agentId;

        const lead = await prisma.lead.update({
            where: { id: id as string },
            data,
        });

        res.status(200).json({ lead });
    } catch (error) {
        next(error);
    }
};
