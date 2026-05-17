import { Module } from "@nestjs/common";
import { PolicyRequestsController } from "./policy-requests.controller";
import { PolicyRequestsService } from "./policy-requests.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PolicyRequests } from "./entities/policy-requests.entity";
import { Users } from "src/auth/entities/users.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PolicyRequests, Users])],
  controllers: [PolicyRequestsController],
  providers: [PolicyRequestsService],
})

export class PolicyRequestsModule {}