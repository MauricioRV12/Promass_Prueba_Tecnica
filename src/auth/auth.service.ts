import { Injectable, HttpException, HttpStatus, BadRequestException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Users } from "./entities/users.entity";
import { SignupDto } from "./dto/signup.dto";
import * as bcrypt from 'bcrypt';
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signupDto: SignupDto) {
    const user = await this.usersRepo.findOne({ where: [
      { email: signupDto.email },
      { username: signupDto.username }
    ]});
    
    if(user) {
      throw new ConflictException("User already exists");
    }
    
    try {
      const hashed = await bcrypt.hash(signupDto.password, 10);
      
      const createUser = this.usersRepo.create({
        ...signupDto,
        password: hashed,
      });

      await this.usersRepo.save(createUser);

      return {
        status: HttpStatus.CREATED,
        message: "User created successfully",
        data: createUser,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException("Error creating user", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginDto: LoginDto) {
    const userFound = await this.usersRepo.findOne({ where: { username: loginDto.username }});
    if(!userFound) {
      throw new BadRequestException("Invalid credentials");
    }
    
    if(userFound.status === 'inactive') {
      throw new BadRequestException("User is inactive");
    }
    
    const isValid = await bcrypt.compare(loginDto.password, userFound.password);
    if(!isValid) {
      throw new BadRequestException("Invalid credentials");
    }
    
    try {
      const token = await this.jwtService.signAsync({ id: userFound.id, username: userFound.username });

      return {
        status: HttpStatus.OK,
        message: 'Access granted',
        user: userFound.username,
        role: userFound.role,
        token 
      };
    } catch (error) {
      console.log(error);
      throw new HttpException("Error logging in", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deactivateUser(userId: number) {
    try {
      const userFound = await this.usersRepo.findOne({ where: { id: userId }});
      if(!userFound) {
        throw new Error("User not found");
      }

      userFound.status = 'inactive';
      await this.usersRepo.save(userFound);
      return { message: "User deactivated successfully" };
    } catch (error) {
      throw new HttpException("Error deactivating user", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}