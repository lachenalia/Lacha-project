import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { MemoCategoryEntity } from './memo-category.entity';

@Entity()
export class MemoEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' }) // Explicit is better for existing schema safety or if needed, but strategy should handle it. Strategy handles `relationName_referencedColumnName`. If relation is `user` and user entity key is `id`, it becomes `user_id`.
  user!: UserEntity;

  @Column()
  userId!: number;

  @ManyToOne(() => MemoCategoryEntity)
  @JoinColumn({ name: 'category_id' })
  category!: MemoCategoryEntity;

  @Column({ nullable: true })
  categoryId!: number;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
