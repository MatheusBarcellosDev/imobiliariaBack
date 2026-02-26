import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export const getNeighborhoods = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const neighborhoods = await prisma.neighborhood.findMany({
            include: {
                _count: {
                    select: { properties: true }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });
        res.status(200).json({ neighborhoods });
    } catch (error) {
        next(error);
    }
};

export const getNeighborhoodById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const neighborhood = await prisma.neighborhood.findFirst({
            where: {
                OR: [
                    { id: id },
                    { name: { equals: id, mode: 'insensitive' } }
                ]
            },
            include: {
                properties: {
                    where: { featured: true }, // ou pode trazer todos, limitando
                    take: 6,
                },
                _count: {
                    select: { properties: true }
                }
            }
        });

        if (!neighborhood) {
            return res.status(404).json({ error: "Bairro não encontrado." });
        }

        // Calcula ticket médio
        const allProperties = await prisma.property.findMany({
            where: { neighborhoodId: neighborhood.id },
            select: { price: true }
        });

        const avgPrice = allProperties.length > 0
            ? allProperties.reduce((acc, p) => acc + p.price, 0) / allProperties.length
            : 0;

        res.status(200).json({ neighborhood, avgPrice });
    } catch (error) {
        next(error);
    }
};
