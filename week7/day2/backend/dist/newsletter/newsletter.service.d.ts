import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Subscriber } from './subscriber.entity';
import { SubscribeDto } from './subscribe.dto';
export declare class NewsletterService {
    private subscriberRepository;
    private configService;
    constructor(subscriberRepository: Repository<Subscriber>, configService: ConfigService);
    subscribe(subscribeDto: SubscribeDto): Promise<{
        message: string;
    }>;
    private addToBrevo;
    private sendConfirmationEmail;
}
