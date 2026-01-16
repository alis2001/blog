# Pahlavi for Iran - Project Overview

## Architecture

This is a professional Node.js/Express application following MVC architecture patterns with clear separation of concerns.

### Technology Stack

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- Session-based authentication
- bcryptjs for password hashing
- EJS templating engine

**Security:**
- Helmet.js for HTTP headers
- express-validator for input validation
- sanitize-html for XSS protection
- CORS enabled
- Session security with httpOnly cookies

**Frontend:**
- Server-side rendered with EJS
- Custom CSS (no frameworks for cleaner code)
- Vanilla JavaScript (no jQuery)
- Responsive design

## Application Structure

### Backend Organization

```
src/
├── config/              # Configuration files
│   ├── app.js          # Express app setup and middleware
│   └── database.js     # MongoDB connection
│
├── models/             # Mongoose schemas
│   ├── User.js         # Admin user model
│   ├── Category.js     # Article category model
│   └── Article.js      # Article/blog post model
│
├── controllers/        # Business logic
│   ├── admin/          # Admin panel logic
│   │   ├── authController.js
│   │   ├── articleController.js
│   │   └── categoryController.js
│   └── public/         # Public website logic
│       ├── homeController.js
│       └── articleController.js
│
├── routes/             # Route definitions
│   ├── admin.js        # Admin routes with auth
│   └── public.js       # Public routes
│
├── middleware/         # Custom middleware
│   ├── auth.js         # Authentication checks
│   ├── validation.js   # Input validation
│   └── errorHandler.js # Global error handling
│
├── utils/              # Helper functions
│   └── helpers.js      # Date formatting, text truncation
│
├── views/              # EJS templates
│   ├── admin/          # Admin panel views
│   └── public/         # Public website views
│
└── scripts/            # Utility scripts
    └── seed.js         # Database seeding
```

## Features

### Admin Panel (`/admin`)

**Authentication:**
- Secure login system
- Session-based authentication
- Password hashing with bcrypt
- Protected routes

**Dashboard:**
- Statistics overview (total articles, published, drafts, categories)
- Recent articles list
- Quick actions

**Article Management:**
- Create, read, update, delete articles
- Rich content editor
- Featured image support
- Category assignment
- Tags support
- Draft/Published/Archived status
- Featured article marking
- Auto-generated SEO-friendly slugs
- Excerpt support

**Category Management:**
- Create, read, update, delete categories
- Custom ordering
- Active/inactive status
- Auto-generated slugs
- Article count per category
- Prevents deletion of categories with articles

### Public Website (`/`)

**Pages:**
- Home page with featured and latest articles
- Individual article pages
- Category archive pages
- Responsive navigation

**Features:**
- Clean, modern design
- SEO-friendly URLs
- View counter for articles
- Related articles
- Category browsing
- Pagination support
- Responsive layout

## Database Schema

### Users Collection
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  role: String (admin/editor),
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Categories Collection
```javascript
{
  name: String (unique, required),
  slug: String (auto-generated, unique),
  description: String,
  order: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Articles Collection
```javascript
{
  title: String (required),
  slug: String (auto-generated, unique),
  excerpt: String,
  content: String (required, HTML),
  category: ObjectId (ref: Category),
  author: ObjectId (ref: User),
  featuredImage: String (URL),
  tags: [String],
  status: String (draft/published/archived),
  publishedAt: Date,
  views: Number,
  isFeatured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Measures

1. **Authentication:**
   - Session-based with secure cookies
   - Password hashing with bcryptjs (12 rounds)
   - Protected admin routes

2. **Input Validation:**
   - express-validator for all form inputs
   - Length limits on fields
   - Required field validation

3. **XSS Protection:**
   - sanitize-html for article content
   - Whitelisted HTML tags and attributes
   - EJS auto-escaping

4. **HTTP Security:**
   - Helmet.js for security headers
   - CORS configuration
   - httpOnly cookies

5. **Error Handling:**
   - Global error handler
   - Proper error logging
   - User-friendly error pages

## API Endpoints

### Admin Routes (Protected)

**Authentication:**
- `GET /admin/login` - Login page
- `POST /admin/login` - Login submission
- `GET /admin/logout` - Logout

**Dashboard:**
- `GET /admin/dashboard` - Dashboard with stats

**Articles:**
- `GET /admin/articles` - List all articles (with filters, pagination)
- `GET /admin/articles/create` - Create article form
- `POST /admin/articles/create` - Submit new article
- `GET /admin/articles/edit/:id` - Edit article form
- `POST /admin/articles/edit/:id` - Update article
- `DELETE /admin/articles/:id` - Delete article (AJAX)

**Categories:**
- `GET /admin/categories` - List all categories
- `GET /admin/categories/create` - Create category form
- `POST /admin/categories/create` - Submit new category
- `GET /admin/categories/edit/:id` - Edit category form
- `POST /admin/categories/edit/:id` - Update category
- `DELETE /admin/categories/:id` - Delete category (AJAX)

### Public Routes

- `GET /` - Home page
- `GET /article/:slug` - Article detail page
- `GET /category/:slug` - Category articles page (with pagination)

## Key Features Implementation

### Auto-Generated Slugs
Articles and categories automatically generate URL-friendly slugs from titles using the slugify package.

### View Tracking
Article views are automatically incremented when viewed on the public site.

### Featured Articles
Articles can be marked as featured and will appear in a special section on the home page.

### Pagination
Both admin article list and public category pages support pagination.

### Filtering
Admin article list can be filtered by status and category.

### Rich Content
Articles support HTML content with sanitization for security.

### Related Articles
Article detail pages show related articles from the same category.

## Deployment Considerations

### Environment Variables
All sensitive data is stored in environment variables:
- Database connection strings
- JWT secrets
- Session secrets
- Admin credentials

### Production Checklist
1. Set NODE_ENV to production
2. Use production MongoDB (MongoDB Atlas recommended)
3. Generate strong secrets for JWT and sessions
4. Enable HTTPS
5. Set up reverse proxy (nginx)
6. Configure firewall
7. Set up process manager (PM2)
8. Configure backup strategy
9. Set up monitoring
10. Configure logging

### Recommended Hosting
- **Backend:** DigitalOcean, AWS, Heroku, Railway
- **Database:** MongoDB Atlas
- **Domain:** Any registrar (Namecheap, GoDaddy, etc.)
- **SSL:** Let's Encrypt (free)

## Customization Guide

### Adding New Categories
Done through admin panel at `/admin/categories/create`

### Styling Changes
- Admin styles: `/public/css/admin.css`
- Public styles: `/public/css/public.css`

### Adding New Routes
1. Add controller in `src/controllers/`
2. Add route in `src/routes/`
3. Create view in `src/views/`

### Adding New Models
1. Create model in `src/models/`
2. Create controller methods
3. Add routes
4. Create views

## Content Strategy for Your Use Case

### Suggested Categories
1. **History** - Pahlavi dynasty historical articles
2. **News** - Current events and news updates
3. **Revolution 2026** - Coverage of ongoing events
4. **Reza Pahlavi** - Information about current opposition

### Article Types
1. **Historical Articles** - Well-researched pieces about Pahlavi era
2. **News Updates** - Sourced news with proper citations
3. **Timelines** - Chronological event lists
4. **Biographies** - Profiles of key figures
5. **Analysis** - Opinion and analysis pieces

## Maintenance

### Regular Tasks
1. Monitor database size
2. Review and moderate content
3. Update dependencies
4. Monitor server logs
5. Backup database
6. Review security updates

### Database Backup
```bash
mongodump --uri="mongodb://localhost:27017/pahlavi-iran" --out=/backup/
```

### Restore Database
```bash
mongorestore --uri="mongodb://localhost:27017/pahlavi-iran" /backup/pahlavi-iran/
```

## Support and Development

This is a complete, production-ready application. All code follows professional standards with:
- Clear separation of concerns
- Proper error handling
- Security best practices
- Scalable architecture
- Clean, maintainable code
- Professional styling

The application is ready for deployment and can handle significant traffic with proper hosting infrastructure.

