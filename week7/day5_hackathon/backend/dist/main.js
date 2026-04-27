"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
let cachedServer;
async function bootstrap() {
    if (!cachedServer) {
        const expressApp = (0, express_1.default)();
        const nestApp = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp));
        nestApp.enableCors({
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
        });
        nestApp.setGlobalPrefix('api');
        nestApp.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
        await nestApp.init();
        cachedServer = expressApp;
    }
    return cachedServer;
}
exports.default = async (req, res) => {
    const server = await bootstrap();
    return server(req, res);
};
if (process.env.NODE_ENV !== 'production') {
    async function startLocal() {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors({ origin: 'http://localhost:3000', credentials: true });
        app.setGlobalPrefix('api');
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
        const port = process.env.PORT || 3001;
        await app.listen(port);
        console.log(`🚀 POS Backend running on http://localhost:${port}/api`);
    }
    startLocal();
}
//# sourceMappingURL=main.js.map