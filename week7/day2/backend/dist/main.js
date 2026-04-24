"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    if (process.env.NODE_ENV !== 'production') {
        await app.listen(process.env.PORT || 3001);
        console.log(`🚀 Backend running on http://localhost:${process.env.PORT || 3001}`);
    }
    await app.init();
}
let cachedApp;
if (process.env.NODE_ENV !== 'production') {
    bootstrap();
}
exports.default = async (req, res) => {
    if (!cachedApp) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.setGlobalPrefix('api');
        app.enableCors({
            origin: process.env.FRONTEND_URL || '*',
            credentials: true,
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        await app.init();
        cachedApp = app.getHttpAdapter().getInstance();
    }
    return cachedApp(req, res);
};
//# sourceMappingURL=main.js.map