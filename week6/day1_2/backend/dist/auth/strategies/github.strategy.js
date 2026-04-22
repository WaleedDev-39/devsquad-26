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
exports.GithubStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_github2_1 = require("passport-github2");
const auth_service_1 = require("../auth.service");
const config_1 = require("@nestjs/config");
let GithubStrategy = class GithubStrategy extends (0, passport_1.PassportStrategy)(passport_github2_1.Strategy, 'github') {
    constructor(authService, configService) {
        super({
            clientID: configService.get('GITHUB_CLIENT_ID'),
            clientSecret: configService.get('GITHUB_CLIENT_SECRET'),
            callbackURL: configService.get('API_URL')
                ? `${configService.get('API_URL').replace(/\/api$/, '')}/api/auth/github/callback`
                : 'http://localhost:5000/api/auth/github/callback',
            scope: ['user:email'],
        });
        this.authService = authService;
        this.configService = configService;
        console.log('GithubStrategy initialized with Client ID:', configService.get('GITHUB_CLIENT_ID')?.substring(0, 10) + '...');
    }
    async validate(accessToken, refreshToken, profile, done) {
        const { id, displayName, username, emails, photos } = profile;
        const email = emails?.[0]?.value || `${username}@github.com`;
        const userProfile = {
            provider: 'github',
            providerId: id,
            email: email,
            name: displayName || username,
            avatar: photos?.[0]?.value,
        };
        const result = await this.authService.validateOAuthLogin(userProfile);
        done(null, result);
    }
};
exports.GithubStrategy = GithubStrategy;
exports.GithubStrategy = GithubStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], GithubStrategy);
//# sourceMappingURL=github.strategy.js.map