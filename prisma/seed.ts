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

    // 2. Criar Bairros Populares
    const neighborhood1 = await prisma.neighborhood.create({
        data: {
            name: "Jardim Europa",
            description: "Um dos bairros mais nobres de São Paulo, conhecido por suas mansões e ruas arborizadas.",
            image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200",
        }
    });

    const neighborhood2 = await prisma.neighborhood.create({
        data: {
            name: "Vila Nova Conceição",
            description: "Localizado ao lado do Parque do Ibirapuera, com os edifícios de mais alto luxo do Brasil.",
            image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=1200",
        }
    });

    console.log(`✅ Bairros criados.`);

    // 3. Criar Imóveis
    await prisma.property.createMany({
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
