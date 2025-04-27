import moment from 'moment';
import Base from 'src/common/entity/base.entity';
import { CompanyEmployee } from 'src/modules/company-employee/entity/company-employee.entity';
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('work_log')
export class Worklog extends Base {
  @Column({ name: 'tasks_completed', type: 'text', nullable: true })
  tasksCompleted: string;

  @Column({ name: 'tasks_in_progress', type: 'text', nullable: true })
  tasksInProgress: string;

  @Column({ name: 'challenges_faced', type: 'text', nullable: true })
  challengesFaced: string;

  @Column({ name: 'planned_tasks_for_tomorrow', type: 'text', nullable: true })
  plannedTasksForTomorrow: string;

  @Column({ name: 'remarks', type: 'text', nullable: true })
  remarks: string;

  @ManyToOne(
    () => CompanyEmployee,
    (companyEmployee) => companyEmployee.worklog,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'company_employee_id' })
  companyEmployee: CompanyEmployee;

  editable: boolean; // transient field

  @AfterLoad()
  setEditable() {
    this.editable = moment(this.createdAt).isSame(moment(), 'day');
  }
}
