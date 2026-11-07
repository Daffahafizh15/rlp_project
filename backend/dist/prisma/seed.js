"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new client_1.PrismaClient();
const catalogOnly = process.argv.includes('--catalog-only');
async function main() {
    console.log(catalogOnly
        ? '🌱 Adding missing FORME catalog products...'
        : '🌱 Starting FORME database seeding...');
    if (!catalogOnly) {
        await prisma.payment.deleteMany();
        await prisma.orderItem.deleteMany();
        await prisma.order.deleteMany();
        await prisma.cartItem.deleteMany();
        await prisma.cart.deleteMany();
        await prisma.productImage.deleteMany();
        await prisma.productVariant.deleteMany();
        await prisma.product.deleteMany();
        await prisma.category.deleteMany();
        await prisma.address.deleteMany();
        await prisma.shippingZone.deleteMany();
        await prisma.user.deleteMany();
        console.log('🧹 Cleaned existing database records.');
    }
    if (!catalogOnly) {
        const passwordSalt = 10;
        const adminPasswordHash = await bcrypt.hash('AdminFORME2026!', passwordSalt);
        const customerPasswordHash = await bcrypt.hash('CustomerFORME2026!', passwordSalt);
        const adminUser = await prisma.user.create({
            data: {
                fullName: 'FORME Store Administrator',
                email: 'admin@forme.com',
                passwordHash: adminPasswordHash,
                phone: '081299990001',
                role: client_1.Role.ADMIN,
            },
        });
        const customerUser = await prisma.user.create({
            data: {
                fullName: 'Ahmad Pratama',
                email: 'customer@forme.com',
                passwordHash: customerPasswordHash,
                phone: '081288880002',
                role: client_1.Role.CUSTOMER,
                cart: {
                    create: {},
                },
            },
        });
        console.log(`👤 Users seeded: Admin (${adminUser.email}), Customer (${customerUser.email})`);
        const zoneJabodetabek = await prisma.shippingZone.create({
            data: {
                name: 'Zona 1 - Jabodetabek',
                description: 'Pengiriman area Jakarta, Bogor, Depok, Tangerang, Bekasi (1-2 hari kerja)',
                rate: 15000,
                isActive: true,
            },
        });
        const zoneJawaBali = await prisma.shippingZone.create({
            data: {
                name: 'Zona 2 - Jawa & Bali',
                description: 'Pengiriman area Pulau Jawa (luar Jabodetabek) dan Bali (2-3 hari kerja)',
                rate: 25000,
                isActive: true,
            },
        });
        const zoneLuarJawa = await prisma.shippingZone.create({
            data: {
                name: 'Zona 3 - Luar Jawa',
                description: 'Pengiriman seluruh wilayah Sumatera, Kalimantan, Sulawesi, Papua (3-5 hari kerja)',
                rate: 45000,
                isActive: true,
            },
        });
        console.log('🚚 3 Shipping Zones seeded (Jabodetabek, Jawa & Bali, Luar Jawa).');
        await prisma.address.create({
            data: {
                userId: customerUser.id,
                label: 'Rumah',
                recipientName: 'Ahmad Pratama',
                phoneNumber: '081288880002',
                fullAddress: 'Jl. Senopati Raya No. 45, Kebayoran Baru',
                city: 'Jakarta Selatan',
                province: 'DKI Jakarta',
                postalCode: '12190',
                shippingZoneId: zoneJabodetabek.id,
                isDefault: true,
            },
        });
    }
    const categoryStreetwear = await prisma.category.upsert({
        where: { slug: 'streetwear' },
        create: {
            name: 'Streetwear',
            slug: 'streetwear',
            description: 'Urban aesthetics, boxy fits, and statement garments designed for daily movement.',
            isActive: true,
        },
        update: {},
    });
    const categoryCasual = await prisma.category.upsert({
        where: { slug: 'casual' },
        create: {
            name: 'Casual',
            slug: 'casual',
            description: 'Effortless minimalism with premium breathable fabrics for relaxed living.',
            isActive: true,
        },
        update: {},
    });
    const categoryFormal = await prisma.category.upsert({
        where: { slug: 'formal' },
        create: {
            name: 'Formal',
            slug: 'formal',
            description: 'Tailored silhouettes, clean cuts, and structured garments for elevated occasions.',
            isActive: true,
        },
        update: {},
    });
    console.log('🏷️ 3 Categories seeded: Streetwear, Casual, Formal.');
    if (!catalogOnly ||
        !(await prisma.product.findUnique({ where: { slug: 'heavyweight-oversized-t-shirt' } }))) {
        await prisma.product.create({
            data: {
                categoryId: categoryStreetwear.id,
                name: 'Heavyweight Oversized T-Shirt',
                slug: 'heavyweight-oversized-t-shirt',
                description: 'Crafted from 280 GSM premium combed cotton with a dropped shoulder silhouette. Features a ribbed collar that retains shape wash after wash. The quintessential streetwear staple by FORME.',
                basePrice: 189000,
                isActive: true,
                images: {
                    create: [
                        {
                            imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
                            isPrimary: true,
                            sortOrder: 1,
                        },
                        {
                            imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
                            isPrimary: false,
                            sortOrder: 2,
                        },
                    ],
                },
                variants: {
                    create: [
                        { sku: 'STR-OVR-BLK-S', size: 'S', color: 'Vintage Black', price: 189000, stock: 25 },
                        { sku: 'STR-OVR-BLK-M', size: 'M', color: 'Vintage Black', price: 189000, stock: 35 },
                        { sku: 'STR-OVR-BLK-L', size: 'L', color: 'Vintage Black', price: 189000, stock: 40 },
                        { sku: 'STR-OVR-BLK-XL', size: 'XL', color: 'Vintage Black', price: 189000, stock: 20 },
                        { sku: 'STR-OVR-BLK-XXL', size: 'XXL', color: 'Vintage Black', price: 199000, stock: 15 },
                        { sku: 'STR-OVR-WHT-S', size: 'S', color: 'Off-White', price: 189000, stock: 20 },
                        { sku: 'STR-OVR-WHT-M', size: 'M', color: 'Off-White', price: 189000, stock: 30 },
                        { sku: 'STR-OVR-WHT-L', size: 'L', color: 'Off-White', price: 189000, stock: 35 },
                        { sku: 'STR-OVR-WHT-XL', size: 'XL', color: 'Off-White', price: 189000, stock: 15 },
                        { sku: 'STR-OVR-SGE-M', size: 'M', color: 'Sage Green', price: 189000, stock: 20 },
                        { sku: 'STR-OVR-SGE-L', size: 'L', color: 'Sage Green', price: 189000, stock: 25 },
                    ],
                },
            },
        });
    }
    if (!catalogOnly ||
        !(await prisma.product.findUnique({ where: { slug: 'signature-boxy-fleece-hoodie' } }))) {
        await prisma.product.create({
            data: {
                categoryId: categoryStreetwear.id,
                name: 'Signature Boxy Fleece Hoodie',
                slug: 'signature-boxy-fleece-hoodie',
                description: '400 GSM heavyweight brushed fleece with a double-layered structured hood. Finished with concealed side pockets and subtle FORME tonal embroidery on the sleeve cuff.',
                basePrice: 389000,
                isActive: true,
                images: {
                    create: [
                        {
                            imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
                            isPrimary: true,
                            sortOrder: 1,
                        },
                        {
                            imageUrl: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1000&auto=format&fit=crop',
                            isPrimary: false,
                            sortOrder: 2,
                        },
                    ],
                },
                variants: {
                    create: [
                        { sku: 'STR-HOD-BLK-S', size: 'S', color: 'Jet Black', price: 389000, stock: 15 },
                        { sku: 'STR-HOD-BLK-M', size: 'M', color: 'Jet Black', price: 389000, stock: 25 },
                        { sku: 'STR-HOD-BLK-L', size: 'L', color: 'Jet Black', price: 389000, stock: 30 },
                        { sku: 'STR-HOD-BLK-XL', size: 'XL', color: 'Jet Black', price: 389000, stock: 12 },
                        { sku: 'STR-HOD-GRY-M', size: 'M', color: 'Heather Grey', price: 389000, stock: 20 },
                        { sku: 'STR-HOD-GRY-L', size: 'L', color: 'Heather Grey', price: 389000, stock: 25 },
                        { sku: 'STR-HOD-GRY-XL', size: 'XL', color: 'Heather Grey', price: 389000, stock: 10 },
                    ],
                },
            },
        });
    }
    if (!catalogOnly ||
        !(await prisma.product.findUnique({ where: { slug: 'vanguard-graphic-acid-wash-tee' } }))) {
        await prisma.product.create({
            data: {
                categoryId: categoryStreetwear.id,
                name: 'Vanguard Graphic Acid Wash Tee',
                slug: 'vanguard-graphic-acid-wash-tee',
                description: 'Individually enzyme-washed for a distinct vintage texture. High-density screen print with the FORME typography and architectural geometric accents across the back.',
                basePrice: 219000,
                isActive: true,
                images: {
                    create: [
                        {
                            imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop',
                            isPrimary: true,
                            sortOrder: 1,
                        },
                    ],
                },
                variants: {
                    create: [
                        { sku: 'STR-GRP-CHR-M', size: 'M', color: 'Acid Charcoal', price: 219000, stock: 20 },
                        { sku: 'STR-GRP-CHR-L', size: 'L', color: 'Acid Charcoal', price: 219000, stock: 25 },
                        { sku: 'STR-GRP-CHR-XL', size: 'XL', color: 'Acid Charcoal', price: 219000, stock: 15 },
                    ],
                },
            },
        });
    }
    if (!catalogOnly ||
        !(await prisma.product.findUnique({ where: { slug: 'essential-supima-crewneck-tee' } }))) {
        await prisma.product.create({
            data: {
                categoryId: categoryCasual.id,
                name: 'Essential Supima Crewneck Tee',
                slug: 'essential-supima-crewneck-tee',
                description: '100% American Supima cotton with extra-long staple fibers for unparalleled softness and drape. Tailored standard fit perfect for layering or solo wear.',
                basePrice: 149000,
                isActive: true,
                images: {
                    create: [
                        {
                            imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000&auto=format&fit=crop',
                            isPrimary: true,
                            sortOrder: 1,
                        },
                    ],
                },
                variants: {
                    create: [
                        { sku: 'CSL-KOS-WHT-S', size: 'S', color: 'Pure White', price: 149000, stock: 30 },
                        { sku: 'CSL-KOS-WHT-M', size: 'M', color: 'Pure White', price: 149000, stock: 40 },
                        { sku: 'CSL-KOS-WHT-L', size: 'L', color: 'Pure White', price: 149000, stock: 35 },
                        { sku: 'CSL-KOS-NVY-M', size: 'M', color: 'Deep Navy', price: 149000, stock: 25 },
                        { sku: 'CSL-KOS-NVY-L', size: 'L', color: 'Deep Navy', price: 149000, stock: 30 },
                    ],
                },
            },
        });
    }
    if (!catalogOnly ||
        !(await prisma.product.findUnique({ where: { slug: 'relaxed-camp-collar-linen-shirt' } }))) {
        await prisma.product.create({
            data: {
                categoryId: categoryCasual.id,
                name: 'Relaxed Camp Collar Linen Shirt',
                slug: 'relaxed-camp-collar-linen-shirt',
                description: 'Woven from pure French flax linen. Features an open Cuban camp collar and subtle mother-of-pearl buttons. Unrestricted comfort for sunny days and warm evenings.',
                basePrice: 289000,
                isActive: true,
                images: {
                    create: [
                        {
                            imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop',
                            isPrimary: true,
                            sortOrder: 1,
                        },
                    ],
                },
                variants: {
                    create: [
                        { sku: 'CSL-KMJ-SND-S', size: 'S', color: 'Natural Sand', price: 289000, stock: 15 },
                        { sku: 'CSL-KMJ-SND-M', size: 'M', color: 'Natural Sand', price: 289000, stock: 25 },
                        { sku: 'CSL-KMJ-SND-L', size: 'L', color: 'Natural Sand', price: 289000, stock: 20 },
                        { sku: 'CSL-KMJ-OLV-M', size: 'M', color: 'Dusty Olive', price: 289000, stock: 20 },
                        { sku: 'CSL-KMJ-OLV-L', size: 'L', color: 'Dusty Olive', price: 289000, stock: 18 },
                    ],
                },
            },
        });
    }
    if (!catalogOnly ||
        !(await prisma.product.findUnique({ where: { slug: 'relaxed-tapered-chino-trousers' } }))) {
        await prisma.product.create({
            data: {
                categoryId: categoryCasual.id,
                name: 'Relaxed Tapered Chino Trousers',
                slug: 'relaxed-tapered-chino-trousers',
                description: 'Cotton-stretch twill fabric with an elasticated waistband and internal drawstring. Roomy through the thigh with a clean taper down to the ankle.',
                basePrice: 329000,
                isActive: true,
                images: {
                    create: [
                        {
                            imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop',
                            isPrimary: true,
                            sortOrder: 1,
                        },
                    ],
                },
                variants: {
                    create: [
                        { sku: 'CSL-CLN-KHK-S', size: 'S', color: 'Warm Khaki', price: 329000, stock: 20 },
                        { sku: 'CSL-CLN-KHK-M', size: 'M', color: 'Warm Khaki', price: 329000, stock: 30 },
                        { sku: 'CSL-CLN-KHK-L', size: 'L', color: 'Warm Khaki', price: 329000, stock: 25 },
                        { sku: 'CSL-CLN-CHR-M', size: 'M', color: 'Charcoal Grey', price: 329000, stock: 20 },
                        { sku: 'CSL-CLN-CHR-L', size: 'L', color: 'Charcoal Grey', price: 329000, stock: 22 },
                    ],
                },
            },
        });
    }
    if (!catalogOnly ||
        !(await prisma.product.findUnique({ where: { slug: 'structured-modern-tailored-blazer' } }))) {
        await prisma.product.create({
            data: {
                categoryId: categoryFormal.id,
                name: 'Structured Modern Tailored Blazer',
                slug: 'structured-modern-tailored-blazer',
                description: 'Italian wool-blend single-breasted blazer with notch lapels, pick stitching, and full satin interior lining. Designed with an assertive shoulder and sharp modern silhouette.',
                basePrice: 699000,
                isActive: true,
                images: {
                    create: [
                        {
                            imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
                            isPrimary: true,
                            sortOrder: 1,
                        },
                    ],
                },
                variants: {
                    create: [
                        { sku: 'FRM-BLZ-BLK-M', size: 'M', color: 'Midnight Black', price: 699000, stock: 15 },
                        { sku: 'FRM-BLZ-BLK-L', size: 'L', color: 'Midnight Black', price: 699000, stock: 20 },
                        { sku: 'FRM-BLZ-BLK-XL', size: 'XL', color: 'Midnight Black', price: 699000, stock: 10 },
                        { sku: 'FRM-BLZ-GRY-M', size: 'M', color: 'Slate Grey', price: 699000, stock: 12 },
                        { sku: 'FRM-BLZ-GRY-L', size: 'L', color: 'Slate Grey', price: 699000, stock: 15 },
                    ],
                },
            },
        });
    }
    if (!catalogOnly ||
        !(await prisma.product.findUnique({ where: { slug: 'slim-easy-iron-oxford-dress-shirt' } }))) {
        await prisma.product.create({
            data: {
                categoryId: categoryFormal.id,
                name: 'Slim Easy-Iron Oxford Dress Shirt',
                slug: 'slim-easy-iron-oxford-dress-shirt',
                description: '100-ply two-fold Egyptian cotton with a subtle luster and crease-resistant treatment. Features a spread collar and structured convertible cuffs.',
                basePrice: 299000,
                isActive: true,
                images: {
                    create: [
                        {
                            imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop',
                            isPrimary: true,
                            sortOrder: 1,
                        },
                    ],
                },
                variants: {
                    create: [
                        { sku: 'FRM-KMJ-WHT-S', size: 'S', color: 'Crisp White', price: 299000, stock: 25 },
                        { sku: 'FRM-KMJ-WHT-M', size: 'M', color: 'Crisp White', price: 299000, stock: 35 },
                        { sku: 'FRM-KMJ-WHT-L', size: 'L', color: 'Crisp White', price: 299000, stock: 30 },
                        { sku: 'FRM-KMJ-WHT-XL', size: 'XL', color: 'Crisp White', price: 299000, stock: 18 },
                        { sku: 'FRM-KMJ-BLU-M', size: 'M', color: 'Sky Blue', price: 299000, stock: 25 },
                        { sku: 'FRM-KMJ-BLU-L', size: 'L', color: 'Sky Blue', price: 299000, stock: 25 },
                    ],
                },
            },
        });
    }
    if (!catalogOnly ||
        !(await prisma.product.findUnique({ where: { slug: 'smart-tapered-wool-touch-trousers' } }))) {
        await prisma.product.create({
            data: {
                categoryId: categoryFormal.id,
                name: 'Smart Tapered Wool-Touch Trousers',
                slug: 'smart-tapered-wool-touch-trousers',
                description: 'Sharp front crease with side buckle adjusters and a tailored tapered leg. Engineered with anti-wrinkle poly-viscose for all-day crispness.',
                basePrice: 359000,
                isActive: true,
                images: {
                    create: [
                        {
                            imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop',
                            isPrimary: true,
                            sortOrder: 1,
                        },
                    ],
                },
                variants: {
                    create: [
                        { sku: 'FRM-CLN-BLK-S', size: 'S', color: 'Jet Black', price: 359000, stock: 20 },
                        { sku: 'FRM-CLN-BLK-M', size: 'M', color: 'Jet Black', price: 359000, stock: 30 },
                        { sku: 'FRM-CLN-BLK-L', size: 'L', color: 'Jet Black', price: 359000, stock: 25 },
                        { sku: 'FRM-CLN-NVY-M', size: 'M', color: 'Dark Navy', price: 359000, stock: 20 },
                        { sku: 'FRM-CLN-NVY-L', size: 'L', color: 'Dark Navy', price: 359000, stock: 20 },
                    ],
                },
            },
        });
    }
    console.log(catalogOnly
        ? '✨ Missing catalog products were added; existing products and unrelated data were preserved.'
        : '✨ 9 Products across Streetwear, Casual, and Formal seeded with variants and gallery images.');
    console.log('🎉 Seeding successfully finished!');
}
main()
    .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map