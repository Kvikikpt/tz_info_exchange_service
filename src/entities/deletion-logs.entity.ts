import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class DeletionLogs {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  shareCode!: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  public created_at!: Date;
}
