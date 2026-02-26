"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var hashedPassword, adminUser, neighborhood1, neighborhood2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Iniciando seed do banco de dados...");
                    // Limpar os dados antes de semear (Cuidado em produção!)
                    return [4 /*yield*/, prisma.lead.deleteMany()];
                case 1:
                    // Limpar os dados antes de semear (Cuidado em produção!)
                    _a.sent();
                    return [4 /*yield*/, prisma.property.deleteMany()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.neighborhood.deleteMany()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prisma.user.deleteMany()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, bcryptjs_1.default.hash("admin123", 10)];
                case 5:
                    hashedPassword = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: "admin@lorenalorenzo.com" },
                            update: {},
                            create: {
                                name: "Lorena Lorenzo (Admin)",
                                email: "admin@lorenalorenzo.com",
                                password: hashedPassword,
                                role: "ADMIN",
                            },
                        })];
                case 6:
                    adminUser = _a.sent();
                    console.log("\u2705 Usu\u00E1rio Admin criado. Email: admin@lorenalorenzo.com | Senha: admin123");
                    return [4 /*yield*/, prisma.neighborhood.create({
                            data: {
                                name: "Jardim Europa",
                                description: "Um dos bairros mais nobres de São Paulo, conhecido por suas mansões e ruas arborizadas.",
                                image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200",
                            }
                        })];
                case 7:
                    neighborhood1 = _a.sent();
                    return [4 /*yield*/, prisma.neighborhood.create({
                            data: {
                                name: "Vila Nova Conceição",
                                description: "Localizado ao lado do Parque do Ibirapuera, com os edifícios de mais alto luxo do Brasil.",
                                image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=1200",
                            }
                        })];
                case 8:
                    neighborhood2 = _a.sent();
                    console.log("\u2705 Bairros criados.");
                    // 3. Criar Imóveis
                    return [4 /*yield*/, prisma.property.createMany({
                            data: [
                                {
                                    title: "Mansão Jardim Europa",
                                    description: "Magnífica mansão em rua fechada com segurança dupla. Acabamentos importados.",
                                    price: 35000000,
                                    area: 1200,
                                    bedrooms: 5,
                                    bathrooms: 8,
                                    garages: 6,
                                    type: "Casa",
                                    status: "AVAILABLE",
                                    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
                                    featured: true,
                                    neighborhoodId: neighborhood1.id
                                },
                                {
                                    title: "Cobertura Duplex Parque Ibirapuera",
                                    description: "Vista espetacular em 360º para a copa das árvores. Design assinado.",
                                    price: 42000000,
                                    area: 850,
                                    bedrooms: 4,
                                    bathrooms: 6,
                                    garages: 5,
                                    type: "Apartamento",
                                    status: "AVAILABLE",
                                    images: ["https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
                                    featured: true,
                                    neighborhoodId: neighborhood2.id
                                },
                                {
                                    title: "Residência Contemporânea Cidade Jardim",
                                    description: "Projeto arquitetônico moderno, integração total de ambientes com a natureza.",
                                    price: 28000000,
                                    area: 900,
                                    bedrooms: 4,
                                    bathrooms: 5,
                                    garages: 4,
                                    type: "Casa",
                                    status: "AVAILABLE", /* ou algo como Venda */
                                    images: ["https://images.unsplash.com/photo-1588880331179-bc9b93a8cb65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
                                    featured: false,
                                    neighborhoodId: neighborhood1.id
                                }
                            ]
                        })];
                case 9:
                    // 3. Criar Imóveis
                    _a.sent();
                    console.log("\u2705 Im\u00F3veis criados.");
                    // 4. Criar Leads Iniciais (Kanban Mockup)
                    return [4 /*yield*/, prisma.lead.createMany({
                            data: [
                                {
                                    name: "Carlos Eduardo",
                                    email: "carlos@exemplo.com",
                                    phone: "+55 11 99999-9999",
                                    source: "Mansão Jardim Europa",
                                    status: "CONTATO_INICIAL",
                                    message: "Adoraria ver esta propriedade o mais rápido possível.",
                                },
                                {
                                    name: "Ana Beatriz",
                                    email: "ana.beatriz@exemplo.com",
                                    phone: "+55 11 98888-8888",
                                    source: "Direto (Via Chat)",
                                    status: "FECHADO",
                                    message: "Poderíamos elaborar a minuta do contrato para a cobertura?",
                                },
                                {
                                    name: "Felipe Mendes",
                                    email: "felipe.m@exemplo.com",
                                    source: "Campanha Instagram",
                                    status: "PROPOSTA",
                                    message: "Qual o menor valor à vista?",
                                }
                            ]
                        })];
                case 10:
                    // 4. Criar Leads Iniciais (Kanban Mockup)
                    _a.sent();
                    console.log("\u2705 Leads iniciais criados.");
                    console.log("Seed Concluído!");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
