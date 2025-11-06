import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Import models
import Role from '../server/models/Role';
import User from '../server/models/User';
import Category from '../server/models/Category';
import Product from '../server/models/Product';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/metro';

console.log('🔗 Connecting to:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Role.deleteMany({}),
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create roles with upsert to prevent duplicates
    const roleData = [
      {
        name: 'admin',
        permissions: [
          { resource: 'product', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'category', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'order', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'user', actions: ['create', 'read', 'update', 'delete'] },
        ],
      },
      {
        name: 'seller',
        permissions: [
          { resource: 'product', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'category', actions: ['read'] },
          { resource: 'order', actions: ['read', 'update'] },
        ],
      },
      {
        name: 'customer',
        permissions: [
          { resource: 'product', actions: ['read'] },
          { resource: 'category', actions: ['read'] },
          { resource: 'order', actions: ['create', 'read'] },
        ],
      },
    ];

    // Use insertMany with ordered: false to continue on duplicates
    const roles = await Role.insertMany(roleData, { ordered: false }).catch(async (err) => {
      if (err.code === 11000) {
        // Duplicates exist, fetch existing roles
        console.log('⚠️  Roles already exist, using existing ones');
        return await Role.find({ name: { $in: roleData.map(r => r.name) } });
      }
      throw err;
    });

    console.log('✅ Created/Found roles:', roles.map((r: any) => r.name).join(', '));

    // Create admin user with upsert
    const adminRole = roles.find((r: any) => r.name === 'admin');
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    const adminUser = await User.findOneAndUpdate(
      { email: 'admin@metro.com' },
      {
        email: 'admin@metro.com',
        password: hashedPassword,
        name: 'Metro Admin',
        company: 'Metro HQ',
        role: adminRole!._id,
        metadata: {
          loginCount: 0,
        },
      },
      { upsert: true, new: true }
    );

    console.log('✅ Created/Updated admin user:', adminUser.email);
    console.log('   Password: Admin@123');

    // Create sample categories with upsert
    const categoryData = [
      { name: 'Electronics', description: 'Electronic devices and accessories' },
      { name: 'Clothing', description: 'Fashion and apparel' },
      { name: 'Books', description: 'Books and publications' },
      { name: 'Home & Garden', description: 'Home improvement and gardening' },
      { name: 'Sports', description: 'Sports equipment and accessories' },
    ];

    const categories = await Promise.all(
      categoryData.map((cat) =>
        Category.findOneAndUpdate(
          { name: cat.name },
          cat,
          { upsert: true, new: true }
        )
      )
    );

    console.log('✅ Created/Updated categories:', categories.map((c: any) => c.name).join(', '));

    // Create curated product catalogue
    const productSeed = [
      {
        name: 'Waveform Studio Chair',
        description: 'Ergonomic support with sculpted mesh and lumbar alignment for long creative sessions.',
        price: 279,
        stock: 18,
        category: 'Home & Garden',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
      },
      {
        name: 'Lumen Smart Diffuser',
        description: 'App-connected aromatherapy with sunrise lighting and adaptive humidity sensors.',
        price: 129,
        stock: 42,
        category: 'Home & Garden',
        image: 'https://images.unsplash.com/photo-1553531888-a5d4393f5c86?auto=format&fit=crop&w=900&q=80',
      },
      {
        name: 'Underline Modular Sofa',
        description: 'Modular sofa with boucle upholstery and hidden storage for streamlined living rooms.',
        price: 1480,
        stock: 6,
        category: 'Home & Garden',
        image: 'https://images.unsplash.com/photo-1616628182503-8c0b1ef14a07?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Shift Noise-Cancelling Headphones',
        description: 'Studio-grade ANC headphones with dual device pairing and 30-hour battery life.',
        price: 349,
        stock: 28,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Aster Linen Overshirt',
        description: 'Relaxed linen overshirt with corozo buttons and garment-dyed finish.',
        price: 118,
        stock: 34,
        category: 'Clothing',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
      },
      {
        name: 'Arc Smart Kettle',
        description: 'Precision temperature kettle with matte finish and programmable brew profiles.',
        price: 189,
        stock: 21,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31b?auto=format&fit=crop&w=900&q=80',
      },
    ];

    const categoryMap = categories.reduce((map: Record<string, string>, category: any) => {
      map[category.name] = category._id.toString();
      return map;
    }, {} as Record<string, string>);

    await Product.insertMany(
      productSeed.map((item) => ({
        ...item,
        category: categoryMap[item.category],
      }))
    );

    console.log('✅ Seeded curated product catalogue');

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📝 You can now:');
    console.log('   1. Login as admin: admin@metro.com / Admin@123');
    console.log('   2. Register new customers/sellers via API');
    console.log('   3. Create products and start testing\n');

  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

seed();
