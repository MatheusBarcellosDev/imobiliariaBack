import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { supabase } from "../lib/supabase";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// Garantir que a pasta de uploads exista (como Fallback Local)
const uploadDir = path.join(__dirname, "../../../public/uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do Multer (Armazenamento em Memória para o Supabase)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Rota de Upload
router.post("/", upload.array("files", 15), async (req: Request, res: Response): Promise<any> => {
    try {
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({ error: "Nenhum arquivo enviado." });
        }

        const urls: string[] = [];

        // Verifica se O supabase tá configurado. Se não, salva no disco (fallback).
        if (!supabase) {
            console.warn("Supabase não configurado. Realizando upload no disco local como Fallback.");

            for (const file of files) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = path.extname(file.originalname);
                const filename = `file_${uniqueSuffix}${ext}`;
                const localPath = path.join(uploadDir, filename);

                fs.writeFileSync(localPath, file.buffer);
                urls.push(`/uploads/${filename}`);
            }

            return res.status(200).json({ urls });
        }

        // --- Fluxo Principal: Supabase Storage ---
        for (const file of files) {
            const ext = path.extname(file.originalname);
            // Monta o nome sanitizado e único, separado por pasta de timestamp para evitar colisões pesadas
            const filename = `${Date.now()}_${uuidv4()}${ext}`;

            console.log(`Subindo arquivo para Supabase: ${filename}`);

            const { data, error } = await supabase
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
            const { data: publicUrlData } = supabase
                .storage
                .from('documentosfotos')
                .getPublicUrl(filename);

            urls.push(publicUrlData.publicUrl);
        }

        res.status(200).json({ urls });
    } catch (error: any) {
        console.error("Erro no upload de arquivos:", error);
        res.status(500).json({ error: "Erro interno ao processar uploads. Verifique se o bucket 'properties' existe e é público no Supabase." });
    }
});

export default router;
