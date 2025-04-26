import { BaseEntity, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

abstract class Base extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'update_at', select: false })
    updatedAt: Date

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date
}

export default Base
