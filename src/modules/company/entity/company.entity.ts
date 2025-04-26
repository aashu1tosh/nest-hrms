import Base from 'src/common/entity/base.entity';
import { Column, Entity } from 'typeorm';

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
}