import connectDB from './lib/db';
import { Admin } from './models';

// This is the real seed to set up your INITIAL ADMIN
// Run this once to get access to the dashboard
async function setupAdmin() {
  try {
    await connectDB();
    
    // Clear existing admins (optional)
    await Admin.deleteMany({});
    
    // Create initial super admin
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD; // Match the UI for now, or use bcrypt in real prod
    
    await Admin.create({
      email: adminEmail,
      passwordHash: adminPassword, // In production, hash this!
      name: 'Super Admin'
    });
    
    console.log('✅ Admin account created successfully');
    console.log(`Email: ${adminEmail}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup error:', error);
    process.exit(1);
  }
}

setupAdmin();
