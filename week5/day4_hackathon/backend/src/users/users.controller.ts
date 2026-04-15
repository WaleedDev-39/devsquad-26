import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    return this.usersService.getProfile(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateProfile(@Req() req, @Body() body: any) {
    return this.usersService.updateProfile(req.user._id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/address')
  updateAddress(@Req() req, @Body() body: any) {
    return this.usersService.updateAddress(req.user._id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/traffic-info')
  updateTrafficInfo(@Req() req, @Body() body: any) {
    return this.usersService.updateTrafficInfo(req.user._id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  updatePassword(@Req() req, @Body() body: { password: string }) {
    return this.usersService.updatePassword(req.user._id, body.password);
  }
}
