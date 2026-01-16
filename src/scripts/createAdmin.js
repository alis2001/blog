require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');

const createAdmin = async () => {
  try {
    await connectDB();
    
    const existingAdmin = await User.findOne({ email: 'admin@pahlaviforiran.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@pahlaviforiran.com');
      console.log('Password: Admin123456');
      process.exit(0);
    }
    
    console.log('Creating admin user...');
    await User.create({
      email: 'admin@pahlaviforiran.com',
      password: 'Admin123456',
      role: 'admin',
      isActive: true
    });
    
    console.log('Admin user created successfully!');
    console.log('\nLogin credentials:');
    console.log('URL: http://localhost:3001/admin/login');
    console.log('Email: admin@pahlaviforiran.com');
    console.log('Password: Admin123456');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();

