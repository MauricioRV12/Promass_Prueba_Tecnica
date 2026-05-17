import { Users } from "src/auth/entities/users.entity";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, Generated, ManyToOne, JoinColumn } from "typeorm";

@Entity('policy_requests')
export class PolicyRequests {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  folio: string;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column()
  product: string;

  @Column()
  insuredAmount: number;

  @Column({ default: 'pending', enum: ['pending', 'issued'] })
  status: string;

  @ManyToOne(() => Users, users => users.policyRequests)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
