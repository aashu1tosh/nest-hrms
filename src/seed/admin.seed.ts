// // src/database/seeders/admin-seeder.module.ts
// import { Module } from '@nestjs/common';
// import { UsersModule } from '../../users/users.module'; // Adjust based on your structure
// import { AdminSeederService } from './admin-seeder.service';

// @Module({
//     imports: [UsersModule], // Import the module that has your admin/user service
//     providers: [AdminSeederService],
//     exports: [AdminSeederService],
// })
// export class AdminSeederModule { }

// // src/database/seeders/admin-seeder.service.ts
// import { Injectable } from '@nestjs/common';
// import { UserService } from '../../users/user.service'; // Adjust path as needed

// @Injectable()
// export class AdminSeederService {
//     constructor(private readonly userService: UserService) { }

//     async seed() {
//         // Define your admin data - you might want to move this to a config file
//         const adminData = {
//             email: 'admin@example.com',
//             password: 'StrongPassword123!', // In production, consider env variables
//             firstName: 'Admin',
//             lastName: 'User',
//             role: 'admin',
//         };

//         // Check if admin already exists to avoid duplicates
//         const existingAdmin = await this.userService.findByEmail(adminData.email);

//         if (existingAdmin) {
//             console.log('Admin user already exists, skipping seed');
//             return existingAdmin;
//         }

//         // Create admin user
//         const admin = await this.userService.create(adminData);
//         console.log('Admin user seeded successfully:', admin.email);
//         return admin;
//     }
// }

// // src/scripts/seed-admin.ts
// import { NestFactory } from '@nestjs/core';
// import { AdminSeederModule } from '../database/seeders/admin-seeder.module';

// async function bootstrap() {
//     const app = await NestFactory.createApplicationContext(AdminSeederModule);

//     try {
//         const seederService = app.get(AdminSeederService);
//         await seederService.seed();
//         console.log('Admin seeding completed successfully');
//     } catch (error) {
//         console.error('Error seeding admin:', error);
//         process.exit(1);
//     } finally {
//         await app.close();
//         process.exit(0);
//     }
// }

// bootstrap().catch((error) => {
//     console.error('Error during bootstrap:', error);
//     process.exit(1);
// });