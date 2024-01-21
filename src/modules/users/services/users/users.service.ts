// NestJS modules
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Third-party libraries
import { Repository } from 'typeorm';

// DTO imports
import { CreateUserDto } from '../../dtos/users/create-user.dto';
import { UpdateUserDto } from '../../dtos/users/update-user.dto';

// Entity imports
import { User } from '../../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  findAll() {
    return this.userRepo.find();
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException(`User #${id} not Found`);
    return user;
  }

  async create(payload: CreateUserDto) {
    const newUser = this.userRepo.create(payload);
    await this.userRepo.save(newUser);

    return {
      message: 'User created successfully',
      data: newUser,
    };
  }

  async update(id: number, payload: UpdateUserDto) {
    const userFound = await this.findOne(id);
    this.userRepo.merge(userFound, payload);
    const updatedResult = await this.userRepo.save(userFound);

    return {
      message: 'User updated successfully',
      data: updatedResult,
    };
  }

  async delete(id: number) {
    const deletedUser = await this.findOne(id);
    await this.userRepo.delete(id);

    return {
      message: 'User deleted successfully',
      data: deletedUser,
    };
  }
}
