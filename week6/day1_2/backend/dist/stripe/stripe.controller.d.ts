import { StripeService } from './stripe.service';
export declare class StripeController {
    private stripeService;
    constructor(stripeService: StripeService);
    handleWebhook(signature: string, req: any): Promise<{
        received: boolean;
    }>;
}
