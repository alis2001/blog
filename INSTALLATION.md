# Installation Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## Step-by-Step Installation

### 1. Install MongoDB

#### Ubuntu/Debian:
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### 2. Clone or Navigate to Project

```bash
cd /home/ai/shah
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment

Copy the example environment file:
```bash
cp env.example .env
```

Edit `.env` file and update the following:
```
MONGODB_URI=mongodb://localhost:27017/pahlavi-iran
JWT_SECRET=generate_a_random_32_character_string
SESSION_SECRET=generate_another_random_32_character_string
ADMIN_EMAIL=your_email@domain.com
ADMIN_PASSWORD=YourSecurePassword123
```

To generate secure secrets, you can use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Seed the Database

This will create the admin user and initial categories:
```bash
npm run seed
```

You should see output like:
```
MongoDB connected successfully
Clearing existing data...
Creating admin user...
Creating categories...
Seed completed successfully!
Admin email: your_email@domain.com
Admin password: YourSecurePassword123

You can now login at: http://localhost:3000/admin/login
```

### 6. Start the Application

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

The application will start on port 3000 (or the PORT specified in .env).

### 7. Access the Application

#### Public Website
```
http://localhost:3000
```

#### Admin Panel
```
http://localhost:3000/admin/login
```

Use the credentials you set in the .env file.

## Verification

### Check MongoDB Connection
```bash
mongosh
use pahlavi-iran
db.users.find()
db.categories.find()
```

### Check Application Logs
The application will log:
- MongoDB connection status
- Server port
- Any errors

## Troubleshooting

### MongoDB Connection Issues

If you see "MongoDB connection error":

1. Check MongoDB is running:
```bash
sudo systemctl status mongod
```

2. Check MongoDB logs:
```bash
sudo tail -f /var/log/mongodb/mongod.log
```

3. Verify connection string in .env

### Port Already in Use

If port 3000 is taken, change the PORT in .env:
```
PORT=3001
```

### Cannot Login

1. Verify admin user was created:
```bash
mongosh
use pahlavi-iran
db.users.findOne({})
```

2. Re-run seed script:
```bash
npm run seed
```

### Missing Dependencies

If you see module errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. Login to admin panel
2. Create your first category (if not using defaults)
3. Create your first article
4. Visit the public website to see your content

## Production Deployment

For production deployment:

1. Set NODE_ENV to production:
```
NODE_ENV=production
```

2. Use a production MongoDB instance (Atlas, etc.)

3. Set secure secrets in .env

4. Consider using PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name pahlavi-iran
pm2 save
pm2 startup
```

5. Set up a reverse proxy (nginx, Apache)

6. Enable SSL/TLS certificates

7. Configure firewall rules

