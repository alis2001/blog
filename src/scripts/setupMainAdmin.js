require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');
const crypto = require('crypto');

const setupMainAdmin = async () => {
  try {
    await connectDB();
    
    const mainAdminEmail = 'alisadeghian7077@gmail.com';
    const randomPassword = crypto.randomBytes(8).toString('hex');
    
    const existingAdmin = await User.findOne({ email: mainAdminEmail });
    
    if (existingAdmin) {
      console.log('Main admin already exists!');
      console.log('Email:', mainAdminEmail);
      console.log('\nTo reset password, delete the user and run this script again.');
      process.exit(0);
    }
    
    await User.deleteMany({});
    
    console.log('Creating main admin user...');
    await User.create({
      email: mainAdminEmail,
      password: randomPassword,
      role: 'admin',
      isActive: true,
      isMainAdmin: true
    });
    
    console.log('\n✓ Main admin created successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('  ADMIN LOGIN CREDENTIALS');
    console.log('═══════════════════════════════════════');
    console.log('URL:      http://localhost:3001/admin/login');
    console.log('Email:    ' + mainAdminEmail);
    console.log('Password: ' + randomPassword);
    console.log('═══════════════════════════════════════');
    console.log('\n⚠ SAVE THIS PASSWORD - IT CANNOT BE RECOVERED!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

setupMainAdmin();

