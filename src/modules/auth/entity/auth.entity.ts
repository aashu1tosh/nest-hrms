import Base from 'src/common/entity/base.entity';
import { Role } from 'src/constant/enum';
import { Admin } from 'src/modules/admin/entity/admin.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('auth')
export class Auth extends Base {
  @Column({
    unique: true,
  })
  email: string;

  @Column({ name: 'phone_number', nullable: true })
  phone: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.ADMIN,
  })
  role: Role;

  @OneToOne(() => Admin, (admin) => admin.auth, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;
}
