import { PolicyRequests } from "src/policy-requests/entities/policy-requests.entity";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user', enum: ['user', 'admin', 'supervisor'] })
  role: string;

  @Column({ default: 'active', enum: ['active', 'inactive']})
  status: string

  @OneToMany(() => PolicyRequests, policyRequests => policyRequests.user)
  policyRequests: PolicyRequests[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
