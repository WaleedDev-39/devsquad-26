import { Controller, Get, Param, Post, UseGuards, Req, Put, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':username')
  getProfile(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('follow/:id')
  followUser(@Req() req, @Param('id') id: string) {
    return this.usersService.followUser(req.user._id, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('profile')
  updateProfile(@Req() req, @Body() body) {
    return this.usersService.updateProfile(req.user._id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req) {
    return this.usersService.findById(req.user._id);
  }
}
