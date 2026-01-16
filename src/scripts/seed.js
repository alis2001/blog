require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const connectDB = require('../config/database');

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    
    console.log('Creating admin user...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@pahlaviforiran.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123456';
    
    await User.create({
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isActive: true
    });
    
    console.log('Creating categories...');
    const categories = [
      {
        name: 'History',
        description: 'Historical articles about the Pahlavi dynasty and Iran',
        order: 1,
        isActive: true
      },
      {
        name: 'News',
        description: 'Latest news and updates about Iran',
        order: 2,
        isActive: true
      },
      {
        name: 'Revolution 2026',
        description: 'Coverage of the 2026 Iran revolution',
        order: 3,
        isActive: true
      },
      {
        name: 'Reza Pahlavi',
        description: 'Articles about Reza Pahlavi and the opposition movement',
        order: 4,
        isActive: true
      }
    ];
    
    await Category.insertMany(categories);
    
    console.log('Seed completed successfully!');
    console.log(`Admin email: ${adminEmail}`);
    console.log(`Admin password: ${adminPassword}`);
    console.log('\nYou can now login at: http://localhost:3000/admin/login');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();

