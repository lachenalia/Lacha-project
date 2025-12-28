import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { HabitEntity } from './habit.entity';

@Entity('habit_logs')
@Unique(['habitId', 'logDate'])
export class HabitLogEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'habit_id', type: 'bigint' })
  habitId: number;

  @ManyToOne(() => HabitEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'habit_id' })
  habit: HabitEntity;

  @Column({ name: 'log_date', type: 'date' })
  logDate: string;

  @Column({ name: 'is_success', type: 'boolean' })
  isSuccess: boolean;

  @Column({ type: 'text', nullable: true })
  note: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
