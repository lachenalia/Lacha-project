import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { CategoryEntity } from '../category/category.entity';

@Entity('habits')
export class HabitEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  categoryName: string;

  @Column({ name: 'category_id', type: 'integer', nullable: true })
  categoryId: number;

  @ManyToOne(() => CategoryEntity, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @Column({
    type: 'varchar',
    length: 10,
    name: 'repeat_type',
  })
  repeatType: 'daily' | 'weekly' | 'monthly' | 'custom';

  @Column({ type: 'jsonb', name: 'repeat_config', nullable: true })
  repeatConfig: any;

  @Column({ type: 'date', name: 'start_date' })
  startDate: string;

  @Column({ type: 'date', name: 'end_date', nullable: true })
  endDate: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
