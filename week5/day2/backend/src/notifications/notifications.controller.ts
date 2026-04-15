import { Controller, Get, UseGuards, Req, Put, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getForUser(@Req() req) {
    return this.notificationsService.getForUser(req.user._id);
  }

  @Put(':id/read')
  @UseGuards(AuthGuard('jwt'))
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
