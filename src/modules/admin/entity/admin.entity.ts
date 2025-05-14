import Base from 'src/common/entity/base.entity';
import { Auth } from 'src/modules/auth/entity/auth.entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity('admin')
export class Admin extends Base {
  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'middle_name', nullable: true })
  middleName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  //   @OneToMany(() => Media, (media) => media.admin)
  //   media: Media[]

  @OneToOne(() => Auth, (auth) => auth.admin, {
    cascade: true,
  })
  auth: Auth;
}
