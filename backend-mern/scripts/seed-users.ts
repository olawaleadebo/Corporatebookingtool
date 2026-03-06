import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User, UserRole } from '../src/models/User';
import { logger } from '../src/utils/logger';

// Load environment variables
dotenv.config();

const demoUsers = [
  {
    email: 'traveller@btmtravel.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Traveller',
    phoneNumber: '+2348012345678',
    role: UserRole.TRAVELLER,
    department: 'Sales',
    costCenter: 'CC-001',
  },
  {
    email: 'arranger@btmtravel.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Arranger',
    phoneNumber: '+2348087654321',
    role: UserRole.TRAVEL_ARRANGER,
    department: 'Travel Management',
    costCenter: 'CC-002',
  },
  {
    email: 'admin@btmtravel.com',
    password: 'password123',
    firstName: 'Admin',
    lastName: 'User',
    phoneNumber: '+2348098765432',
    role: UserRole.ADMIN,
    department: 'Administration',
    costCenter: 'CC-003',
  },
];

const seedUsers = async () => {
  try {
    // Connect to database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cobt';
    await mongoose.connect(mongoUri);
    
    logger.info('Connected to MongoDB', { context: 'SeedUsers' });

    // Clear existing users (optional - comment out if you want to keep existing users)
    await User.deleteMany({});
    logger.info('Cleared existing users', { context: 'SeedUsers' });

    // Create demo users
    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      await User.create({
        ...userData,
        password: hashedPassword,
      });

      logger.info(`Created user: ${userData.email}`, { context: 'SeedUsers' });
    }

    logger.info('Demo users seeded successfully!', { context: 'SeedUsers' });
    
    console.log('\n✅ Demo users created successfully!\n');
    console.log('Login credentials:');
    console.log('==================');
    demoUsers.forEach(user => {
      console.log(`${user.role.toUpperCase()}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}`);
      console.log('');
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error: any) {
    logger.error('Failed to seed users', {
      context: 'SeedUsers',
      error: error.message,
    });
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
