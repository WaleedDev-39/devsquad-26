import { Controller, Post, Headers, Req, BadRequestException } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('webhook')
  async handleWebhook(@Headers('stripe-signature') signature: string, @Req() req: any) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    
    // We need the raw body for Stripe webhook verification
    // NestJS raw body is available on req.rawBody if configured in main.ts
    const rawBody = req.rawBody;
    if (!rawBody) {
      throw new BadRequestException('Raw body not available. Ensure rawBody is enabled in main.ts');
    }

    try {
      await this.stripeService.handleWebhook(signature, rawBody);
      return { received: true };
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }
}
