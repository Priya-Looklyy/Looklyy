# Lookly - Brand Lookboard Manager

A modern web application for creating and managing brand lookboards with Next.js frontend and Express backend.

## Tech Stack

- **Frontend**: Next.js 15 with TailwindCSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based
- **Styling**: TailwindCSS

## Project Structure

```
Lookly/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   └── components/    # React components
└── server/                 # Express backend
    ├── src/
    │   ├── controllers/   # Route controllers
    │   ├── middleware/    # JWT authentication
    │   ├── routes/        # API route definitions
    │   └── config/        # Prisma configuration
    └── prisma/            # Database schema
```

## Database Schema

### User Model
- `id`: Unique identifier
- `name`: Full name
- `email`: Email address (unique)
- `passwordHash`: Hashed password
- `bio`: Optional biography
- `favoriteColors`: Array of favorite colors
- `createdAt`, `updatedAt`: Timestamps

### Lookboard Model
- `id`: Unique identifier
- `userId`: Foreign key to User
- `title`: Lookboard title
- `images`: Array of image URLs
- `createdAt`: Creation timestamp

### Brand Model
- `id`: Unique identifier
- `name`: Brand name (unique)
- `description`: Optional description
- `logoUrl`: Optional logo URL

### Product Model
- `id`: Unique identifier
- `brandId`: Foreign key to Brand
- `name`: Product name
- `description`: Optional description
- `price`: Optional price
- `imageUrl`: Optional product image
- `colors`: Array of available colors

## API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile

### Lookboards
- `GET /api/lookboards` - Get user's lookboards
- `POST /api/lookboards` - Create new lookboard
- `GET /api/lookboards/:id` - Get specific lookboard
- `PUT /api/lookboards/:id` - Update lookboard
- `DELETE /api/lookboards/:id` - Delete lookboard

### Brands
- `GET /api/brands` - List all brands
- `GET /api/brands/:id` - Get brand by ID
- `POST /api/brands` - Create new brand

### Products
- `GET /api/products` - List all products
- `GET /api/products?color=red` - Filter products by color
- `GET /api/products?brandId=123` - Filter products by brand
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Backend Setup
1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with your database configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/lookly?schema=public"
   PORT=4000
   JWT_SECRET="your-secret-key"
   JWT_EXPIRES_IN="7d"
   ```

4. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

5. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

6. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- **User Authentication**: Secure JWT-based login/registration
- **Profile Management**: Update user profile and favorite colors
- **Lookboard Creation**: Create and manage personal lookboards
- **Brand Management**: Add and manage brands
- **Product Catalog**: Comprehensive product management with color filtering
- **Image Support**: Store and manage image URLs for lookboards and products
- **Responsive Design**: Modern UI built with TailwindCSS

## Development

- **Backend**: `npm run dev` (uses nodemon for auto-restart)
- **Frontend**: `npm run dev` (Next.js development server)
- **Database**: `npm run prisma:studio` (Prisma Studio for database management)

## API Authentication

All protected routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API returns consistent error responses:
```json
{
  "error": "Error message description"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
