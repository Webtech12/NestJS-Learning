import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private userService: UsersService) {}
  @Post('signup')
  signup(
    @Body()
    createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.userService.create(createUserDto);
  }
}
