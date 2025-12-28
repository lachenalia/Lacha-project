import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/user.entity';

@Entity({ name: 'sudoku_logs' })
export class SudokuLogEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ name: 'user_id', type: 'bigint' })
  userId!: number;

  @Column({ type: 'smallint' })
  difficulty!: number;

  @Column({ type: 'boolean' })
  result!: boolean;

  @Column({ name: 'play_time_sec', type: 'integer' })
  playTimeSec!: number;

  @Column({ name: 'use_hint', type: 'integer', default: 0 })
  useHint!: number;

  @Column({ name: 'life_lost', type: 'integer', default: 0 })
  lifeLost!: number;

  @Column({ name: 'attempt_count', type: 'integer', default: 1 })
  attemptCount!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
