import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import { createModule } from "../../shared/server/api/abstract.module";
import { bootstrap } from "../../shared/server/config/config.startup";
import { HealthModule } from "../../shared/server/health/module";
import { AuthMiddleware } from "../../shared/server/middleware/authentication";
import { UserModule } from "./user.module";

const configSettings: Record<string, any> = {
  envFilePath:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
};

@Module(createModule([UserModule, HealthModule], configSettings))
class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude("health_check").forRoutes("*");
  }
}

bootstrap(AppModule);
