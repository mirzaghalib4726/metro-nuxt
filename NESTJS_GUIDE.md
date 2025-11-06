# 🎯 Nuxt for NestJS Developers

A comprehensive guide to help you transition from NestJS to Nuxt server development.

## 🔄 Core Concepts Comparison

### Architecture

| Concept | NestJS | Nuxt Server |
|---------|--------|-------------|
| **Framework** | Express/Fastify based | Nitro (H3) based |
| **Routing** | Decorator-based | File-based |
| **DI Container** | Built-in | Manual/Composables |
| **Modules** | `@Module()` | Plugins |
| **Middleware** | `@UseGuards()`, `@UseInterceptors()` | `server/middleware/` |

### File Structure Mapping

```
NestJS                          Nuxt Server
────────────────────────────────────────────────────
src/
├── modules/
│   └── users/
│       ├── users.controller.ts  →  server/api/users/
│       ├── users.service.ts     →  server/utils/users.ts
│       ├── users.module.ts      →  (not needed)
│       └── dto/                 →  server/utils/validation.ts
├── guards/                      →  server/middleware/
├── interceptors/                →  server/middleware/
├── filters/                     →  error handling in routes
└── main.ts                      →  server/plugins/
```

## 📁 Routing Comparison

### NestJS Controller

```typescript
// users.controller.ts
@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
```

### Nuxt Server Routes

```typescript
// server/api/users/index.get.ts
export default defineEventHandler(async (event) => {
  return await findAllUsers();
});

// server/api/users/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  return await findOneUser(id);
});

// server/api/users/index.post.ts
export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event); // Auth check
  const body = await readBody(event);
  const validated = createUserSchema.parse(body);
  return await createUser(validated);
});

// server/api/users/[id].put.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  const validated = updateUserSchema.parse(body);
  return await updateUser(id, validated);
});

// server/api/users/[id].delete.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  return await removeUser(id);
});
```

## 🛡️ Guards vs Middleware

### NestJS Guard

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return validateToken(request.headers.authorization);
  }
}

// Usage
@UseGuards(AuthGuard)
@Get('profile')
getProfile() { }
```

### Nuxt Middleware

```typescript
// server/utils/auth.ts
export async function getAuthUser(
  event: H3Event,
  options: { requireAdmin?: boolean } = {}
) {
  const token = extractToken(event);
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required',
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    throw createError({
      statusCode: 401,
      message: 'Invalid or expired token',
    });
  }

  const user = await User.findById(decoded.userId as string)
    .select('-password')
    .populate('role');

  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'User not found',
    });
  }

  const roleName = (user.role as any)?.name ?? 'customer';

  if (options.requireAdmin && roleName !== 'admin') {
    throw createError({
      statusCode: 403,
      message: 'Admin privileges required',
    });
  }

  return {
    userId: user._id.toString(),
    role: roleName,
    user,
  };
}

// Usage in route
export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event); // Throws if not authenticated
  // ... rest of handler
});
```

## 📦 Services vs Utils

### NestJS Service

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }
}
```

### Nuxt Utils

```typescript
// server/utils/users.ts
import User from '../models/User';

export async function findAllUsers() {
  return await User.find();
}

export async function createUser(data: CreateUserData) {
  return await User.create(data);
}
```

## ✅ DTOs vs Zod Schemas

### NestJS DTO

```typescript
// create-user.dto.ts
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
```

### Nuxt Zod Schema

```typescript
// server/utils/validation.ts
export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'seller', 'customer']),
});

// Usage
const validated = createUserSchema.parse(body);
```

## 🔌 Modules vs Plugins

### NestJS Module

```typescript
@Module({
  imports: [TypeOrmModule.forRoot(...)],
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}
```

### Nuxt Plugin

```typescript
// server/plugins/database.ts
export default defineNitroPlugin(async (nitroApp) => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  nitroApp.hooks.hook('close', async () => {
    await mongoose.connection.close();
  });
});
```

## 🔧 Configuration

### NestJS

```typescript
// app.module.ts
ConfigModule.forRoot({
  envFilePath: '.env',
  isGlobal: true,
});

// Usage
constructor(private configService: ConfigService) {}
const dbUri = this.configService.get('MONGODB_URI');
```

### Nuxt

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
    public: {
      apiBase: '/api',
    }
  }
});

// Usage in server
const config = useRuntimeConfig();
const dbUri = config.mongodbUri;
```

## 🚨 Exception Filters vs Error Handling

### NestJS

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    
    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
```

### Nuxt

```typescript
// In route handler
export default defineEventHandler(async (event) => {
  try {
    // ... logic
  } catch (error: any) {
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        message: 'Validation failed',
        data: error.errors,
      });
    }
    
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
});
```

## 🔍 Request/Response Handling

### NestJS

```typescript
@Post()
async create(
  @Body() body: CreateDto,
  @Param('id') id: string,
  @Query('filter') filter: string,
  @Headers('authorization') auth: string,
  @Req() request: Request,
  @Res() response: Response,
) {
  // ...
}
```

### Nuxt

```typescript
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = getRouterParam(event, 'id');
  const query = getQuery(event);
  const filter = query.filter;
  const auth = getHeader(event, 'authorization');
  
  // Set response
  setResponseStatus(event, 201);
  setResponseHeader(event, 'X-Custom', 'value');
  
  return { data: 'response' };
});
```

## 🎨 Key Differences

### 1. **No Dependency Injection**

NestJS:
```typescript
constructor(
  private usersService: UsersService,
  private authService: AuthService,
) {}
```

Nuxt:
```typescript
// Just import and use
import { findUser } from '../utils/users';
import { verifyToken } from '../utils/auth';
```

### 2. **File-based Routing**

- File name determines HTTP method: `*.get.ts`, `*.post.ts`
- Folder structure determines URL path
- `[id]` in filename = dynamic route parameter

### 3. **Auto-imports**

Nuxt auto-imports many utilities:
- `defineEventHandler`
- `readBody`, `getQuery`, `getRouterParam`
- `createError`, `setResponseStatus`
- `useRuntimeConfig`

### 4. **Simpler Setup**

No need for:
- Module declarations
- Provider arrays
- Controller registration
- Explicit DI configuration

## 💡 Best Practices

### 1. **Organize by Feature**

```
server/
├── api/
│   ├── auth/
│   ├── products/
│   └── orders/
├── models/
│   ├── User.ts
│   ├── Product.ts
│   └── Order.ts
└── utils/
    ├── auth.ts
    ├── validation.ts
    └── email.ts
```

### 2. **Reusable Auth Check**

```typescript
// server/utils/auth.ts
export async function requireAuth(event: H3Event) {
  const user = await getAuthUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
  return user;
}

// Use in routes
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  // ...
});
```

### 3. **Centralized Validation**

```typescript
// server/utils/validation.ts
export const schemas = {
  createUser: z.object({ /* ... */ }),
  updateUser: z.object({ /* ... */ }),
  createProduct: z.object({ /* ... */ }),
};

// Use in routes
const validated = schemas.createUser.parse(body);
```

## 🚀 Migration Checklist

- [ ] Convert controllers to file-based routes
- [ ] Move services to utils
- [ ] Replace DTOs with Zod schemas
- [ ] Convert guards to middleware functions
- [ ] Update module initialization to plugins
- [ ] Adapt exception filters to error handling
- [ ] Update configuration to runtimeConfig
- [ ] Test all endpoints

## 📚 Additional Resources

- [Nuxt Server Documentation](https://nuxt.com/docs/guide/directory-structure/server)
- [H3 Documentation](https://h3.unjs.io/)
- [Nitro Documentation](https://nitro.unjs.io/)

---

**Welcome to Nuxt! 🎉** You'll find it simpler and more straightforward than NestJS for many use cases.
