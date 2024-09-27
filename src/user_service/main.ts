import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConfigModule } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { configureSwagger } from "../shared/api/docs/swagger";
import { HealthModule } from "../shared/api/health/module";
import { AuthMiddleware } from "../shared/api/middleware/authentication";
import { UserModule } from "./api/user.module";

@Module({
  imports: [
    UserModule,
    HealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude("health_check").forRoutes("*");
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["verbose"],
  });
  app.setGlobalPrefix("api");
  configureSwagger(app);
  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT", 3000);
  await app.listen(port);
}

bootstrap();
