import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { GoogleGenAI } from "@google/genai";

// Placeholder setup for the AI Chatbot Controller
// For now, it will return a static greeting or echo the user's message
export const handleChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Mensagem é obrigatória." });
        }

        // Tenta usar a IA do Gemini ativamente caso tenha a API Key configurada
        if (process.env.GEMINI_API_KEY) {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

                // RAG: Buscando contexto de imóveis recentes/destaques
                const properties = await prisma.property.findMany({
                    where: { status: "AVAILABLE" },
                    take: 5,
                    orderBy: { featured: "desc" }
                });

                const propertiesContext = properties.map(p =>
                    `- ${p.title} (${p.type}): R$ ${p.price.toLocaleString('pt-BR')}. ${p.bedrooms} quartos, ${p.area}m2. ID Interno: ${p.id}`
                ).join("\n");

                const systemInstruction = `Você é a Assistente Virtual Oficial da Imobiliária Lorena Lorenzo (focada em imóveis de altíssimo padrão). 
Seja extremamente polida, empática e prestativa, com tom de Concierge.
Seu objetivo é ajudar os clientes a encontrar seus lares e, se perceber intenção de compra ou forte interesse, solicitar o e-mail ou telefone para que um Corretor Senior entre em contato.
Aqui estão alguns imóveis em destaque no momento (recomende-os se fizer sentido):
${propertiesContext}

Lembre-se: Não invente propriedades que não estão na lista acima. Se o cliente pedir algo muito fora, diga que nossa curadoria off-market tem mais opções e peça o contato dele.`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: message,
                    config: {
                        systemInstruction,
                        temperature: 0.7,
                    }
                });

                if (response.text) {

                    // Captura e-mails mesmo pelo texto da I.A pra salvar no Banco
                    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
                    const foundEmails = message.match(emailRegex);

                    if (foundEmails && foundEmails.length > 0) {
                        const email = foundEmails[0];
                        await prisma.lead.create({
                            data: {
                                name: "Visitante Conversacional",
                                email: email,
                                source: "Bot Inteligente (IA)",
                                message: message,
                                status: "NOVO"
                            }
                        });
                    }

                    return res.status(200).json({ reply: response.text });
                }
            } catch (aiError) {
                console.error("Falha ao usar Gemini API (Fallback ativado):", aiError);
            }
        }

        // TODO: In the next step, we will connect this to an LLM passing the properties context.
        // For now, simple mock/heuristic response:
        let botResponse = "Olá! Sou a assistente virtual da Lorena Lorenzo. Em que posso te ajudar a encontrar seu novo lar hoje?";

        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
        const foundEmails = message.match(emailRegex);

        if (foundEmails && foundEmails.length > 0) {
            const email = foundEmails[0];
            // Captura o Lead!
            await prisma.lead.create({
                data: {
                    name: "Visitante (Chat IA)",
                    email: email,
                    source: "Bot Conversacional IA",
                    message: message,
                    status: "NOVO" // Ajuste baseado no id do Kanban Dashboard
                }
            });
            botResponse = `Perfeito! Registrei seu e-mail (${email}). Um de nossos corretores especialistas de alto padrão entrará em contato em breve para apresentar opções exclusivas.`;
        } else if (message.toLowerCase().includes("corretor") || message.toLowerCase().includes("atendimento") || message.toLowerCase().includes("contato")) {
            botResponse = "Com certeza! Para que um corretor possa lhe oferecer um atendimento personalizado e enviar opções off-market, qual é o seu e-mail ou WhatsApp?";
        } else if (message.toLowerCase().includes("preço") || message.toLowerCase().includes("valor")) {
            botResponse = "Nossos imóveis variam de R$ 5 Milhões a R$ 80 Milhões, focados em alto padrão. Você tem uma faixa de valor em mente?";
        } else if (message.length > 10 && !message.toLowerCase().includes("olá")) {
            botResponse = `Entendi que você procura propriedades com essas características. Para receber uma seleção curada diretamente do nosso portfólio restrito, por favor, me informe seu e-mail.`;
        }

        res.status(200).json({
            reply: botResponse
        });

    } catch (error) {
        console.error("Erro no chat controller:", error);
        next(error);
    }
};
