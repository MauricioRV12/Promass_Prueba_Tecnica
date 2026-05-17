import { Injectable, HttpStatus, HttpException, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PolicyRequests } from "./entities/policy-requests.entity";
import { Repository, Brackets } from "typeorm";
import { CreatePolicyRequestDto } from "./dto/create-policy-request.dto";
import { UpdatePolicyRequestDto } from "./dto/update-policy-request.dto";
import { Users } from "src/auth/entities/users.entity";
import { FiltersToRequestDto } from "./dto/filters-to-request.dto";
import type { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class PolicyRequestsService {
  constructor(
    @InjectRepository(PolicyRequests)
    private readonly policyReqRepo: Repository<PolicyRequests>,
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async createPolicyRequest(req: any, createDto: CreatePolicyRequestDto) {    
    try {
      const newRequest = this.policyReqRepo.create({ ...createDto, user: { id: req.user.id }});
      await this.policyReqRepo.save(newRequest);

      return {
        status: HttpStatus.CREATED,
        message: 'Policy request created successfully',
        data: newRequest,
      }
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Error creating policy request", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllPolicyRequests(filters: FiltersToRequestDto) {  // debo listar solicitudes con paginación, filtro por status y busqueda por customerName o folio
    try {
      const { status, customerName, folio, numRequests } = filters;

      const cacheKey = `policy_requests_${status}_ ${customerName}_${folio}_${numRequests}`;

      const cached = await this.cacheManager.get(cacheKey);

      if(cached) {
        return {
          status: HttpStatus.OK,
          message: 'Policy requests fetched successfully (from cache)',
          data: cached,
        }
      }
      
      const query = this.policyReqRepo.createQueryBuilder('policy_requests')
      .where('policy_requests.status = :status', { status })
      .andWhere(
        new Brackets(qb => {
          qb.where('policy_requests.customerName LIKE :customerName', { customerName: `%${customerName}%`})
          .orWhere('policy_requests.folio LIKE :folio', { folio: `%${folio}%` })
        })
      )
      .orderBy('policy_requests.createdAt', 'DESC')
      .take(numRequests);

      const requests = await query.getMany();

      const response = {
        status: HttpStatus.OK,
        message: 'Policy requests fetched successfully',
        data: requests,
      };

      await this.cacheManager.set(cacheKey, response, 300);

      return response;

    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Error fetching policy requests", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  } 

  async getPolicyRequestById(id: number) {
    try {
      const findRequest = await this.policyReqRepo.findOne({ where: { id }});
      if (!findRequest) {
        throw new HttpException("Policy request not found", HttpStatus.NOT_FOUND);
      }
      return findRequest;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Error fetching policy request", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updatePolicyRequest(req: any, updatePolicyDto: UpdatePolicyRequestDto) {
    const id = req.user.id;
    try {
      const { status } = updatePolicyDto;
      const findUser = await this.usersRepo.findOne({ where: { id }});
      if (!findUser) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }

      if(findUser.role !== 'admin' && findUser.role !== 'supervisor') {
        throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
      }

      const findRequest = await this.policyReqRepo.findOne({ where: { id }});
      if(!findRequest) {
        throw new HttpException("Policy request not found", HttpStatus.NOT_FOUND);
      }

      if(findRequest.status === 'issued' && status === 'pending') {
        throw new HttpException("Cannot change status from issued back to pending", HttpStatus.BAD_REQUEST);
      }

      await this.policyReqRepo.update(id, { status });

      return {
        status: HttpStatus.OK,
        message: 'Policy request updated successfully',
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Error updating policy request", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}