import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export const createProperty = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, price, area, bedrooms, bathrooms, garages, type, status, address, neighborhoodId, features, iptu, condoFee, yearBuilt, floorPlan } = req.body;

        const images: string[] = req.body.images || [];
        const amenities: string[] = req.body.amenities || [];
        const documents: string[] = req.body.documents || [];

        const property = await prisma.property.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                area: parseFloat(area),
                bedrooms: parseInt(bedrooms),
                bathrooms: parseInt(bathrooms),
                garages: parseInt(garages),
                type,
                status,
                address,
                images,
                amenities,
                documents,
                iptu: iptu ? parseFloat(iptu) : undefined,
                condoFee: condoFee ? parseFloat(condoFee) : undefined,
                yearBuilt: yearBuilt ? parseInt(yearBuilt) : undefined,
                floorPlan,
                neighborhoodId: neighborhoodId || undefined,
                featured: req.body.featured || false,
            },
        });

        res.status(201).json({ property });
    } catch (error) {
        next(error);
    }
};

export const getProperties = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const properties = await prisma.property.findMany({
            include: {
                neighborhood: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.status(200).json({ properties });
    } catch (error) {
        next(error);
    }
};

export const getPropertyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const property = await prisma.property.findUnique({
            where: { id: id as string },
            include: {
                neighborhood: true,
            }
        });

        if (!property) {
            return res.status(404).json({ error: "Imóvel não encontrado." });
        }

        res.status(200).json({ property });
    } catch (error) {
        next(error);
    }
};

export const updateProperty = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Optional field parsing
        if (data.price) data.price = parseFloat(data.price);
        if (data.area) data.area = parseFloat(data.area);
        if (data.bedrooms) data.bedrooms = parseInt(data.bedrooms);
        if (data.bathrooms) data.bathrooms = parseInt(data.bathrooms);
        if (data.garages) data.garages = parseInt(data.garages);
        if (data.iptu) data.iptu = parseFloat(data.iptu);
        if (data.condoFee) data.condoFee = parseFloat(data.condoFee);
        if (data.yearBuilt) data.yearBuilt = parseInt(data.yearBuilt);

        const property = await prisma.property.update({
            where: { id: id as string },
            data,
        });

        res.status(200).json({ property });
    } catch (error) {
        next(error);
    }
};

export const deleteProperty = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        await prisma.property.delete({
            where: { id: id as string },
        });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
