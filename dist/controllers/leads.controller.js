"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeadStatus = exports.getLeads = exports.createLead = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const createLead = async (req, res, next) => {
    try {
        const { name, email, phone, message, source } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: "Nome e e-mail são obrigatórios para um lead." });
        }
        const lead = await prisma_1.default.lead.create({
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
    }
    catch (error) {
        next(error);
    }
};
exports.createLead = createLead;
const getLeads = async (req, res, next) => {
    try {
        const leads = await prisma_1.default.lead.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).json({ leads });
    }
    catch (error) {
        next(error);
    }
};
exports.getLeads = getLeads;
const updateLeadStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, agentId } = req.body;
        const data = {};
        if (status)
            data.status = status;
        if (agentId)
            data.agentId = agentId;
        const lead = await prisma_1.default.lead.update({
            where: { id: id },
            data,
        });
        res.status(200).json({ lead });
    }
    catch (error) {
        next(error);
    }
};
exports.updateLeadStatus = updateLeadStatus;
