"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const supabase_1 = require("../lib/supabase");
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
// Garantir que a pasta de uploads exista (como Fallback Local)
const uploadDir = path_1.default.join(__dirname, "../../../public/uploads");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Configuração do Multer (Armazenamento em Memória para o Supabase)
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// Rota de Upload
router.post("/", upload.array("files", 15), async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: "Nenhum arquivo enviado." });
        }
        const urls = [];
        // Verifica se O supabase tá configurado. Se não, salva no disco (fallback).
        if (!supabase_1.supabase) {
            console.warn("Supabase não configurado. Realizando upload no disco local como Fallback.");
            for (const file of files) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = path_1.default.extname(file.originalname);
                const filename = `file_${uniqueSuffix}${ext}`;
                const localPath = path_1.default.join(uploadDir, filename);
                fs_1.default.writeFileSync(localPath, file.buffer);
                urls.push(`/uploads/${filename}`);
            }
            return res.status(200).json({ urls });
        }
        // --- Fluxo Principal: Supabase Storage ---
        for (const file of files) {
            const ext = path_1.default.extname(file.originalname);
            // Monta o nome sanitizado e único, separado por pasta de timestamp para evitar colisões pesadas
            const filename = `${Date.now()}_${(0, uuid_1.v4)()}${ext}`;
            console.log(`Subindo arquivo para Supabase: ${filename}`);
            const { data, error } = await supabase_1.supabase
                .storage
                .from('documentosfotos') // NOME DO BUCKET (CORRIGIDO)
                .upload(filename, file.buffer, {
                contentType: file.mimetype,
                cacheControl: '3600',
                upsert: false
            });
            if (error) {
                console.error("Erro no Supabase Upload:", error);
                throw error;
            }
            // Gerar a URL Pública oficial do objeto no Supabase
            const { data: publicUrlData } = supabase_1.supabase
                .storage
                .from('documentosfotos')
                .getPublicUrl(filename);
            urls.push(publicUrlData.publicUrl);
        }
        res.status(200).json({ urls });
    }
    catch (error) {
        console.error("Erro no upload de arquivos:", error);
        res.status(500).json({ error: "Erro interno ao processar uploads. Verifique se o bucket 'properties' existe e é público no Supabase." });
    }
});
exports.default = router;
