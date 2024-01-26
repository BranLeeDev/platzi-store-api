// NestJS modules
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// Service imports
import { UsersService } from '../../services';

// DTO imports
import { CreateUserDto, UpdateUserDto } from '../../dtos';

// Entity imports
import { User } from '../../entities';

// Module imports
import { BaseController } from '../../../common/base.controller';

@ApiTags('users')
@Controller('users')
export class UsersController extends BaseController {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all users',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [User],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - This endpoint does not accept content',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async getAllUsers(@Body() body: any) {
    try {
      this.validateEmptyBody(body);
      const res = await this.usersService.findAll();
      return res;
    } catch (error) {
      this.catchError(error);
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Create a user',
    description: 'Create a new user',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - The user data is invalid or the name does not meet the requirements',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const res = await this.usersService.create(createUserDto);
      return {
        message: 'User created successfully',
        data: res,
      };
    } catch (error) {
      this.catchError(error);
    }
  }

  @Get(':userId')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve details of a specific user by ID',
  })
  @ApiParam({
    name: 'userId',
    type: 'number',
    description: 'ID of the user',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'User details', type: User })
  @ApiResponse({
    status: 400,
    description: 'Bad request - This endpoint does not accept content',
  })
  @ApiResponse({
    status: 404,
    description: 'User not Found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async getUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: any,
  ) {
    try {
      this.validateEmptyBody(body);
      const res = await this.usersService.findOne(userId);
      return res;
    } catch (error) {
      this.catchError(error);
    }
  }

  @Patch(':userId')
  @ApiOperation({
    summary: 'Update user by ID',
    description: 'Update details of a specific user by ID',
  })
  @ApiParam({
    name: 'userId',
    type: 'number',
    description: 'ID of the user to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - The update data is invalid or incomplete',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found - The specified user ID does not exist',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - An unexpected error occurred',
  })
  async updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const res = await this.usersService.update(userId, updateUserDto);
      return {
        message: 'User updated successfully',
        data: res,
      };
    } catch (error) {
      this.catchError(error);
    }
  }

  @Delete(':userId')
  @ApiOperation({
    summary: 'Delete user by ID',
    description: 'Delete a specific user by ID',
  })
  @ApiParam({
    name: 'userId',
    type: 'number',
    description: 'ID of the user to delete',
  })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async deleteUser(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    try {
      this.validateEmptyBody(body);
      const res = await this.usersService.delete(id);
      return {
        message: 'User deleted successfully',
        data: res,
      };
    } catch (error) {
      this.catchError(error);
    }
  }
}
