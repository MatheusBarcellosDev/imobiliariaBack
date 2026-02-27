import bcrypt from "bcryptjs";
import prisma from "../src/lib/prisma";

async function main() {
    console.log("Iniciando seed do banco de dados...");

    // Limpar os dados antes de semear (Cuidado em produção!)
    await prisma.lead.deleteMany();
    await prisma.property.deleteMany();
    await prisma.neighborhood.deleteMany();
    await prisma.user.deleteMany();

    // 1. Criar o usuário Admin (Corretor)
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = await prisma.user.upsert({
        where: { email: "admin@lorenalorenzo.com" },
        update: {},
        create: {
            name: "Lorena Lorenzo (Admin)",
            email: "admin@lorenalorenzo.com",
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    console.log(`✅ Usuário Admin criado. Email: admin@lorenalorenzo.com | Senha: admin123`);

    // 2. Criar Bairros Populares (Florianópolis / São José)
    const kobrasol = await prisma.neighborhood.create({
        data: {
            name: "Kobrasol",
            description: "Coração comercial e residencial de São José. Polo gastronômico e de serviços completo na Grande Florianópolis, oferecendo alto padrão de vida e conveniência.",
            image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=1200",
        }
    });

    const campinas = await prisma.neighborhood.create({
        data: {
            name: "Campinas",
            description: "Bairro nobre e histórico de São José, com uma incrível orla marítima recém-revitalizada, perfeita para caminhadas ao pôr do sol.",
            image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200",
        }
    });

    const barreiros = await prisma.neighborhood.create({
        data: {
            name: "Barreiros",
            description: "Uma região em grande expansão residencial, contando com centros de ensino, amplo comércio e fácil acesso à BR-101 e ilha de Floripa.",
            image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb65?auto=format&fit=crop&q=80&w=1200",
        }
    });

    const estreito = await prisma.neighborhood.create({
        data: {
            name: "Estreito",
            description: "Fronteira continental com a ilha, o Estreito possui vida própria com o novo Parque de Coqueiros/Estreito, oferecendo alto luxo de frente para o mar.",
            image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
        }
    });

    const coqueiros = await prisma.neighborhood.create({
        data: {
            name: "Coqueiros",
            description: "Bairro mais nobre e tradicional da região continental. Conhecido pela Via Gastronômica, calçadão beira-mar e vista inigualável da ponte Hercílio Luz.",
            image: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&q=80&w=1200",
        }
    });

    console.log(`✅ Bairros da Grande Florianópolis criados.`);

    // 3. Criar Imóveis
    await prisma.property.createMany({
        data: [
            {
                title: "Cobertura Skyline Kobrasol",
                description: "Magnífica cobertura no coração do Kobrasol com vista panorâmica para o mar e acabamentos importados.",
                price: 3500000,
                area: 280,
                bedrooms: 4,
                bathrooms: 5,
                garages: 3,
                type: "Cobertura",
                status: "AVAILABLE",
                images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
                featured: true,
                neighborhoodId: kobrasol.id
            },
            {
                title: "Apartamento Frente Mar Campinas",
                description: "Vista espetacular definitiva para a Beira-Mar de São José. Design assinado, varanda gourmet completa.",
                price: 2200000,
                area: 150,
                bedrooms: 3,
                bathrooms: 4,
                garages: 2,
                type: "Apartamento",
                status: "AVAILABLE",
                images: ["https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
                featured: true,
                neighborhoodId: campinas.id
            },
            {
                title: "Residência Contemporânea Coqueiros",
                description: "Projeto arquitetônico moderno em Coqueiros, integração total de ambientes na Via Gastronômica.",
                price: 4800000,
                area: 350,
                bedrooms: 4,
                bathrooms: 5,
                garages: 4,
                type: "Casa",
                status: "AVAILABLE",
                images: ["https://images.unsplash.com/photo-1588880331179-bc9b93a8cb65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"],
                featured: false,
                neighborhoodId: coqueiros.id
            }
        ]
    });

    console.log(`✅ Imóveis criados.`);

    // 4. Criar Leads Iniciais (Kanban Mockup)
    await prisma.lead.createMany({
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
    });

    console.log(`✅ Leads iniciais criados.`);
    console.log("Seed Concluído!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
