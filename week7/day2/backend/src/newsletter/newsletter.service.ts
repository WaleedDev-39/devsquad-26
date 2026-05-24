import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Subscriber } from './subscriber.entity';
import { SubscribeDto } from './subscribe.dto';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(Subscriber)
    private subscriberRepository: Repository<Subscriber>,
    private configService: ConfigService,
  ) {}

  async subscribe(subscribeDto: SubscribeDto): Promise<{ message: string }> {
    const { email } = subscribeDto;

    // Check if already subscribed
    const existing = await this.subscriberRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('This email is already subscribed to our newsletter.');
    }

    // Add to Brevo contact list
    await this.addToBrevo(email);

    // Send confirmation email via Brevo
    await this.sendConfirmationEmail(email);

    // Save to database
    const subscriber = this.subscriberRepository.create({ email });
    await this.subscriberRepository.save(subscriber);

    return { message: 'Successfully subscribed to the newsletter! Check your email for confirmation.' };
  }

  private async addToBrevo(email: string): Promise<void> {
    const apiKey = this.configService.get<string>('BREVO_API_KEY');
    try {
      await axios.post(
        'https://api.brevo.com/v3/contacts',
        {
          email,
          updateEnabled: true,
          listIds: [2], // Default list ID — change as needed
        },
        {
          headers: {
            accept: 'application/json',
            'api-key': apiKey,
            'content-type': 'application/json',
          },
        },
      );
    } catch (error) {
      if (error.response?.status !== 400) {
        // 400 means contact already exists in Brevo, that's okay
        throw new InternalServerErrorException('Failed to add contact to newsletter service.');
      }
    }
  }

  private async sendConfirmationEmail(email: string): Promise<void> {
    const apiKey = this.configService.get<string>('BREVO_API_KEY');
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Circlechain Newsletter</title>
</head>
<body style="margin:0;padding:0;background-color:#070B0E;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#070B0E;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0D1117,#111827);border-radius:16px;border:1px solid #1a2332;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0a1628,#0d2040);padding:40px 40px 30px;text-align:center;">
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="vertical-align:middle;padding-right:12px;">
                    <div style="width:36px;height:36px;background:#00E676;border-radius:8px;display:inline-block;line-height:36px;text-align:center;">
                      <span style="color:#000;font-weight:900;font-size:18px;">C</span>
                    </div>
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="color:#ffffff;font-size:24px;font-weight:700;letter-spacing:1px;">Circlechain</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Hero banner -->
          <tr>
            <td style="padding:0;background:linear-gradient(180deg,#0d2040 0%,#0D1117 100%);">
              <div style="text-align:center;padding:30px 40px 10px;">
                <div style="display:inline-block;background:rgba(0,230,118,0.1);border:1px solid rgba(0,230,118,0.3);border-radius:50%;width:80px;height:80px;line-height:80px;font-size:36px;margin-bottom:20px;">🎉</div>
              </div>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:20px 40px 40px;">
              <h1 style="color:#ffffff;font-size:28px;font-weight:700;text-align:center;margin:0 0 12px;">You're In!</h1>
              <p style="color:#9CA3AF;font-size:16px;text-align:center;margin:0 0 30px;line-height:1.6;">
                Welcome to the <strong style="color:#00E676;">Circlechain</strong> newsletter.<br>
                You'll be the first to know about crypto market updates, new features, and exclusive insights.
              </p>
              <!-- Divider -->
              <div style="height:1px;background:linear-gradient(90deg,transparent,#1a2332,transparent);margin:0 0 30px;"></div>
              <!-- Features -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 0 16px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:40px;vertical-align:top;padding-top:2px;">
                          <div style="width:28px;height:28px;background:rgba(0,230,118,0.15);border-radius:50%;text-align:center;line-height:28px;font-size:14px;">📈</div>
                        </td>
                        <td style="padding-left:12px;">
                          <div style="color:#ffffff;font-weight:600;font-size:14px;margin-bottom:2px;">Real-time Market Trends</div>
                          <div style="color:#6B7280;font-size:13px;">Live crypto prices and market analysis delivered to your inbox.</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 16px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:40px;vertical-align:top;padding-top:2px;">
                          <div style="width:28px;height:28px;background:rgba(0,230,118,0.15);border-radius:50%;text-align:center;line-height:28px;font-size:14px;">🔔</div>
                        </td>
                        <td style="padding-left:12px;">
                          <div style="color:#ffffff;font-weight:600;font-size:14px;margin-bottom:2px;">Exclusive Alerts</div>
                          <div style="color:#6B7280;font-size:13px;">Be the first to know about major market moves and new token listings.</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 16px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:40px;vertical-align:top;padding-top:2px;">
                          <div style="width:28px;height:28px;background:rgba(0,230,118,0.15);border-radius:50%;text-align:center;line-height:28px;font-size:14px;">🛡️</div>
                        </td>
                        <td style="padding-left:12px;">
                          <div style="color:#ffffff;font-weight:600;font-size:14px;margin-bottom:2px;">Web3 Insights</div>
                          <div style="color:#6B7280;font-size:13px;">Expert blockchain analysis and DeFi guides from the Circlechain team.</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <!-- CTA Button -->
              <div style="text-align:center;margin:30px 0 0;">
                <a href="http://localhost:3000" style="display:inline-block;background:#00E676;color:#000000;font-weight:700;font-size:15px;text-decoration:none;padding:14px 36px;border-radius:8px;letter-spacing:0.5px;">
                  Explore Platform →
                </a>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#0a0f16;padding:20px 40px;text-align:center;border-top:1px solid #1a2332;">
              <p style="color:#4B5563;font-size:12px;margin:0 0 8px;">© 2022 Circlechain. All rights reserved.</p>
              <p style="color:#374151;font-size:11px;margin:0;">
                You received this email because you subscribed to Circlechain newsletter.<br>
                <a href="#" style="color:#6B7280;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    try {
      await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: { name: 'Circlechain', email: 'noreply@circlechain.io' },
          to: [{ email }],
          subject: '🎉 Welcome to Circlechain Newsletter!',
          htmlContent,
        },
        {
          headers: {
            accept: 'application/json',
            'api-key': apiKey,
            'content-type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.error('Failed to send confirmation email:', error.response?.data || error.message);
      // Don't throw — subscription still succeeded
    }
  }
}
