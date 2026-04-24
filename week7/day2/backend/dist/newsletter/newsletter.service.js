"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
const subscriber_entity_1 = require("./subscriber.entity");
let NewsletterService = class NewsletterService {
    constructor(subscriberRepository, configService) {
        this.subscriberRepository = subscriberRepository;
        this.configService = configService;
    }
    async subscribe(subscribeDto) {
        const { email } = subscribeDto;
        const existing = await this.subscriberRepository.findOne({ where: { email } });
        if (existing) {
            throw new common_1.ConflictException('This email is already subscribed to our newsletter.');
        }
        await this.addToBrevo(email);
        await this.sendConfirmationEmail(email);
        const subscriber = this.subscriberRepository.create({ email });
        await this.subscriberRepository.save(subscriber);
        return { message: 'Successfully subscribed to the newsletter! Check your email for confirmation.' };
    }
    async addToBrevo(email) {
        const apiKey = this.configService.get('BREVO_API_KEY');
        try {
            await axios_1.default.post('https://api.brevo.com/v3/contacts', {
                email,
                updateEnabled: true,
                listIds: [2],
            }, {
                headers: {
                    accept: 'application/json',
                    'api-key': apiKey,
                    'content-type': 'application/json',
                },
            });
        }
        catch (error) {
            if (error.response?.status !== 400) {
                throw new common_1.InternalServerErrorException('Failed to add contact to newsletter service.');
            }
        }
    }
    async sendConfirmationEmail(email) {
        const apiKey = this.configService.get('BREVO_API_KEY');
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
            await axios_1.default.post('https://api.brevo.com/v3/smtp/email', {
                sender: { name: 'Circlechain', email: 'noreply@circlechain.io' },
                to: [{ email }],
                subject: '🎉 Welcome to Circlechain Newsletter!',
                htmlContent,
            }, {
                headers: {
                    accept: 'application/json',
                    'api-key': apiKey,
                    'content-type': 'application/json',
                },
            });
        }
        catch (error) {
            console.error('Failed to send confirmation email:', error.response?.data || error.message);
        }
    }
};
exports.NewsletterService = NewsletterService;
exports.NewsletterService = NewsletterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscriber_entity_1.Subscriber)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], NewsletterService);
//# sourceMappingURL=newsletter.service.js.map