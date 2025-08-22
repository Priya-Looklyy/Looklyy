const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample brands
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { id: 'brand-1' },
      update: {},
      create: {
        id: 'brand-1',
        name: 'Fashion Forward',
        description: 'Trendy and modern fashion for the style-conscious',
        logoUrl: 'https://picsum.photos/100/100?random=1'
      }
    }),
    prisma.brand.upsert({
      where: { id: 'brand-2' },
      update: {},
      create: {
        id: 'brand-2',
        name: 'Classic Elegance',
        description: 'Timeless pieces with sophisticated design',
        logoUrl: 'https://picsum.photos/100/100?random=2'
      }
    }),
    prisma.brand.upsert({
      where: { id: 'brand-3' },
      update: {},
      create: {
        id: 'brand-3',
        name: 'Urban Street',
        description: 'Casual and comfortable streetwear',
        logoUrl: 'https://picsum.photos/100/100?random=3'
      }
    }),
    prisma.brand.upsert({
      where: { id: 'brand-4' },
      update: {},
      create: {
        id: 'brand-4',
        name: 'Luxury Couture',
        description: 'Premium designer fashion and accessories',
        logoUrl: 'https://picsum.photos/100/100?random=4'
      }
    })
  ])

  console.log(`✅ Created ${brands.length} brands`)

  // Create sample products with diverse colors
  const products = await Promise.all([
    // Red family products
    prisma.product.upsert({
      where: { id: 'product-1' },
      update: {},
      create: {
        id: 'product-1',
        name: 'Crimson Blouse',
        description: 'Elegant silk blouse in deep crimson',
        price: 89.99,
        imageUrl: 'https://picsum.photos/300/400?random=10',
        colors: ['#DC143C', '#B22222', '#8B0000'],
        brandId: 'brand-1'
      }
    }),
    prisma.product.upsert({
      where: { id: 'product-2' },
      update: {},
      create: {
        id: 'product-2',
        name: 'Ruby Red Dress',
        description: 'Stunning evening dress in ruby red',
        price: 199.99,
        imageUrl: 'https://picsum.photos/300/400?random=11',
        colors: ['#FF0000', '#DC143C', '#B22222'],
        brandId: 'brand-4'
      }
    }),

    // Blue family products
    prisma.product.upsert({
      where: { id: 'product-3' },
      update: {},
      create: {
        id: 'product-3',
        name: 'Navy Blue Suit',
        description: 'Professional navy blue business suit',
        price: 299.99,
        imageUrl: 'https://picsum.photos/300/400?random=12',
        colors: ['#000080', '#191970', '#00008B'],
        brandId: 'brand-2'
      }
    }),
    prisma.product.upsert({
      where: { id: 'product-4' },
      update: {},
      create: {
        id: 'product-4',
        name: 'Sky Blue Jeans',
        description: 'Comfortable jeans in sky blue',
        price: 79.99,
        imageUrl: 'https://picsum.photos/300/400?random=13',
        colors: ['#87CEEB', '#00BFFF', '#1E90FF'],
        brandId: 'brand-3'
      }
    }),

    // Green family products
    prisma.product.upsert({
      where: { id: 'product-5' },
      update: {},
      create: {
        id: 'product-5',
        name: 'Emerald Green Sweater',
        description: 'Cozy sweater in emerald green',
        price: 69.99,
        imageUrl: 'https://picsum.photos/300/400?random=14',
        colors: ['#50C878', '#00FF7F', '#32CD32'],
        brandId: 'brand-1'
      }
    }),
    prisma.product.upsert({
      where: { id: 'product-6' },
      update: {},
      create: {
        id: 'product-6',
        name: 'Forest Green Jacket',
        description: 'Warm jacket in forest green',
        price: 149.99,
        imageUrl: 'https://picsum.photos/300/400?random=15',
        colors: JSON.stringify(['#228B22', '#006400', '#008000']),
        brandId: 'brand-2'
      }
    }),

    // Purple family products
    prisma.product.upsert({
      where: { id: 'product-7' },
      update: {},
      create: {
        id: 'product-7',
        name: 'Lavender Scarf',
        description: 'Soft scarf in lavender',
        price: 39.99,
        imageUrl: 'https://picsum.photos/300/400?random=16',
        colors: JSON.stringify(['#E6E6FA', '#DDA0DD', '#D8BFD8']),
        brandId: 'brand-3'
      }
    }),
    prisma.product.upsert({
      where: { id: 'product-8' },
      update: {},
      create: {
        id: 'product-8',
        name: 'Royal Purple Handbag',
        description: 'Luxury handbag in royal purple',
        price: 299.99,
        imageUrl: 'https://picsum.photos/300/400?random=17',
        colors: JSON.stringify(['#800080', '#4B0082', '#8A2BE2']),
        brandId: 'brand-4'
      }
    }),

    // Orange family products
    prisma.product.upsert({
      where: { id: 'product-9' },
      update: {},
      create: {
        id: 'product-9',
        name: 'Coral Top',
        description: 'Vibrant coral top for summer',
        price: 59.99,
        imageUrl: 'https://picsum.photos/300/400?random=18',
        colors: JSON.stringify(['#FF7F50', '#FF6347', '#FF4500']),
        brandId: 'brand-1'
      }
    }),
    prisma.product.upsert({
      where: { id: 'product-10' },
      update: {},
      create: {
        id: 'product-10',
        name: 'Amber Jewelry',
        description: 'Beautiful amber jewelry set',
        price: 129.99,
        imageUrl: 'https://picsum.photos/300/400?random=19',
        colors: JSON.stringify(['#FFBF00', '#FFD700', '#FFA500']),
        brandId: 'brand-4'
      }
    }),

    // Yellow family products
    prisma.product.upsert({
      where: { id: 'product-11' },
      update: {},
      create: {
        id: 'product-11',
        name: 'Golden Yellow Dress',
        description: 'Bright yellow dress for special occasions',
        price: 159.99,
        imageUrl: 'https://picsum.photos/300/400?random=20',
        colors: JSON.stringify(['#FFFF00', '#FFD700', '#FFA500']),
        brandId: 'brand-2'
      }
    }),
    prisma.product.upsert({
      where: { id: 'product-12' },
      update: {},
      create: {
        id: 'product-12',
        name: 'Lemon Yellow Shirt',
        description: 'Fresh lemon yellow casual shirt',
        price: 49.99,
        imageUrl: 'https://picsum.photos/300/400?random=21',
        colors: JSON.stringify(['#FFFACD', '#FFFFE0', '#FFF8DC']),
        brandId: 'brand-3'
      }
    }),

    // Pink family products
    prisma.product.upsert({
      where: { id: 'product-13' },
      update: {},
      create: {
        id: 'product-13',
        name: 'Rose Pink Blouse',
        description: 'Elegant rose pink blouse',
        price: 89.99,
        imageUrl: 'https://picsum.photos/300/400?random=22',
        colors: JSON.stringify(['#FFB6C1', '#FFC0CB', '#FF69B4']),
        brandId: 'brand-1'
      }
    }),
    prisma.product.upsert({
      where: { id: 'product-14' },
      update: {},
      create: {
        id: 'product-14',
        name: 'Fuchsia Skirt',
        description: 'Bold fuchsia skirt for statement looks',
        price: 79.99,
        imageUrl: 'https://picsum.photos/300/400?random=23',
        colors: JSON.stringify(['#FF00FF', '#C71585', '#DB7093']),
        brandId: 'brand-4'
      }
    }),

    // Brown family products
    prisma.product.upsert({
      where: { id: 'product-15' },
      update: {},
      create: {
        id: 'product-15',
        name: 'Chocolate Brown Boots',
        description: 'Classic chocolate brown leather boots',
        price: 199.99,
        imageUrl: 'https://picsum.photos/300/400?random=24',
        colors: JSON.stringify(['#8B4513', '#A0522D', '#CD853F']),
        brandId: 'brand-2'
      }
    }),
    prisma.product.upsert({
      where: { id: 'product-16' },
      update: {},
      create: {
        id: 'product-16',
        name: 'Taupe Coat',
        description: 'Sophisticated taupe winter coat',
        price: 249.99,
        imageUrl: 'https://picsum.photos/300/400?random=25',
        colors: JSON.stringify(['#483D8B', '#696969', '#808080']),
        brandId: 'brand-3'
      }
    })
  ])

  console.log(`✅ Created ${products.length} products`)

  // Create a sample user for testing
  const hashedPassword = await bcrypt.hash('password123', 10)
  const user = await prisma.User.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
      passwordHash: hashedPassword,
      bio: 'A test user for development purposes',
              favoriteColors: ['Red', 'Blue', 'Green'],
        stylePreferences: JSON.stringify(['casual', 'streetwear']),
        favoriteBrands: JSON.stringify(['Fashion Forward', 'Classic Elegance']),
      clothingSize: 'M',
      shoeSize: '8',
      fitPreference: 'regular',
      notificationPreferences: JSON.stringify(['sales', 'new_arrivals']),
      privacySettings: JSON.stringify({ profileVisibility: 'public', wardrobeVisibility: 'friends' })
    }
  })

  console.log(`✅ Created test user: ${user.email}`)

  // Create a sample lookboard
  const lookboard = await prisma.lookboard.upsert({
    where: { id: 'lookboard-1' },
    update: {},
    create: {
      id: 'lookboard-1',
      title: 'Summer Vibes',
              images: [
        'https://picsum.photos/400/300?random=30',
        'https://picsum.photos/400/300?random=31',
        'https://picsum.photos/400/300?random=32'
              ],
      userId: user.id
    }
  })

  console.log(`✅ Created sample lookboard: ${lookboard.title}`)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
