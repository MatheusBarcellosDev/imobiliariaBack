import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import mainRoutes from "./routes";

const app = express();
const port = process.env.PORT || 4000;

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos Estáticos (Uploads locais de Imagens e Documentos)
app.use("/uploads", express.static(path.join(__dirname, "../../public/uploads")));

// Rotas
// Rotas
app.use("/api", mainRoutes);

// Rota raiz / Health check
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok", message: "Imobiliária Lorena Lorenzo API Is Running!" });
});

// Tratamento de erros
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Global Error Handler:", err);
    res.status(err.status || 500).json({
        error: err.message || "Erro interno do servidor.",
    });
});

app.listen(port, () => {
    console.log(`[Servidor] Rodando na porta ${port}`);
});
