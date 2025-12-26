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
import { NoteCategoryEntity } from './note-category.entity';

@Entity()
export class NoteEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column()
  userId!: number;

  @ManyToOne(() => NoteCategoryEntity)
  @JoinColumn({ name: 'category_id' })
  category!: NoteCategoryEntity;

  @Column({ nullable: true })
  categoryId?: number | null;

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
