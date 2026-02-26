"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNeighborhoodById = exports.getNeighborhoods = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getNeighborhoods = async (req, res, next) => {
    try {
        const neighborhoods = await prisma_1.default.neighborhood.findMany({
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
    }
    catch (error) {
        next(error);
    }
};
exports.getNeighborhoods = getNeighborhoods;
const getNeighborhoodById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const neighborhood = await prisma_1.default.neighborhood.findFirst({
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
        const allProperties = await prisma_1.default.property.findMany({
            where: { neighborhoodId: neighborhood.id },
            select: { price: true }
        });
        const avgPrice = allProperties.length > 0
            ? allProperties.reduce((acc, p) => acc + p.price, 0) / allProperties.length
            : 0;
        res.status(200).json({ neighborhood, avgPrice });
    }
    catch (error) {
        next(error);
    }
};
exports.getNeighborhoodById = getNeighborhoodById;
