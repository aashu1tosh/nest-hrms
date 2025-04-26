
import Base from 'src/common/entity/base.entity';
import { EmployeeStatus } from 'src/constant/enum';
import { Auth } from 'src/modules/auth/entity/auth.entity';
import { Company } from 'src/modules/company/entity/company.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('company_employee')
export class CompanyEmployee extends Base {
    @Column({ name: 'first_name' })
    firstName: string

    @Column({ name: 'middle_name', nullable: true })
    middleName: string


    @Column({ name: 'first_name' })
    lastName: string

    @Column({ name: 'phone_number', nullable: true })
    phone: string;

    @Column({
        type: 'enum',
        enum: EmployeeStatus,
        default: EmployeeStatus.ACTIVE,
    })
    status: EmployeeStatus;

    @OneToOne(() => Auth, (auth) => auth.companyEmployee, {
        cascade: true,
    })
    auth: Auth

    @ManyToOne(() => Company, (company) => company.companyEmployee)
    @JoinColumn({ name: 'company_id' })
    company: Company;
}

