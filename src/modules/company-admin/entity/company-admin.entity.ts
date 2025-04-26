import Base from 'src/common/entity/base.entity'
import { Auth } from 'src/modules/auth/entity/auth.entity'
import { Company } from 'src/modules/company/entity/company.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'

@Entity('company_admin')
export class CompanyAdmin extends Base {
    @Column({ name: 'first_name' })
    firstName: string

    @Column({ name: 'middle_name', nullable: true })
    middleName: string

    @Column({ name: 'last_name' })
    lastName: string

    @OneToOne(() => Auth, (auth) => auth.admin, {
        cascade: true,
    })
    auth: Auth

    @ManyToOne(() => Company, (company) => company.companyAdmin)
    @JoinColumn({ name: 'company_id' })
    company: Company
}
