# Pahlavi for Iran

A professional Node.js/Express web application for documenting Pahlavi dynasty history and providing news about Iran.

## Features

- **Public Website**: Beautiful, responsive design with Iranian flag gradient animations
- **Admin Panel**: Complete CMS for managing articles, categories, and users
- **Content Categories**: History, News, Reza Pahlavi biography, and more
- **User Management**: Registration system with admin approval workflow
- **Source Attribution**: Comprehensive system for properly sourcing news articles
- **Security**: Rate limiting, XSS protection, CSRF protection, secure headers
- **File Uploads**: Image upload system for articles
- **Responsive Design**: Fully mobile-friendly

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **View Engine**: EJS
- **Authentication**: Session-based with bcrypt
- **Security**: Helmet, express-rate-limit, xss-clean, hpp, csurf
- **File Upload**: Multer
- **Styling**: Custom CSS with animations

## Installation

1. Clone the repository:
```bash
git clone git@github.com:alis2001/blog.git
cd blog
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Update `.env` with your MongoDB credentials and secrets

5. Seed the database:
```bash
npm run seed
```

6. Create main admin user:
```bash
node src/scripts/setupMainAdmin.js
```

7. Start development server:
```bash
npm run dev
```

## Admin Access

Default admin email: `alisadeghian7077@gmail.com`

Login at: `http://localhost:3001/admin/login`

## Project Structure

```
├── public/              # Static assets (CSS, JS, images)
├── src/
│   ├── config/         # App configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # Route definitions
│   ├── scripts/        # Utility scripts
│   ├── utils/          # Helper functions
│   └── views/          # EJS templates
├── server.js           # Application entry point
└── package.json        # Dependencies

```

## Environment Variables

See `env.example` for required environment variables.

## License

Private project for educational and informational purposes.

## Disclaimer

This website is an independent information portal. All content is provided for educational and informational purposes only. News articles and updates are fully sourced from credible international agencies, with appropriate attribution and links to original sources.
