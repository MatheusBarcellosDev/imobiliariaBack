"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
// Middlewares globais
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Arquivos Estáticos (Uploads locais de Imagens e Documentos)
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../../public/uploads")));
// Rotas
// Rotas
app.use("/api", routes_1.default);
// Rota raiz / Health check
app.get("/", (req, res) => {
    res.status(200).json({ status: "ok", message: "Imobiliária Lorena Lorenzo API Is Running!" });
});
// Tratamento de erros
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err);
    res.status(err.status || 500).json({
        error: err.message || "Erro interno do servidor.",
    });
});
app.listen(port, () => {
    console.log(`[Servidor] Rodando na porta ${port}`);
});
