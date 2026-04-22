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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const auth_service_1 = require("../auth.service");
const config_1 = require("@nestjs/config");
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    constructor(authService, configService) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get('API_URL')
                ? `${configService.get('API_URL').replace(/\/api$/, '')}/api/auth/google/callback`
                : 'http://localhost:5000/api/auth/google/callback',
            scope: ['email', 'profile'],
        });
        this.authService = authService;
        this.configService = configService;
        console.log('GoogleStrategy initialized with Client ID:', configService.get('GOOGLE_CLIENT_ID')?.substring(0, 10) + '...');
    }
    async validate(accessToken, refreshToken, profile, done) {
        const { id, name, emails, photos } = profile;
        const userProfile = {
            provider: 'google',
            providerId: id,
            email: emails[0].value,
            name: `${name.givenName || ''} ${name.familyName || ''}`.trim() || emails[0].value.split('@')[0],
            avatar: photos[0]?.value,
        };
        const result = await this.authService.validateOAuthLogin(userProfile);
        done(null, result);
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], GoogleStrategy);
//# sourceMappingURL=google.strategy.js.map