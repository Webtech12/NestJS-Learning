import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(LoginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.userService.findOne(LoginDto);
    const passwordMatched = await bcrypt.compare(
      LoginDto.password,
      user.password,
    );
    if (passwordMatched) {
      delete user.password;
      //   return user;
      const payload = this.jwtService.sign({ email: user.email, sub: user.id });
      return { access_token: payload };
    } else {
      throw new UnauthorizedException('Password does not match');
    }
  }
}
