"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProperty = exports.updateProperty = exports.getPropertyById = exports.getProperties = exports.createProperty = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const createProperty = async (req, res, next) => {
    try {
        const { title, description, price, area, bedrooms, bathrooms, garages, type, status, address, neighborhoodId, features, iptu, condoFee, yearBuilt, floorPlan } = req.body;
        const images = req.body.images || [];
        const amenities = req.body.amenities || [];
        const documents = req.body.documents || [];
        const property = await prisma_1.default.property.create({
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
    }
    catch (error) {
        next(error);
    }
};
exports.createProperty = createProperty;
const getProperties = async (req, res, next) => {
    try {
        const properties = await prisma_1.default.property.findMany({
            include: {
                neighborhood: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).json({ properties });
    }
    catch (error) {
        next(error);
    }
};
exports.getProperties = getProperties;
const getPropertyById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const property = await prisma_1.default.property.findUnique({
            where: { id: id },
            include: {
                neighborhood: true,
            }
        });
        if (!property) {
            return res.status(404).json({ error: "Imóvel não encontrado." });
        }
        res.status(200).json({ property });
    }
    catch (error) {
        next(error);
    }
};
exports.getPropertyById = getPropertyById;
const updateProperty = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        // Optional field parsing
        if (data.price)
            data.price = parseFloat(data.price);
        if (data.area)
            data.area = parseFloat(data.area);
        if (data.bedrooms)
            data.bedrooms = parseInt(data.bedrooms);
        if (data.bathrooms)
            data.bathrooms = parseInt(data.bathrooms);
        if (data.garages)
            data.garages = parseInt(data.garages);
        if (data.iptu)
            data.iptu = parseFloat(data.iptu);
        if (data.condoFee)
            data.condoFee = parseFloat(data.condoFee);
        if (data.yearBuilt)
            data.yearBuilt = parseInt(data.yearBuilt);
        const property = await prisma_1.default.property.update({
            where: { id: id },
            data,
        });
        res.status(200).json({ property });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProperty = updateProperty;
const deleteProperty = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma_1.default.property.delete({
            where: { id: id },
        });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProperty = deleteProperty;
