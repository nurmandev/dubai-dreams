import mongoose from 'mongoose';
import User from '../models/User';

const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.warn('[Admin Seeder] ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping.');
      return;
    }

    // Only create if no admin exists — never wipe existing admins on restart
    const existing = await User.findOne({ role: 'admin' });
    if (existing) {
      console.log(`[Admin Seeder] Admin already exists (${existing.email}) — skipping.`);
      return;
    }

    const admin = new User({
      name: 'Omnis Admin',
      email: email,
      password: password,
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
