import mongoose from 'mongoose';
import User from '../models/User';

const seedAdmin = async () => {
  try {
    // Remove existing admin configuration to reset to default
    await User.deleteMany({ role: 'admin' });

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    const admin = new User({
      name: 'Omnis Admin',
      email: email,
      password: password, // User Schema pre-save hook will hash this
      role: 'admin',
      isEmailVerified: true,
    });

    await admin.save();
    console.log(`\n👑 [Admin Seeder] Default Admin Created!`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}\n`);
  } catch (error: any) {
    console.error(`❌ [Admin Seeder] Error: ${error.message}`);
  }
};

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/omnis_auth'
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Seed default admin account
    await seedAdmin();
  } catch (error: any) {
    console.error(`❌ Error Connection: ${error.message}`);
    process.exit(1);
  }
};
