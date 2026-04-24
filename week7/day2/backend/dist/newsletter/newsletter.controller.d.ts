import { NewsletterService } from './newsletter.service';
import { SubscribeDto } from './subscribe.dto';
export declare class NewsletterController {
    private readonly newsletterService;
    constructor(newsletterService: NewsletterService);
    subscribe(subscribeDto: SubscribeDto): Promise<{
        message: string;
    }>;
}
