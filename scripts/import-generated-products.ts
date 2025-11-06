import { promises as fs } from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import { config } from 'dotenv';

import Category from '../server/models/Category';
import Product from '../server/models/Product';

config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/metro';
const DATA_FILE = path.resolve(process.cwd(), 'data/generated-products.json');

type RawProduct = {
  productName: string;
  productDescription?: string;
  price: string;
  department?: string;
  product?: string;
  productMaterial?: string;
  isbn?: string;
};

const departmentCorrections: Record<string, string> = {
  jewelery: 'Jewelry',
  grocery: 'Grocery & Gourmet',
  music: 'Music & Audio',
  games: 'Games & Entertainment',
  beauty: 'Beauty & Wellness',
  kids: "Kids' Collection",
  baby: 'Baby Essentials',
  outdoors: 'Outdoors & Adventure',
  electronics: 'Electronics',
  computers: 'Computers & Tablets',
  automotive: 'Automotive',
  garden: 'Garden & Patio',
  sports: 'Sports & Fitness',
  books: 'Books & Stationery',
  clothing: 'Clothing & Apparel',
  home: 'Home & Living',
  shoes: 'Shoes & Accessories',
  toys: 'Toys & Learning',
};

const categoryImageMap: Record<string, string> = {
  'Electronics': 'https://images.unsplash.com/photo-1510552776732-03e61cf4b144?auto=format&fit=crop&w=1200&q=80',
  'Music & Audio': 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
  'Games & Entertainment': 'https://images.unsplash.com/photo-1580128637393-f289c0dc5b6b?auto=format&fit=crop&w=1200&q=80',
  'Clothing & Apparel': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
  'Jewelry': 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1200&q=80',
  'Beauty & Wellness': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
  'Home & Living': 'https://images.unsplash.com/photo-1616627457224-4a96e0c3fdbc?auto=format&fit=crop&w=1200&q=80',
  'Grocery & Gourmet': 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1200&q=80',
  'Books & Stationery': 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1200&q=80',
  'Sports & Fitness': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
  "Kids' Collection": 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
  'Baby Essentials': 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80',
  'Outdoors & Adventure': 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?auto=format&fit=crop&w=1200&q=80',
  'Automotive': 'https://images.unsplash.com/photo-1503739171234-22d547d351f9?auto=format&fit=crop&w=1200&q=80',
  'Garden & Patio': 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=1200&q=80',
  'Computers & Tablets': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
  'Shoes & Accessories': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
  'Toys & Learning': 'https://images.unsplash.com/photo-1610530532171-9861932f67a6?auto=format&fit=crop&w=1200&q=80',
};

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function canonicalDepartment(value?: string) {
  const fallback = 'General';
  if (!value) return fallback;

  const trimmed = value.trim();
  if (!trimmed) return fallback;

  const correction =
    departmentCorrections[trimmed.toLowerCase()] ??
    departmentCorrections[trimmed.replace(/[^a-zA-Z]/g, '').toLowerCase()];

  if (correction) return correction;

  return toTitleCase(trimmed);
}

function parsePrice(value: string) {
  const normalized = parseFloat(value.replace(/[^0-9.]/g, ''));
  if (Number.isNaN(normalized)) {
    return 0;
  }
  return Math.round(normalized * 100) / 100;
}

function computeStockKey(input: string) {
  return input.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function deriveStock(name: string) {
  const base = 12;
  const spread = 60;
  const stock = base + (computeStockKey(name) % spread);
  return stock;
}

function pickProductImage(categoryName: string, raw: RawProduct) {
  if (categoryImageMap[categoryName]) {
    return categoryImageMap[categoryName];
  }

  const keywords = [
    categoryName,
    raw.product,
    raw.productMaterial,
  ]
    .filter(Boolean)
    .join(',');

  return `https://source.unsplash.com/featured/?${encodeURIComponent(keywords || 'retail,product')}`;
}

async function loadData(): Promise<RawProduct[]> {
  const fileBuffer = await fs.readFile(DATA_FILE, 'utf8');
  const parsed = JSON.parse(fileBuffer);

  if (!Array.isArray(parsed)) {
    throw new Error('Expected an array of products in generated-products.json');
  }

  return parsed;
}

function normalizeDepartmentKey(value?: string) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : 'General';
}

async function ensureCategories(departments: string[]) {
  const map = new Map<string, mongoose.Types.ObjectId>();

  for (const department of departments) {
    const key = normalizeDepartmentKey(department);
    const name = canonicalDepartment(key);
    const description = `Curated ${name.toLowerCase()} picks imported from the sample catalogue.`;
    const category = await Category.findOneAndUpdate(
      { name },
      {
        $setOnInsert: { description },
      },
      { new: true, upsert: true }
    );

    map.set(key, category._id);
  }

  return map;
}

async function importProducts(rawProducts: RawProduct[]) {
  const departments = Array.from(
    new Set(rawProducts.map((item) => normalizeDepartmentKey(item.department)))
  );

  const categoryMap = await ensureCategories(departments);

  let created = 0;
  let updated = 0;

  for (const raw of rawProducts) {
    const now = new Date();
    const name = raw.productName.trim();
    const description =
      raw.productDescription?.trim() ??
      `Discover the ${name}, curated by Metro for discerning shoppers.`;
    const price = parsePrice(raw.price);
    const categoryId = categoryMap.get(normalizeDepartmentKey(raw.department));
    const stock = deriveStock(name);
    const image = pickProductImage(canonicalDepartment(raw.department), raw);

    const result = await Product.findOneAndUpdate(
      { name },
      {
        $set: {
          description,
          price,
          stock,
          category: categoryId,
          image,
          'metadata.updatedAt': now,
        },
        $setOnInsert: {
          name,
          'metadata.createdAt': now,
        },
      },
      {
        new: true,
        upsert: true,
        rawResult: true,
        setDefaultsOnInsert: true,
      }
    );

    if (result?.lastErrorObject?.updatedExisting) {
      updated += 1;
    } else {
      created += 1;
    }
  }

  return { created, updated };
}

async function main() {
  console.log('🔗 Connecting to MongoDB…');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected');

  try {
    const rawProducts = await loadData();
    console.log(`📦 Loaded ${rawProducts.length} generated products`);

    const { created, updated } = await importProducts(rawProducts);

    console.log(`\n🎉 Import complete!`);
    console.log(`   ➕ Created: ${created}`);
    console.log(`   ♻️  Updated: ${updated}`);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exitCode = 1;
});
