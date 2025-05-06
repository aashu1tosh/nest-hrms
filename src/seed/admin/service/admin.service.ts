import { Injectable } from '@nestjs/common';
import { Role } from 'src/constant/enum';
import { AuthService } from 'src/modules/auth/service/auth.service';

@Injectable()
export class AdminSeederService {
  constructor(private readonly authService: AuthService) {}

  async seed() {
    const adminData = {
      email: 'sudo@admin.com',
      password: 'Admin@123',
      phone: '9843818516',
      role: Role.SUDO_ADMIN,
      admin: {
        firstName: 'Sudo',
        middleName: '',
        lastName: 'Admin',
      },
    };

    // Check if admin already exists to avoid duplicates
    const existingAdmin = await this.authService.checkEmail(adminData.email);

    if (existingAdmin) {
      console.log('Admin user already exists, skipping seed');
      return existingAdmin;
    }

    const existingPhone = await this.authService.checkPhone(adminData.phone);
    if (existingPhone) {
      console.log('Admin user already exists, skipping seed');
      return existingPhone;
    }

    // Create admin user
    const admin = await this.authService.create({ data: adminData });
    console.log('Admin user seeded successfully:', adminData.email);
    return admin;
  }
}
