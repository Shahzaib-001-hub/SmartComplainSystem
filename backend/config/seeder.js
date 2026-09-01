import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import connectDB from './db.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@smartcomplaint.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const adminName = process.env.ADMIN_NAME || 'System Administrator';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });

    let adminUser = existingAdmin;
    if (!existingAdmin) {
      adminUser = await User.create({
        name: adminName,
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        role: 'super_admin',
        status: 'active',
        department: 'IT Administration',
        studentId: 'ADM-001',
        phone: '+1 555-0199',
      });
      console.log(`✅ Default Super Admin user created: ${adminEmail} (Password: ${adminPassword})`);
    } else if (existingAdmin.role !== 'super_admin') {
      existingAdmin.role = 'super_admin';
      await existingAdmin.save();
      console.log(`✅ Default Admin user upgraded to Super Admin: ${adminEmail}`);
    }

    // Check if we need demo data
    const userCount = await User.countDocuments();
    if (userCount <= 1) {
      console.log('🌱 Seeding demo students and complaints...');

      const student1 = await User.create({
        name: 'Alex Johnson',
        email: 'alex@student.com',
        password: 'Password@123',
        role: 'user',
        status: 'active',
        department: 'Computer Science',
        studentId: 'CS-2024-042',
        phone: '+1 555-0142',
      });

      const student2 = await User.create({
        name: 'Sarah Williams',
        email: 'sarah@student.com',
        password: 'Password@123',
        role: 'user',
        status: 'pending', // Pending approval demo
        department: 'Electrical Engineering',
        studentId: 'EE-2024-019',
        phone: '+1 555-0188',
      });

      const student3 = await User.create({
        name: 'Michael Chen',
        email: 'michael@student.com',
        password: 'Password@123',
        role: 'user',
        status: 'active',
        department: 'Mechanical Engineering',
        studentId: 'ME-2023-108',
        phone: '+1 555-0195',
      });

      // Sample complaints
      await Complaint.create([
        {
          ticketId: 'CMP-2026-1001',
          title: 'High latency and packet drops on Campus Wi-Fi',
          description:
            'The Wi-Fi router on the 2nd Floor of Computer Science Block drops connection every 5-10 minutes during lab hours.',
          category: 'IT & Network',
          priority: 'High',
          status: 'IN PROGRESS',
          user: student1._id,
          department: 'Computer Science',
          location: 'CS Building - Lab 204',
          adminRemarks: 'Network team dispatched to replace switch and update firmware.',
          timeline: [
            {
              status: 'PENDING',
              updatedBy: student1._id,
              updatedByName: student1.name,
              note: 'Complaint submitted by student',
              timestamp: new Date(Date.now() - 86400000 * 2),
            },
            {
              status: 'IN PROGRESS',
              updatedBy: adminUser ? adminUser._id : null,
              updatedByName: adminName,
              note: 'Assigned to IT Network engineering team.',
              timestamp: new Date(Date.now() - 86400000),
            },
          ],
        },
        {
          ticketId: 'CMP-2026-1002',
          title: 'Water dispenser cooling unit malfunctioning in Hostel Block B',
          description:
            'The main water cooler on ground floor is dispensing warm water and has a slight leak underneath.',
          category: 'Hostel & Accommodation',
          priority: 'Medium',
          status: 'RESOLVED',
          user: student1._id,
          department: 'Computer Science',
          location: 'Hostel Block B - Ground Floor',
          adminRemarks: 'Compressor serviced and leak sealed by plumbing & HVAC maintenance.',
          timeline: [
            {
              status: 'PENDING',
              updatedBy: student1._id,
              updatedByName: student1.name,
              note: 'Complaint submitted by student',
              timestamp: new Date(Date.now() - 86400000 * 4),
            },
            {
              status: 'IN PROGRESS',
              updatedBy: adminUser ? adminUser._id : null,
              updatedByName: adminName,
              note: 'Maintenance team notified.',
              timestamp: new Date(Date.now() - 86400000 * 3),
            },
            {
              status: 'RESOLVED',
              updatedBy: adminUser ? adminUser._id : null,
              updatedByName: adminName,
              note: 'Repair completed and verified by hostel warden.',
              timestamp: new Date(Date.now() - 86400000 * 1),
            },
          ],
        },
        {
          ticketId: 'CMP-2026-1003',
          title: 'Broken projector and dim HDMI output in Hall 3',
          description:
            'The overhead projector in Lecture Hall 3 flickers in purple tint and fails to connect with USB-C laptops.',
          category: 'Infrastructure & Maintenance',
          priority: 'Urgent',
          status: 'PENDING',
          user: student3._id,
          department: 'Mechanical Engineering',
          location: 'Lecture Hall 3',
          timeline: [
            {
              status: 'PENDING',
              updatedBy: student3._id,
              updatedByName: student3.name,
              note: 'Complaint submitted by student',
              timestamp: new Date(Date.now() - 3600000 * 4),
            },
          ],
        },
      ]);

      console.log('✅ Demo users and complaints seeded successfully!');
    }
  } catch (error) {
    console.error('Seeding error:', error.message);
  }
};

if (process.argv[1] && process.argv[1].endsWith('seeder.js')) {
  (async () => {
    await connectDB();
    await seedDatabase();
    await mongoose.connection.close();
    process.exit(0);
  })();
}

export default seedDatabase;
