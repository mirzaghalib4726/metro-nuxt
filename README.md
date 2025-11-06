# Metro - E-Commerce Platform

A full-stack e-commerce platform built with **Nuxt 4** and **MongoDB**, featuring role-based authentication, product management, and order processing.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Seller, Customer)
  - Bcrypt password hashing
  - Secure password validation

- **User Management**
  - User registration (Customer/Seller)
  - Admin creation (restricted)
  - User profiles with metadata

- **Product Management**
  - CRUD operations for products
  - Category organization
  - Stock management
  - Search and filtering
- **Dashboard & Analytics**
  - Admin-only overview with live catalogue metrics
  - Recent order feed and 30-day revenue snapshot
  - Quick access to pending fulfilment stats

- **Order System**
  - Order creation and tracking
  - Stock validation
  - Order history
  - Status management
  - Frontend checkout integrates directly with `/api/v1/orders`

- **Categories**
  - Hierarchical category structure
  - Parent-child relationships

## 🛠️ Tech Stack

- **Frontend/Backend**: Nuxt 4 (Vue 3)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Bcrypt
- **Validation**: Zod
- **State Management**: Pinia
- **Language**: TypeScript

## 📁 Project Structure

```
metro/
├── server/                 # Backend (Nuxt server directory)
│   ├── api/               # API routes (auto-routed)
│   │   ├── auth/          # Authentication endpoints
│   │   ├── products/      # Product CRUD
│   │   ├── categories/    # Category management
│   │   └── orders/        # Order processing
│   ├── models/            # Mongoose models
│   │   ├── User.ts
│   │   ├── Role.ts
│   │   ├── Product.ts
│   │   ├── Category.ts
│   │   └── Order.ts
│   ├── utils/             # Utility functions
│   │   ├── auth.ts        # JWT & password utilities
│   │   └── validation.ts  # Zod schemas
│   ├── plugins/           # Server plugins
│   │   └── database.ts    # MongoDB connection
│   └── middleware/        # Server middleware
├── app/                   # Frontend (Nuxt app directory)
├── scripts/               # Utility scripts
│   ├── seed.ts            # Base seed (roles, admin, curated samples)
│   └── import-generated-products.ts  # Bulk importer for generated catalogue data
└── nuxt.config.ts        # Nuxt configuration
```

## 🔧 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/metro

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# API
API_BASE_URL=/api/v1
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Or run directly
mongod
```

### 4. Seed Core Data

Populate the database with initial roles, admin user, and curated sample categories:

```bash
npm run seed
```

**Default Admin Credentials:**
- Email: `admin@metro.com`
- Password: `Admin@123`

### 5. Import Sample Catalogue (optional)

Use the generated dataset (`data/generated-products.json`) to create categories and products that mirror the Metro storefront experience:

```bash
npm run import:products
```

The importer will:

- Ensure categories exist for each department in the dataset (creating them if needed).
- Convert price strings to numbers and assign consistent stock levels.
- Upsert products so the command is safe to run multiple times.

Run it after `npm run seed` whenever you want to refresh the demo catalogue.

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user (customer/seller) | No |
| POST | `/api/v1/auth/login` | Login user | No |
| GET | `/api/v1/auth/me` | Get current user info | Yes |

### Products

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/products` | List all products (supports query filters) | No |
| GET | `/api/v1/products/:id` | Get single product | No |
| POST | `/api/v1/products` | Create product | Yes (Admin/Seller) |
| PUT | `/api/v1/products/:id` | Update product | Yes (Admin/Seller) |
| DELETE | `/api/v1/products/:id` | Delete product | Yes (Admin/Seller) |

### Categories

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/categories` | List all categories | No |
| POST | `/api/v1/categories` | Create category | Yes (Admin) |

### Orders

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/orders` | List user's orders | Yes |
| POST | `/api/v1/orders` | Create new order | Yes |

## 🔐 Authentication

All authenticated requests must include a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 API Request Examples

### Register a Customer

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "Password@123",
    "role": "customer"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@metro.com",
    "password": "Admin@123"
  }'
```

### Create a Product

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "category": "<category-id>",
    "stock": 10
  }'
```

### Create an Order

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "items": [
      {
        "product": "<product-id>",
        "quantity": 2,
        "price": 999.99
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    }
  }'
```

## 🎯 For NestJS Developers

If you're coming from NestJS, here's how Nuxt server compares:

| NestJS | Nuxt Server |
|--------|-------------|
| `@Controller()` | File-based routing in `server/api/v1/` |
| `@Get()`, `@Post()` | File naming: `*.get.ts`, `*.post.ts` |
| `@Injectable()` | Export functions from `server/utils/` |
| `@Module()` | `server/plugins/` for initialization |
| Guards | `server/middleware/` |
| DTOs | Zod schemas in `server/utils/validation.ts` |
| TypeORM/Prisma | Mongoose models in `server/models/` |

### Key Differences:

1. **File-based routing**: `server/api/v1/products/[id].get.ts` → `GET /api/v1/products/:id`
2. **Event handlers**: Use `defineEventHandler()` instead of decorators
3. **Auto-imports**: Nuxt auto-imports utilities (no manual imports needed)
4. **Runtime config**: Use `useRuntimeConfig()` for environment variables

## 🔒 Security Best Practices

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with expiration
- ✅ Password excluded from queries by default (`select: false`)
- ✅ Input validation with Zod
- ✅ Environment variables for secrets
- ✅ Role-based access control

## 📚 Learning Resources

- [Nuxt Documentation](https://nuxt.com/docs)
- [Nuxt Server Directory](https://nuxt.com/docs/guide/directory-structure/server)
- [H3 (HTTP Framework)](https://h3.unjs.io/)
- [Mongoose Documentation](https://mongoosejs.com/)

## 🚧 TODO

- [ ] Add permission-based middleware
- [ ] Implement refresh tokens
- [ ] Add email verification
- [ ] Create admin dashboard
- [ ] Add payment integration
- [ ] Implement product reviews
- [ ] Add image upload for products
- [ ] Create order status updates
- [ ] Add search with Elasticsearch

## 📄 License

MIT

---

**Happy Coding! 🎉**
