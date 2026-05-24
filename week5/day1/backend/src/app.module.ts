import { Module } from '@nestjs/common';
import { CommentsGateway } from './comments/comments.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [CommentsGateway],
})
export class AppModule {}
