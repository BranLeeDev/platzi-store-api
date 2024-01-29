// NestJS modules
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party libraries
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Entities
import { User } from '../../entities/user.entity';

// DTOs
import { CreateUserDto, UpdateUserDto } from '../../dtos';

// Services
import { CustomersService } from '../customers/customers.service';

// Module imports
import { BaseService } from '../../../common/base.service';

// Config imports
import registers from '../../../../configs/registers';
import { ConfigType } from '@nestjs/config';
import { ROLES } from '../../types/enums';
import { PayloadToken } from 'src/modules/auth/types/interfaces';

@Injectable()
export class UsersService extends BaseService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly customersService: CustomersService,
    @Inject(registers.KEY)
    private readonly registerService: ConfigType<typeof registers>,
  ) {
    super();
  }

  private async checkUniqueEmailAndUsername(email: string, username: string) {
    const existingEmail = await this.userRepo.findOne({ where: { email } });
    if (existingEmail) {
      throw new ConflictException(
        `The email ${email} is already in use. Please choose a different email.`,
      );
    }
    const existingUsername = await this.userRepo.findOne({
      where: { username },
    });
    if (existingUsername) {
      throw new ConflictException(
        `The username ${username} is already in use. Please choose a different username.`,
      );
    }
  }

  async findAll() {
    try {
      const usersList = await this.userRepo.find({
        relations: ['customer'],
      });
      return usersList;
    } catch (error) {
      this.catchError(error);
    }
  }

  async findUserById(userId: number) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw new NotFoundException(`User #${userId} not Found`);
      return user;
    } catch (error) {
      this.catchError(error);
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.userRepo.findOne({ where: { email } });
      return user;
    } catch (error) {
      this.catchError(error);
    }
  }

  async findOne(userId: number) {
    try {
      const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: ['customer'],
      });
      if (!user) throw new NotFoundException(`User #${userId} not Found`);
      return user;
    } catch (error) {
      this.catchError(error);
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = this.userRepo.create(createUserDto);
      if (
        createUserDto.masterPassword !== this.registerService.masterPassword &&
        createUserDto.role === ROLES.ADMIN
      )
        throw new UnauthorizedException('Invalid master password');
      const hashPassword = await bcrypt.hash(newUser.password, 10);
      newUser.password = hashPassword;
      const { email, username } = createUserDto;
      await this.checkUniqueEmailAndUsername(email, username);
      if (createUserDto.customerId) {
        const customer = await this.customersService.findCustomerById(
          createUserDto.customerId,
        );
        newUser.customer = customer;
      }

      const createdUser = await this.userRepo.save(newUser);
      return createdUser;
    } catch (error) {
      this.catchError(error);
    }
  }

  async update(
    userId: number,
    payloadToken: PayloadToken,
    updateUserDto: UpdateUserDto,
  ) {
    try {
      if (payloadToken.sub !== userId && payloadToken.role !== ROLES.ADMIN)
        throw new UnauthorizedException(
          'You do not have the necessary permissions to update the details for this user',
        );
      const userFound = await this.findUserById(userId);
      this.userRepo.merge(userFound, updateUserDto);
      const updatedUser = await this.userRepo.save(userFound);
      return updatedUser;
    } catch (error) {
      this.catchError(error);
    }
  }

  async delete(userId: number, payloadToken: PayloadToken) {
    try {
      if (payloadToken.sub !== userId && payloadToken.role !== ROLES.ADMIN)
        throw new UnauthorizedException(
          'You do not have the necessary permissions to delete this user',
        );
      const deletedUser = await this.findUserById(userId);
      await this.userRepo.delete(userId);
      return deletedUser;
    } catch (error) {
      this.catchError(error);
    }
  }
}
