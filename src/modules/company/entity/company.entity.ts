import Base from 'src/common/entity/base.entity';
import { CompanyAdmin } from 'src/modules/company-admin/entity/company-admin.entity';
import { CompanyEmployee } from 'src/modules/company-employee/entity/company-employee.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('company')
export class Company extends Base {
  @Column()
  name: string;

  @Column({ name: 'phone_number', nullable: true })
  phone: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  pan: string;

  @OneToMany(() => CompanyAdmin, (companyAdmin) => companyAdmin.company)
  companyAdmin: CompanyAdmin[];

  @OneToMany(
    () => CompanyEmployee,
    (companyEmployee) => companyEmployee.company,
  )
  companyEmployee: CompanyEmployee[];
}
