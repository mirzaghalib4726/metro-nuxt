# 🚀 Quick Start Guide

Get your Metro e-commerce platform running in 5 minutes!

## Prerequisites

- Node.js (v18+)
- MongoDB installed and running
- npm or yarn

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Or create `.env` manually with:

```env
MONGODB_URI=mongodb://localhost:27017/metro
JWT_SECRET=change-this-to-a-random-secret-key
JWT_EXPIRES_IN=7d
API_BASE_URL=/api
```

### 3. Start MongoDB

**macOS (Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
```bash
net start MongoDB
```

**Or run directly:**
```bash
mongod
```

### 4. Seed the Database

```bash
npm run seed
```

This creates:
- ✅ 3 roles (admin, seller, customer)
- ✅ Admin user (admin@metro.com / Admin@123)
- ✅ 5 sample categories

### 5. Start the Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

## 🧪 Test the API

### 1. Login as Admin

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@metro.com",
    "password": "Admin@123"
  }'
```

Copy the `token` from the response.

### 2. Get Categories

```bash
curl http://localhost:3000/api/categories
```

### 3. Create a Product

```bash
# First, get a category ID from the previous request
# Then replace <CATEGORY_ID> and <YOUR_TOKEN> below

curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "name": "MacBook Pro",
    "description": "Apple M3 chip, 16GB RAM",
    "price": 2499.99,
    "category": "<CATEGORY_ID>",
    "stock": 5
  }'
```

### 4. Register a Customer

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "Customer@123",
    "role": "customer"
  }'
```

### 5. List Products

```bash
curl http://localhost:3000/api/products
```

## 📱 Using Postman/Insomnia

1. Import the base URL: `http://localhost:3000`
2. Create a collection with these endpoints
3. Set Authorization header: `Bearer <token>`
4. Start testing!

## 🎯 Next Steps

- [ ] Explore the API endpoints in the main README
- [ ] Build a frontend with Vue/Nuxt
- [ ] Add more products and categories
- [ ] Test the order flow
- [ ] Customize roles and permissions

## 🐛 Troubleshooting

**MongoDB connection error?**
- Check if MongoDB is running: `mongod --version`
- Verify connection string in `.env`

**Port 3000 already in use?**
- Change port: `PORT=3001 npm run dev`

**Seed script fails?**
- Make sure MongoDB is running
- Drop the database: `mongosh metro --eval "db.dropDatabase()"`
- Run seed again: `npm run seed`

**TypeScript errors in IDE?**
- Run: `npm run postinstall`
- Restart your IDE

## 📚 Learn More

Check out the full [README.md](./README.md) for:
- Complete API documentation
- NestJS comparison guide
- Security best practices
- Project structure details

---

**Need help?** Open an issue or check the documentation!
