import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export const createProperty = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            title, description, price, area, bedrooms, bathrooms, garages, type, status,
            images, amenities, documents, neighborhoodId, features, featured,
            iptu, condoFee, yearBuilt,
            rentPrice, maintenanceFee, commission, debtBalance, remainingInstallments,
            usefulArea, privateArea, landArea, floors, buildingFloors, aptsPerFloor, suites, totalUnits, totalElevators,
            lat, lng,
            ...restBody
        } = req.body;

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
                images: images || [],
                amenities: amenities || [],
                documents: documents || [],
                neighborhoodId: neighborhoodId || undefined,
                featured: featured || false,

                // Parsed Numbers (Optional)
                iptu: iptu ? parseFloat(iptu) : undefined,
                condoFee: condoFee ? parseFloat(condoFee) : undefined,
                yearBuilt: yearBuilt ? parseInt(yearBuilt) : undefined,
                rentPrice: rentPrice ? parseFloat(rentPrice) : undefined,
                maintenanceFee: maintenanceFee ? parseFloat(maintenanceFee) : undefined,
                commission: commission ? parseFloat(commission) : undefined,
                debtBalance: debtBalance ? parseFloat(debtBalance) : undefined,
                usefulArea: usefulArea ? parseFloat(usefulArea) : undefined,
                privateArea: privateArea ? parseFloat(privateArea) : undefined,
                landArea: landArea ? parseFloat(landArea) : undefined,
                lat: lat ? parseFloat(lat) : undefined,
                lng: lng ? parseFloat(lng) : undefined,

                // Parsed Integers (Optional/Default)
                suites: suites ? parseInt(suites) : 0,
                remainingInstallments: remainingInstallments ? parseInt(remainingInstallments) : undefined,
                floors: floors ? parseInt(floors) : undefined,
                buildingFloors: buildingFloors ? parseInt(buildingFloors) : undefined,
                aptsPerFloor: aptsPerFloor ? parseInt(aptsPerFloor) : undefined,
                totalUnits: totalUnits ? parseInt(totalUnits) : undefined,
                totalElevators: totalElevators ? parseInt(totalElevators) : undefined,

                // Spread the rest (Booleans, Strings, String Arrays like exchangeOptions)
                ...restBody
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

        const floatFields = ['price', 'area', 'iptu', 'condoFee', 'rentPrice', 'maintenanceFee', 'commission', 'debtBalance', 'usefulArea', 'privateArea', 'landArea', 'lat', 'lng'];
        const intFields = ['bedrooms', 'bathrooms', 'garages', 'yearBuilt', 'suites', 'remainingInstallments', 'floors', 'buildingFloors', 'aptsPerFloor', 'totalUnits', 'totalElevators'];

        floatFields.forEach(field => {
            if (data[field] !== undefined) {
                if (data[field] === "" || data[field] === null) {
                    data[field] = null;
                } else {
                    data[field] = parseFloat(data[field]);
                    if (isNaN(data[field])) data[field] = null;
                }
            }
        });

        intFields.forEach(field => {
            if (data[field] !== undefined) {
                if (data[field] === "" || data[field] === null) {
                    data[field] = null;
                } else {
                    data[field] = parseInt(data[field]);
                    if (isNaN(data[field])) data[field] = null;
                }
            }
        });

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
