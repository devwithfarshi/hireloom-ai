import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateDto } from './dto/user.dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
  @Put()
  async updateUser(@GetUser('id') userId: string, @Body() body: UpdateDto) {
    const updatedUser = await this.userService.updateUser(userId, body);
    return updatedUser;
  }
}
